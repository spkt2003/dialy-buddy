// TODO: Currently uses Gemini only to read a QR code, not to analyze blood values.
// For production: send full blood test image to Gemini with a medical analysis prompt,
// parse structured output, and store real values in Supabase instead of hardcoded sets.

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabaseClient";
import { SAMPLE_RESULTS } from "@/lib/sampleResults";

// Instantiated at module scope — the SDK client is stateless and safe to reuse across requests.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType, sampleId: clientSampleId } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Default to SAMPLE_001 (hyperkalemia) — the most clinically relevant fallback for this demo.
    const VALID_SAMPLES = ["SAMPLE_001", "SAMPLE_002", "SAMPLE_003"];
    let sampleId = "SAMPLE_001";

    if (clientSampleId && VALID_SAMPLES.includes(clientSampleId)) {
      // Client decoded the QR code reliably — trust the whitelist-validated result and skip Gemini.
      sampleId = clientSampleId;
    } else try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        {
          inlineData: {
            // Caller already strips the data-URL prefix, so this is raw base64.
            mimeType: mimeType || "image/jpeg",
            data: imageBase64,
          },
        },
        // Strict format constraint prevents Gemini from wrapping the ID in prose or explanation.
        "Look for a QR code in this image and decode it. Return only the decoded text exactly as it appears (e.g., SAMPLE_001, SAMPLE_002, SAMPLE_003). If no QR code is found or you cannot decode it, return 'UNKNOWN'.",
      ]);

      const text = result.response.text().trim();
      // Whitelist check rejects any Gemini hallucination that isn't a known sample key.
      if (text === "SAMPLE_001" || text === "SAMPLE_002" || text === "SAMPLE_003") {
        sampleId = text;
      }
    } catch {
      // Gemini failure is non-fatal — the demo must work even if the API is slow or unavailable.
    }

    // Double fallback: if somehow sampleId resolved to an unknown key, default to SAMPLE_001.
    const matched = SAMPLE_RESULTS[sampleId] ?? SAMPLE_RESULTS["SAMPLE_001"];

    // visitor_number is GENERATED ALWAYS AS IDENTITY — Postgres auto-increments it; do not insert manually.
    // image_url is intentionally null — no Supabase Storage is used; analysis is matched by QR code only.
    // Isolated try/catch — analytics failure must not block a successful analysis response.
    try {
      await supabase.from("demo_uploads").insert({
        image_url: null,
        analysis_result: matched.bloodValues,
        meal_plan: matched.meals,
        sample_id: sampleId,
      });
    } catch (insertError) {
      console.error("[analyze-blood] Supabase insert failed (non-fatal):", insertError);
    }

    // Return the full SampleResult shape so the client can render blood values, meals, and warning directly.
    return NextResponse.json({
      sampleId: matched.sampleId,
      bloodValues: matched.bloodValues,
      meals: matched.meals,
      warning: matched.warning,
    });
  } catch (error) {
    // Only reaches here if something catastrophic happens (e.g., Supabase unreachable).
    console.error("analyze-blood error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
