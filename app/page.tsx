import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturesGrid from "../components/home/FeaturesGrid";
import DashboardPreview from "../components/home/DashboardPreview";
import Testimonials from "../components/home/Testimonials";
import PartnersSection from "../components/home/PartnersSection";

export default function Home() {
  /**
   * Home Component (หน้าแรกของแอปพลิเคชัน)
   * 
   * หน้าที่หลัก (Purpose):
   * ทำหน้าที่เป็นหน้า Landing Page หลักของเว็บไซต์ (Root Page /)
   * โดยจะนำเอา Component ย่อยต่างๆ (เช่น Hero, Stats, HowItWorks ฯลฯ) มาประกอบกันเพื่อแสดงผล
   * 
   * การจัดการ State (State Management):
   * - เป็น Server/Static Component ในโครงสร้าง Next.js App Router (ไม่มี "use client")
   * - ไม่มีการใช้ State หรือ Effect ภายในตัวเอง
   * 
   * Business Logic:
   * - ควบคุม Layout ภาพรวมของหน้าแรก โดยมีการวาง Navbar ไว้ด้านบน, Footer ด้านล่าง 
   * - และจัดเรียง Section ย่อยๆ (HeroSection, PartnersSection, ...) ภายใน <main> ตามลำดับเพื่อให้เนื้อหามีความต่อเนื่อง
   */
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <HeroSection />
        <PartnersSection />
        <StatsSection />
        <HowItWorks />
        <FeaturesGrid />
        <DashboardPreview />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
