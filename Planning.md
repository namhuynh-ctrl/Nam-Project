\# KẾ HOẠCH TRIỂN KHAI DỰ ÁN (PROJECT PLANNING)  
\*\*Dự án:\*\* Wayground Quiz Maker Module  
\*\*Phương pháp luận:\*\* First-Principles & Front-end/Prototype First approach

\---

\#\# 1\. Tổng Quan Tiến Độ

\* \*\*Trạng thái hiện tại:\*\* Đã chốt kiến trúc hệ thống (System Design) và Yêu cầu sản phẩm (PRD). Chuẩn bị bước vào giai đoạn thiết kế UI/UX và tạo Prototype.  
\* \*\*Tiến độ tổng thể:\*\* ██░░░░░░░░ 10% (Giai đoạn khởi tạo)

| Hạng mục công việc | Trạng thái | Ưu tiên |  
| :--- | :---: | :---: |  
| Phân tích nghiệp vụ & System Design | ✅ Hoàn thành | P0 |  
| \*\*Phase 1: UI/UX & Front-end Prototype (Mock Data)\*\* | ❌ Chưa hoàn thành | P0 |  
| \*\*Phase 2: Database & Core Backend (Supabase)\*\* | ❌ Chưa hoàn thành | P0 |  
| \*\*Phase 3: Tích hợp Frontend & Backend (Core Flows)\*\* | ❌ Chưa hoàn thành | P0 |  
| \*\*Phase 4: Tích hợp AI Gemini (Document to Quiz)\*\* | ❌ Chưa hoàn thành | P1 |  
| \*\*Phase 5: Analytics, Export & Anti-cheat\*\* | ❌ Chưa hoàn thành | P1 |

\---

\#\# 2\. Kế Hoạch Triển Khai Chi Tiết

\#\#\# 🎯 Phase 1: UI/UX Design & Front-end Prototype (Mock Data)  
\*Mục tiêu: Chốt toàn bộ luồng trải nghiệm người dùng (UX) và giao diện (UI). Chạy mượt mà trên môi trường Local với dữ liệu giả (Mock JSON) trước khi đụng đến Database.\*

| Sprint | Thời gian | Tasks | Output |  
| :--- | :--- | :--- | :--- |  
| \*\*Sprint 1: UI/UX Design\*\* | Tuần 1 | ① Thiết kế Wireframe & UI cho Participant App (Mobile-first).\<br\>② Thiết kế UI cho Creator Dashboard & Builder.\<br\>③ Tạo Interactive Prototype trên Figma. | Figma UI Prototype (Desktop \+ Mobile) đã được phê duyệt. |  
| \*\*Sprint 2: Front-end Scaffolding\*\* | Tuần 2 | ① Khởi tạo Next.js, cấu hình Tailwind CSS & Component Library.\<br\>② Xây dựng cấu trúc layout chính, routing (Public & Auth).\<br\>③ Dựng UI tĩnh cho màn hình "Join by Name" và Player. | Next.js Source Code với cấu trúc chuẩn, UI tĩnh hoạt động tốt. |  
| \*\*Sprint 3: Mock Data & Logic\*\* | Tuần 3 | ① Tạo thư mục mock data (JSON) cho Quiz & Questions.\<br\>② Lập trình logic Timer, Progress Bar, Validate Name (2-20 ký tự).\<br\>③ Build UI Creator (WYSIWYG Builder) với trạng thái local state (React State). | Front-end Prototype hoàn chỉnh, có thể click/thao tác end-to-end với dữ liệu giả. |

\#\#\# 🎯 Phase 2: Database & Core Backend (Supabase)  
\*Mục tiêu: Xây dựng nền tảng dữ liệu vững chắc, bảo mật RLS và các API cốt lõi.\*

| Sprint | Thời gian | Tasks | Output |  
| :--- | :--- | :--- | :--- |  
| \*\*Sprint 4: DB Schema & RLS\*\* | Tuần 4 | ① Khởi tạo Supabase project, tạo 6 bảng core.\<br\>② Cấu hình Row Level Security (RLS) ẩn cờ \`is\_correct\`.\<br\>③ Setup Supavisor Connection Pooling. | Database Schema hoàn chỉnh, an toàn bảo mật cấp DB. |  
| \*\*Sprint 5: API & RPC Logic\*\* | Tuần 5 | ① Viết Supabase RPC \`get\_quiz\_public\` để làm sạch payload.\<br\>② Viết API Route/Edge Function xử lý Submit & Auto-grade.\<br\>③ API Session (Join, Sync Response). | Danh sách API/RPC đã test qua Postman/Supabase Studio. |

\#\#\# 🎯 Phase 3: Integration & Infrastructure (Core Flows)  
\*Mục tiêu: Ráp nối Front-end Phase 1 với Backend Phase 2 thành sản phẩm thực tế.\*

| Sprint | Thời gian | Tasks | Output |  
| :--- | :--- | :--- | :--- |  
| \*\*Sprint 6: Connect Core Data\*\*| Tuần 6 | ① Gắn Supabase SDK vào Next.js, thay thế Mock JSON bằng Real DB.\<br\>② Tích hợp Auth cho Creator Dashboard.\<br\>③ Nối API nộp bài, tính điểm và hiển thị kết quả. | MVP 1.0 có thể tạo quiz thực và người chơi làm bài thực. |

\#\#\# 🎯 Phase 4: AI Gemini Integration & Advanced Features  
\*Mục tiêu: Đưa "Magic" vào sản phẩm với khả năng chuyển đổi tài liệu bằng AI.\*

| Sprint | Thời gian | Tasks | Output |  
| :--- | :--- | :--- | :--- |  
| \*\*Sprint 7: Storage & AI API\*\* | Tuần 7 | ① Xây dựng luồng Upload File lên Supabase Storage.\<br\>② Tích hợp \`@google/genai\` (Gemini 1.5 Flash), viết System Prompt.\<br\>③ API trả về cấu trúc JSON và auto-delete file. | Tính năng "Create with AI" hoạt động ổn định ở Backend. |  
| \*\*Sprint 8: AI Review UI\*\* | Tuần 8 | ① Xây dựng giao diện Review Editor trên Next.js.\<br\>② Ghép nối kết quả AI vào giao diện để Creator sửa/lưu.\<br\>③ Testing các file PDF/Ảnh phức tạp. | Luồng AI hoàn thiện từ End-to-End. |

\#\#\# 🎯 Phase 5: Analytics, Offline Sync & Launch  
\*Mục tiêu: Hoàn thiện NFRs, trải nghiệm nâng cao và chuẩn bị Go-live.\*

| Sprint | Thời gian | Tasks | Output |  
| :--- | :--- | :--- | :--- |  
| \*\*Sprint 9: NFRs & Export\*\* | Tuần 9 | ① Code logic Offline Sync (LocalStorage retry).\<br\>② Bổ sung Anti-cheat (chặn chuột phải, copy-paste).\<br\>③ Xây dựng Dashboard Analytics và tính năng Export Excel. | Hệ thống hoàn thiện, đạt chỉ tiêu PRD. Chuẩn bị UAT. |

\---

\#\# 3\. Cấu Trúc Thư Mục Hiện Tại (Dự kiến)

Vì chúng ta áp dụng "Front-end First", cấu trúc thư mục ban đầu sẽ tập trung mạnh vào UI/Components và Mock Data:

\`\`\`text  
wayground-quiz/  
├── app/  
│   ├── (public)/                 \# Routes cho Participant  
│   │   ├── play/\[shortcode\]/     \# UI Màn hình Join (Nhập tên)  
│   │   └── quiz/\[sessionId\]/     \# UI Màn hình Player (Đếm ngược)  
│   ├── (creator)/                \# Routes cho Creator (Cần Auth)  
│   │   ├── dashboard/            \# Quản lý danh sách Quiz  
│   │   └── builder/\[quizId\]/     \# Trình tạo câu hỏi (Manual & AI)  
│   ├── api/                      \# Vercel API Routes (Trống ở Phase 1\)  
│   └── layout.tsx  
├── components/                   \# UI Components (Ưu tiên làm trước)  
│   ├── ui/                       \# Design System (Button, Input, Modal...)  
│   ├── participant/              \# Timer, ProgressBar, QuestionCard...  
│   └── creator/                  \# WysiwygEditor, AiUploadDropzone...  
├── mocks/                        \# DỮ LIỆU GIẢ CHO PHASE 1 (Cốt lõi)  
│   ├── dummy\_quizzes.json        \# Danh sách quiz giả định  
│   └── dummy\_questions.json      \# Payload câu hỏi có sẵn để build UI  
├── hooks/                        \# React Hooks cho logic UI  
│   ├── useTimer.ts  
│   └── useAutosave.ts  
├── lib/                          \# Utils & SDKs (Tích hợp ở Phase 2, 3\)  
│   ├── supabase.ts               \# Supabase client  
│   └── gemini.ts                 \# Gọi AI model  
└── types/                        \# TypeScript Interfaces  
    └── index.ts                  \# type Question, Answer, Session...  
