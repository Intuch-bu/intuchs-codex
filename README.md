# Intuch's Codex

บล็อกส่วนตัวสำหรับบันทึกการเรียนรู้การพัฒนาเว็บและบทความต่าง ๆ โปรเจกต์นี้สร้างขึ้นเพื่อฝึก React ดังนั้นโค้ดตั้งใจให้เรียบง่าย อ่านตามได้ง่าย และเหมาะกับผู้เริ่มต้น

## สิ่งที่มีในโปรเจกต์

- หน้ารวมบทความ พร้อมเลือกหมวดหมู่ ค้นหา และโหลดเพิ่ม
- หน้าอ่านบทความแบบ Markdown
- ระบบสมัครสมาชิก, login, profile และ reset password แบบ mock ด้วย `localStorage`
- Responsive navigation สำหรับ desktop และ mobile

## เทคโนโลยี

- React 19
- Vite
- React Router
- Tailwind CSS
- shadcn UI components
- Axios สำหรับเรียก Blog API

## เริ่มต้นใช้งาน

ต้องมี Node.js 18 ขึ้นไปและ npm

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน terminal (ปกติคือ `http://localhost:5173`)

## คำสั่งที่ใช้บ่อย

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## โครงสร้างโปรเจกต์

```text
src/
├── api/                  # ฟังก์ชันเรียก Blog API
├── assets/               # รูปภาพที่ใช้ในหน้าเว็บ เช่น hero.jpg
├── components/           # React components แยกตามหน้าที่
│   ├── blog/             # ส่วนของหน้า list และรายละเอียดบทความ
│   ├── layout/           # Navbar และ Footer
│   ├── member/           # Sidebar และ layout ของ member pages
│   └── ui/               # shadcn UI components (ไม่แก้ถ้าไม่จำเป็น)
├── constants/            # ข้อมูลคงที่ เช่น category และ author fallback
├── context/              # React Context สำหรับ auth
├── lib/                  # ฟังก์ชันช่วยเหลือและ mock auth
├── pages/                # Component ของแต่ละ route
├── App.jsx               # กำหนด routes
└── main.jsx              # จุดเริ่มต้นของแอป
```

## ข้อมูลสำคัญสำหรับผู้เรียน

- บทความมาจาก external API ใน `src/api/blogApi.js`
- auth เป็นเพียง mock เพื่อการเรียนรู้ ข้อมูลอยู่ใน browser `localStorage` ไม่ใช่ระบบสำหรับ production
- รักษาไฟล์ `src/assets/hero.jpg` ไว้ เพราะ `HeroSection` ใช้แสดงภาพ hero
- อ่านกติกาการแก้โค้ดสำหรับ AI ได้ที่ [AGENT.md](AGENT.md)
- รายละเอียดการ refactor ล่าสุดอยู่ที่ [docs/refactor-report.md](docs/refactor-report.md)
