---
allowed-tools: Bash, Read
description: เริ่มงานเช้า เทียบ PROGRESS.md กับ git log
---

1. Read PROGRESS.md at the project root. Focus on the top entry (latest date).
   If the file does not exist, tell me there is no record yet, then skip to step 2.

2. Run `git log --oneline -10` and `git status`.

3. Compare the real code state against what PROGRESS.md claims:
   - If they match, say so.
   - If they differ (e.g. PROGRESS says unfinished but git has a commit
     completing it, or files were changed outside what was recorded),
     point out the differences clearly.

4. Brief summary:
   - What is currently pending
   - Recommend which task to start today first, and why

Do not start editing code yet. Wait for my instruction.
