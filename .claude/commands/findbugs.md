---
allowed-tools: Bash, Read, Edit
argument-hint: [path หรือชื่อฟีเจอร์]
description: รัน test/build จริง หาบั๊ก แล้ววิเคราะห์สาเหตุ
---

Target: $ARGUMENTS

1. ถ้ามี test ที่เกี่ยวข้อง รันด้วย test runner ของโปรเจกต์
2. ถ้าไม่มี test ให้ลองรัน build/dev server เช็ค error
3. ถ้ายังไม่เจอ ให้เขียน test case ครอบคลุม edge case สำหรับ target นี้ แล้วรัน
4. รายงานบั๊กที่เจอ พร้อมสาเหตุ แต่ยังไม่ต้องแก้ — รอผมยืนยันก่อน
