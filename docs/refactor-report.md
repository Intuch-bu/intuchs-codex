# Refactor Summary

## เป้าหมาย

การ refactor นี้ทำให้โปรเจกต์ React อ่านและตามรอยได้ง่ายขึ้นสำหรับผู้เริ่มต้น โดยคงหน้าตา, interaction, routes, การเรียก API และข้อมูล auth ใน `localStorage` เดิมไว้

## สิ่งที่ปรับปรุง

- ใช้ชื่อไฟล์ React แบบ PascalCase, เปลี่ยน `page` เป็น `pages` และจัด components เป็นโฟลเดอร์ย่อยตามหน้าที่
- แยก API, constants และ components ที่มีหน้าที่ชัดเจน
- แยก search ออกจาก category selector และให้มี search instance เดียว
- ทำให้การสมัครสมาชิกเรียกผ่าน `AuthContext` เหมือน flow auth อื่น
- ลด JSX ซ้ำของหน้า Profile และ Reset Password ด้วย `MemberPageLayout`
- แบ่งส่วนแสดงผลของหน้าอ่านบทความ เพื่อให้ page เหลือ logic หลักที่อ่านตามง่าย
- ลบ mock posts และ dependency ที่ไม่ได้ใช้
- ปรับ README และเพิ่มคู่มือสำหรับ AI agents

## สิ่งที่ตั้งใจไม่เปลี่ยน

- UI, UX, URLs, responsive layout, ข้อความบนหน้าจอ และ flow ที่มีอยู่
- external Blog API และเงื่อนไข `Highlight` ที่หมายถึงทุกหมวดหมู่
- localStorage keys: `blog_users` และ `blog_current_user`
- mock password/localStorage auth เพราะเป็นขอบเขตการเรียนรู้ ไม่ใช่ production security
- shadcn files ใน `src/components/ui/`
- ปุ่มใน login-required dialog ที่ปัจจุบันยังไม่ navigate เพราะการแก้จะเปลี่ยน UX

# Files Changed

| ไฟล์ | สิ่งที่เปลี่ยน | เหตุผลและประโยชน์ |
| --- | --- | --- |
| `src/App.jsx` | อ้าง imports จาก `pages/` และตัด Fragment ที่ไม่จำเป็น | routes อ่านง่ายขึ้นโดยไม่เปลี่ยน route |
| `src/pages/LandingPage.jsx` | อ้าง component ชื่อ PascalCase และจัด format | ชื่อและรูปแบบสม่ำเสมอ |
| `src/pages/LoginPage.jsx` | อ้าง `Navbar` ชื่อใหม่ | import ตรงกับชื่อไฟล์ |
| `src/pages/SignUpPage.jsx` | สมัครผ่าน `AuthContext` | auth write flow มีจุดเข้าเดียวและยัง validation เดิม |
| `src/pages/ProfilePage.jsx` | ใช้ `MemberPageLayout` และ mock auth ชื่อใหม่ | ลด layout ซ้ำโดยคง form เดิม |
| `src/pages/ResetPasswordPage.jsx` | ใช้ `MemberPageLayout` | ลด markup ซ้ำโดยคง dialog/guard เดิม |
| `src/pages/ViewPostPage.jsx` | ใช้ presentation components และ API path ใหม่ | page เหลือ state/fetch/handlers หลักที่อ่านง่าย |
| `src/pages/NotFoundPage.jsx` | อ้างชื่อ Navbar/Footer ใหม่ | naming สม่ำเสมอ |
| `src/components/blog/ArticleSection.jsx` | ใช้ constants สำหรับ categories และ page size | ลด magic values ที่กระจาย |
| `src/components/blog/CategorySelector.jsx` | เหลือเฉพาะ category UI และใช้ `SearchInput` เดียว | หน้าที่ของไฟล์ชัด และไม่ mount search ซ้ำ |
| `src/components/blog/BlogCard.jsx` | ใช้ author avatar constant | รวม fallback data ไว้จุดเดียว |
| `src/components/layout/Navbar.jsx` | ใช้ mock notifications จาก constants | component สั้นลงโดยคง menu เดิม |
| `src/context/AuthContext.jsx` | เพิ่ม `registerUser` wrapper | SignUp ใช้ auth entry point เดียวกับหน้าอื่น |
| `src/api/blogApi.js` | ใช้ default category constant | หลีกเลี่ยง string `Highlight` ซ้ำ |
| `src/lib/mockAuth.js` | เปลี่ยนชื่อจาก `authStorage`, ลดการค้นหาผู้ใช้ซ้ำ และลบ export ที่ไม่ใช้ | ชื่อบอกว่าเป็น mock auth และอ่านเงื่อนไขง่ายขึ้น |
| `vite.config.js` | ใช้ `import.meta.url` แทน `__dirname` | ใช้กับ ESM ได้ถูกต้องและผ่าน ESLint |
| `package.json`, `package-lock.json` | ลบ `@base-ui/react` | ลด dependency ที่ไม่มี import |
| `README.md` | เขียนใหม่เป็นภาษาไทยให้ตรงโครงสร้างและ flow จริง | ใช้เป็นคู่มือเริ่มต้นได้จริง |

ไฟล์ต่อไปนี้ถูกย้าย/เปลี่ยนชื่อ โดยเปลี่ยนเฉพาะ import และ format เพื่อให้ PascalCase สม่ำเสมอ: `src/page/` → `src/pages/`, `src/services/` → `src/api/` และ components ถูกจัดเป็น `src/components/blog/`, `src/components/layout/` และ `src/components/member/`

# Files Added

| ไฟล์ | Purpose | เหตุผลและประโยชน์ |
| --- | --- | --- |
| `src/constants/blog.js` | categories, default category, page size | มีที่เดียวสำหรับค่าของบทความ |
| `src/constants/site.js` | fallback author และ mock notifications | ลดข้อมูล hardcode ในหลาย components |
| `src/components/blog/SearchInput.jsx` | ค้นหาบทความพร้อม debounce | แยกจาก selector เพื่อให้แต่ละ component มีหน้าที่ชัด |
| `src/components/member/MemberPageLayout.jsx` | shell ของ Profile/Reset Password | ลด JSX layout ซ้ำสองหน้า |
| `src/components/blog/PostActions.jsx` | ปุ่ม like/copy/share | อ่านและแก้ส่วน actions ได้ง่าย |
| `src/components/blog/AuthorCard.jsx` | กล่องข้อมูลผู้เขียน | แยก presentation ที่ไม่เกี่ยวกับ fetch |
| `src/components/blog/LoginRequiredDialog.jsx` | dialog สำหรับผู้ที่ยังไม่ login | page หลักสั้นลงและคง dialog เดิม |
| `src/context/AuthContextValue.js` | React Context object | แยก context value ออกจาก provider เพื่อให้ Fast Refresh ทำงานได้ |
| `src/context/useAuth.js` | hook สำหรับอ่าน auth context | ให้ pages/components เรียก auth ได้จากไฟล์ที่มีหน้าที่เดียว |
| `AGENT.md` | แนวทางถาวรสำหรับ AI coding agents | ป้องกันการเพิ่มโค้ดซับซ้อนในอนาคต |
| `docs/refactor-report.md` | รายงานการ refactor นี้ | บันทึกเหตุผลและผลกระทบของงาน |

# Files Removed

| ไฟล์ | เหตุผล |
| --- | --- |
| `src/assets/blogPosts.js` | เป็น mock data เก่าที่ไม่มี import; แอปใช้ external API แล้ว |

# Folder Structure

```text
src/
├── api/                  # HTTP calls ไปยัง Blog API
├── assets/               # assets ของหน้าเว็บ เช่น hero.jpg
├── components/           # components แบบ PascalCase แยกตามหน้าที่
│   ├── blog/             # list, search และรายละเอียดบทความ
│   ├── layout/           # Navbar และ Footer
│   ├── member/           # profile/reset-password layout และ sidebar
│   └── ui/               # shadcn generated UI
├── constants/            # ค่าคงที่ร่วมกัน
├── context/              # AuthContext
├── lib/                  # helper และ mockAuth
├── pages/                # หน้าของแต่ละ route
├── App.jsx               # routes
└── main.jsx              # entry point
```

โครงสร้างนี้แยกตามคำถามง่าย ๆ ว่า “ไฟล์นี้เป็นหน้า, blog, layout, member, UI, API, ข้อมูลคงที่ หรือ logic ช่วยเหลือ” จึงค้นหาไฟล์ได้ง่ายโดยมี nesting เพียงหนึ่งระดับ

# Refactoring Principles

## KISS

ใช้ component และ function ธรรมดา ไม่เพิ่ม custom hook, nested routes หรือ architecture ที่ต้องเรียนเพิ่ม การเปลี่ยนส่วนใหญ่เป็น rename, แยก JSX ที่มีหน้าที่ชัด และย้ายค่าคงที่

## DRY

ลด JSX layout ซ้ำในหน้า member, ลด search component ที่ถูก mount สองครั้ง และเก็บ category/author fallback ไว้จุดเดียว

## Single Responsibility Principle

`SearchInput` รับผิดชอบการค้นหา, `CategorySelector` รับผิดชอบการเลือกหมวดหมู่, และ post presentation components รับผิดชอบการแสดงผลแต่ละส่วน

## Separation of Concerns

page เก็บ state และ flow หลัก, component เก็บ UI ส่วนย่อย, `api` เก็บการเรียก HTTP และ `constants` เก็บข้อมูลตายตัว จึงไม่ต้องหา logic ปนกันในไฟล์เดียว

## Readability over cleverness

คง form state/validation ไว้ใน page ที่ใช้จริง แทนการสร้าง generic form framework หรือ hook ที่มี abstraction สูง

# Future Improvements

สิ่งต่อไปนี้ตั้งใจยังไม่ทำเพื่อให้โปรเจกต์เล็กและเหมาะกับผู้เริ่มต้น:

- เพิ่ม automated tests ด้วย Vitest/React Testing Library
- เปลี่ยน mock auth เป็น backend จริงและจัดการ password อย่างปลอดภัย
- ย้ายทั้งโปรเจกต์ไป TypeScript
- เพิ่ม theme toggle สำหรับ dark mode
- แก้ external social links และ login dialog navigation
- เพิ่ม error UI สำหรับ API ที่ละเอียดขึ้น
