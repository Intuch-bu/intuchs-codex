# แนวทางสำหรับ AI Coding Agents

## เป้าหมายของโปรเจกต์

- เจ้าของโปรเจกต์เป็นคนไทยและกำลังเรียน React
- ให้โค้ดเป็นตัวอย่างที่อ่าน เข้าใจ และแก้ไขได้ง่าย
- อธิบายเหตุผลของการตัดสินใจเป็นภาษาไทยเมื่อเหมาะสม โดยคงคำเทคนิค React เช่น Component, Props, State และ Context ได้

## Coding Philosophy

- เลือกความอ่านง่ายเหนือความ clever หรือ scalable เกินความจำเป็น
- ใช้ KISS: เขียนแบบตรงไปตรงมาก่อน และทำทีละการเปลี่ยนแปลงเล็ก ๆ
- อย่าเพิ่ม abstraction ถ้าไม่ได้ลดความสับสนอย่างชัดเจน
- ไม่ต้อง optimize ก่อนพบปัญหาจริง: หลีกเลี่ยง `useMemo`, `useCallback` และ `React.memo` โดยไม่มีเหตุผลที่พิสูจน์ได้

## โครงสร้างโฟลเดอร์

- `src/pages/` เก็บ component ของแต่ละ route
- `src/components/` เก็บ UI ที่ใช้ซ้ำหรือเป็นส่วนย่อยที่ช่วยให้อ่าน page ง่ายขึ้น
- `src/components/blog/` เก็บ components ที่แสดงหรือค้นหาบทความ
- `src/components/layout/` เก็บ Navbar และ Footer ที่ใช้ข้ามหลายหน้า
- `src/components/member/` เก็บ components ของ profile และ reset password
- `src/components/ui/` คือ shadcn generated components; หลีกเลี่ยงการแก้ไขถ้าไม่จำเป็น
- `src/api/` เก็บฟังก์ชันเรียก HTTP API
- `src/context/` เก็บ React Context
- `src/lib/` เก็บ helper และ mock auth
- `src/constants/` เก็บค่าคงที่ที่ใช้มากกว่าหนึ่งจุด

## React Style

- ใช้ Functional Components และ standard React Hooks
- ตั้งชื่อ React component และไฟล์ component เป็น PascalCase
- ตั้งชื่อ variables/functions เป็นภาษาอังกฤษที่สื่อความหมาย
- ให้ Component ทำหน้าที่เดียวเท่าที่ทำได้ แต่ไม่ต้องแยกไฟล์สำหรับ JSX ชิ้นเล็ก ๆ
- เก็บ form state และ validation ไว้ใน page หากใช้เพียงหน้าเดียว
- ใช้ Context เฉพาะ state ที่หลายส่วนของแอปต้องใช้ร่วมกัน เช่น auth

## กฎการ Refactor

- ห้ามเปลี่ยน UI, UX, route, API contract หรือ localStorage key หากไม่ได้รับอนุมัติชัดเจน
- รักษาพฤติกรรมที่ผู้ใช้เห็นทั้งหมด และตรวจ regression หลังแก้
- ลบ dead code ได้หลังค้นหาการใช้งานทั่วโปรเจกต์แล้วเท่านั้น
- อย่าย้ายไป TypeScript ทั้งโปรเจกต์หรือเปลี่ยน architecture ครั้งใหญ่เพียงเพื่อความสวยงาม
- เพิ่ม comment เฉพาะ logic ที่ไม่ชัดเจน และเขียน comment เป็นภาษาไทย

## เอกสาร

- เมื่อเปลี่ยนโครงสร้างหรือ flow สำคัญ ให้ปรับ README และ `docs/refactor-report.md`
- เอกสารและคำอธิบายสำหรับเจ้าของควรเป็นภาษาไทยแบบสั้นและเข้าใจง่าย

## สิ่งที่ห้ามทำ

- ห้ามเพิ่ม Factory Pattern, Strategy Pattern, Dependency Injection, HOC, Render Props หรือ generic utility layer โดยไม่มีความจำเป็นชัดเจน
- ห้ามเพิ่ม custom hook ที่ซับซ้อนเพื่อแทนโค้ดไม่กี่บรรทัด
- ห้ามเปลี่ยน mock auth ให้เป็น production authentication โดยไม่ได้รับคำขอ
- ห้ามแก้ `components/ui/` เพียงเพื่อจัด style หรือ refactor
- ห้ามทำ large rewrite; เลือกปรับปรุงทีละขั้นและอธิบายผลกระทบเสมอ
