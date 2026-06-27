\#\# 2\. Kiến Trúc Hệ Thống

\#\#\# 2.1 Tổng quan kiến trúc  
Sơ đồ dưới đây thể hiện kiến trúc Serverless tận dụng tối đa Vercel Edge và hệ sinh thái Supabase, tích hợp quy trình xử lý AI qua Google Gemini.

┌─────────────────────────────────────────────────────────────────┐  
│                          CLIENT TIER                            │  
│    ┌─────────────────┐                  ┌─────────────────┐     │  
│    │  CREATOR APP    │                  │ PARTICIPANT APP │     │  
│    │ (Web Dashboard) │                  │(Mobile-Optimized│     │  
│    └────────┬────────┘                  └────────┬────────┘     │  
└─────────────┼────────────────────────────────────┼──────────────┘  
              │ HTTPS (API / SSR)                  │ HTTPS / WSS  
              ▼                                    ▼  
┌─────────────────────────────────────────────────────────────────┐  
│                        VERCEL EDGE TIER                         │  
│  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────┐  │  
│  │ Next.js App Router│ │ Next.js API Routes│ │ Edge Functions│  │  
│  │ (UI & Routing)    │ │ (Backend Logic)   │ │ (Auto-grade)  │  │  
│  └──────────┬────────┘ └─────────┬─────────┘ └───────┬───────┘  │  
└─────────────┼────────────────────┼───────────────────┼──────────┘  
              │                    │                   │  
              ▼                    ▼                   ▼  
┌─────────────────────────────────────────────────────────────────┐  
│                          SUPABASE TIER                          │  
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │  
│  │   Storage    │ │   Realtime   │ │ PostgREST / RPC         │  │  
│  │ (PDF/Images) │ │ (Sync/Timer) │ │ (Data Access Layer)     │  │  
│  └──────┬───────┘ └──────┬───────┘ └──────────┬──────────────┘  │  
│         │                │                    │                 │  
│         │         ┌──────▼────────────────────▼──────┐          │  
│         │         │ Supavisor (Connection Pooling)   │          │  
│         │         └───────────────────┬──────────────┘          │  
│         │                             ▼                         │  
│         │         ┌──────────────────────────────────┐          │  
│         └────────►│ PostgreSQL (DB \+ RLS Policies)   │          │  
│                   └──────────────────────────────────┘          │  
└─────────────────────────────────────────────────────────────────┘  
         ▲                                                │  
         │ (2) Gửi file / (4) Xóa file                    │ (3) Lưu JSON Data  
         ▼                                                ▲  
┌─────────────────────────────────────────────────────────────────┐  
│                        AI SERVICES TIER                         │  
│  ┌───────────────────────────────────────────────────────────┐  │  
│  │                     Google Gemini API                     │  │  
│  │   \- Gemini 1.5 Flash (Xử lý Text/Image)                   │  │  
│  │   \- Gemini 1.5 Pro (Xử lý PDF phức tạp/nhiều trang)       │  │  
│  └───────────────────────────────────────────────────────────┘  │  
└─────────────────────────────────────────────────────────────────┘

\#\#\# 2.2 Tech Stack  
| Layer | Công nghệ | Ghi chú |  
| :--- | :--- | :--- |  
| \*\*Frontend/Hosting\*\* | Next.js (App Router) \+ TailwindCSS trên Vercel | Đảm bảo tốc độ tải trang Player \< 1.5s nhờ Vercel Edge Cache. Dễ dàng triển khai Responsive cho Mobile. |  
| \*\*Backend/Database\*\* | Supabase (PostgreSQL) \+ Supavisor | Quản lý data, cung cấp API tự động. Supavisor xử lý Connection Pooling chịu tải 10.000 CCU. |  
| \*\*Realtime Sync\*\* | Supabase Realtime | Đồng bộ thời gian đếm ngược và tự động lưu nháp dữ liệu làm bài khi mạng có vấn đề. |  
| \*\*AI Engine\*\* | Google Gemini API (1.5 Flash/Pro) | Flash xử lý nhanh file ngắn. Context window lớn hỗ trợ đọc đề thi PDF dài, xuất chuẩn JSON object. |  
| \*\*Bảo mật (DB Level)\*\* | Supabase Row Level Security (RLS) | Khóa chặt bảng \`answers\` (chứa \`is\_correct\`), ngăn chặn học sinh hack đáp án qua DevTools. |  
| \*\*Storage\*\* | Supabase Storage | Nơi lưu trữ tạm thời file PDF/DOCX/Ảnh chụp trước khi đẩy qua Gemini, sau đó xóa ngay. |

\---

\#\# 3\. Tính Năng Chi Tiết

\#\#\# 3.1 Quản lý & Cấu hình Quiz (Creator)  
| Feature | Mô tả | Priority |  
| :--- | :--- | :--- |  
| \*\*Dashboard Management\*\* | Giao diện quản lý danh sách Quiz, tạo mới, sửa, xóa, tìm kiếm. Quản lý trạng thái Draft/Published. | P0 |  
| \*\*Manual Builder\*\* | Trình soạn thảo thủ công WYSIWYG. Hỗ trợ loại câu Trắc nghiệm, Đúng/Sai. Đặt điểm số và thời gian làm bài. | P0 |  
| \*\*Share & Invite\*\* | Xuất Short-link và QR Code để học sinh quét/truy cập trực tiếp không cần đăng nhập. | P0 |

\#\#\# 3.2 AI Quiz Converter (Gemini Integration)  
| Feature | Mô tả | Priority |  
| :--- | :--- | :--- |  
| \*\*File Uploader\*\* | Giao diện kéo thả file PDF, DOCX, JPG, PNG (tối đa 50MB). Upload lên Supabase Storage tạm thời. | P1 |  
| \*\*AI Extraction\*\* | Giao tiếp với Gemini API để đọc tài liệu, trích xuất câu hỏi, đáp án đúng và trả về định dạng JSON. | P1 |  
| \*\*Review Editor\*\* | Giao diện kiểm duyệt, sửa nhanh lỗi chính tả, thay đổi đáp án hoặc xóa các câu hỏi AI nhận diện sai trước khi lưu. | P1 |

\#\#\# 3.3 Trải nghiệm Làm Bài (Frictionless Participant)  
| Feature | Mô tả | Priority |  
| :--- | :--- | :--- |  
| \*\*Join by Name\*\* | Màn hình vào thi tối giản. Yêu cầu nhập duy nhất \`display\_name\` (2-20 ký tự). Validate lọc khoảng trắng dư. | P0 |  
| \*\*Mobile Player\*\* | Giao diện thi Responsive, nút to dễ bấm. Hiển thị đồng hồ đếm ngược và thanh tiến trình (progress bar). | P0 |  
| \*\*Real-time Sync & Offline\*\* | Lưu tạm đáp án xuống \`LocalStorage\`. Tự động đồng bộ lên Server ngay khi có mạng (tránh mất bài). | P1 |  
| \*\*Auto-Submit & Grading\*\* | Khi Timer \= 0, ép buộc nộp bài. Edge Function tại backend sẽ chấm điểm để đảm bảo tính minh bạch. | P0 |

\#\#\# 3.4 Phân Tích & Báo Cáo  
| Feature | Mô tả | Priority |  
| :--- | :--- | :--- |  
| \*\*Analytics Dashboard\*\* | Thống kê số lượng tham gia, điểm trung bình, biểu đồ tỷ lệ đúng/sai của từng câu hỏi. | P1 |  
| \*\*Export Data\*\* | Xuất kết quả chi tiết (Tên người chơi, Điểm, Thời gian hoàn thành) ra file Excel (.xlsx / .csv). | P1 |

\---

\#\# 4\. Database Schema

\#\#\# 4.1 Bảng chính

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐  
│   auth.users    │       │ public.quizzes  │       │public.questions │  
├─────────────────┤       ├─────────────────┤       ├─────────────────┤  
│ id (PK/UUID)    │  ┌───►│ id (PK/UUID)    │  ┌───►│ id (PK/UUID)    │  
│ email           │  │    │ creator\_id (FK) │  │    │ quiz\_id (FK)    │  
│ raw\_user\_meta   │  │    │ title           │  │    │ type            │  
└─────────────────┘  │    │ timer\_minutes   │  │    │ content         │  
                     │    │ status          │  │    │ points          │  
                     │    └─────────────────┘  │    └─────────────────┘  
                     │             │           │             │  
                     │             │ 1:N       │ 1:N         │ 1:N  
                     │             ▼           │             ▼  
                     │    ┌─────────────────┐  │    ┌─────────────────┐  
                     │    │ public.sessions │  │    │ public.answers  │  
                     │    ├─────────────────┤  │    ├─────────────────┤  
                     │    │ id (PK/UUID)    │  │    │ id (PK/UUID)    │  
                     │    │ quiz\_id (FK)    │  │    │ question\_id (FK)│  
                     │    │ display\_name    │  │    │ content         │  
                     │    │ started\_at      │  │    │ is\_correct (BOL)│  
                     │    │ total\_score     │  │    └─────────────────┘  
                     │    └─────────────────┘  │  
                     │             │           │  
                     │             │ 1:N       │  
                     │             ▼           │  
                     │    ┌─────────────────┐  │  
                     │    │ public.responses│  │  
                     │    ├─────────────────┤  │  
                     │    │ id (PK/UUID)    │  │  
                     │    │ session\_id (FK) │  │  
                     │    │ question\_id (FK)│◄─┘  
                     │    │ answer\_data     │  
                     │    └─────────────────┘

\#\#\# 4.2 Tổng cộng: \*\*6 bảng\*\*  
1\. \`auth.users\`: Bảng hệ thống của Supabase Auth quản lý tài khoản của Creator.  
2\. \`public.quizzes\`: Lưu trữ metadata của bài quiz (Tiêu đề, thời gian đếm ngược, trạng thái).  
3\. \`public.questions\`: Lưu trữ nội dung câu hỏi thuộc về một quiz nhất định.  
4\. \`public.answers\`: Lưu trữ các lựa chọn của câu hỏi. Cột \`is\_correct\` được bảo vệ bằng RLS chặt chẽ.  
5\. \`public.sessions\`: (Đại diện cho Participant) Phiên làm bài ẩn danh, chỉ lưu \`display\_name\`, thời gian bắt đầu và điểm số tổng kết.  
6\. \`public.responses\`: Lưu chi tiết các đáp án mà học viên đã chọn trong phiên làm bài. Hỗ trợ sync real-time và resume session.

\---

\#\# 5\. API Endpoints  
\*Lưu ý: Đa số thao tác CRUD được gọi thẳng qua Supabase Client SDK (PostgREST), bảng dưới là các API quan trọng cần viết logic ở Backend (Next.js API/Edge).\*

| Method | Endpoint | Mô tả |  
| :--- | :--- | :--- |  
| POST | \`/api/ai/convert-quiz\` | Nhận \`file\_url\` từ Storage, gọi Gemini API, trả về JSON cấu trúc câu hỏi và xóa file gốc. |  
| GET | \`rpc('get\_quiz\_public')\` | (Supabase RPC) Lấy đề thi cho học viên, \*\*tự động cắt bỏ trường \`is\_correct\`\*\* trước khi trả về Frontend. |  
| POST | \`/api/quiz/join\` | Khởi tạo phiên làm bài. Nhận \`quiz\_id\` & \`display\_name\`. Validate tên (2-20 ký tự). Trả về \`session\_id\`. |  
| POST | \`/api/quiz/sync-response\`| Đồng bộ câu trả lời đang làm dở (Upsert vào bảng \`responses\`). Thường gọi từ LocalStorage retry. |  
| POST | \`/api/quiz/submit\` | Nhận \`session\_id\`. Chấm điểm ẩn ở Backend, tính \`total\_score\` cập nhật vào DB, đóng session. |  
| GET | \`/api/quiz/:id/analytics\` | Lấy dữ liệu thống kê aggregated (điểm trung bình, phân bổ câu sai) cho Dashboard Creator. |  
| GET | \`/api/quiz/:id/export\` | Tạo và trả về link tải file Excel danh sách \`display\_name\` và điểm số của Quiz. |

\---

\#\# 6\. Yêu Cầu Hạ Tầng  
\#\#\# 6.1 Server & Infrastructure  
| Thông số/Layer | Yêu cầu | Ghi chú |  
| :--- | :--- | :--- |  
| \*\*Vercel Hosting\*\* | Gói Pro ($20/tháng) | Đảm bảo băng thông và tài nguyên Edge Function cho tốc độ tải Player UI cực nhanh (\< 1.5s). |  
| \*\*Supabase DB\*\* | Pro Plan \+ Compute L Add-on | Cần RAM \~16GB để duy trì Supavisor Connection Pool gánh 10.000 CCU đồng thời không bị sập. |  
| \*\*Storage\*\* | Supabase Storage (50GB) | Lưu trữ file PDF/Ảnh tạm thời trước khi đẩy qua AI. Cài đặt tự động dọn rác (CRON job dọn file thừa). |  
| \*\*AI Engine\*\* | Google Gemini API (Pay-as-you-go) | Flash (Free tier khá hào phóng, nhưng cần add thẻ để tăng rate limit phục vụ scale). |

\#\#\# 6.2 Chi phí ước tính/tháng  
| Hạng mục | Chi phí dự kiến | Ghi chú |  
| :--- | :--- | :--- |  
| Vercel Pro Plan | $20 | Gói cơ bản cho 1 user, thêm user tính thêm phí. |  
| Supabase Pro \+ Compute | \~$85 \- $145 | Phí DB duy trì ổn định cho 10k học sinh truy cập cùng lúc. |  
| Google Gemini API | \~$10 \- $50 | Phụ thuộc vào số lượng file PDF/Ảnh tài liệu giáo viên upload. Flash rất rẻ. |  
| \*\*Tổng cộng\*\* | \*\*\~$115 \- $215/tháng\*\* | Tối ưu hóa cực tốt cho một hệ thống chịu tải giáo dục/sự kiện. |

\---

\#\# 7\. Rủi Ro & Giảm Thiểu  
| \# | Rủi ro | Mức độ | Giảm thiểu |  
| :--- | :--- | :--- | :--- |  
| 1 | Lộ đáp án đúng (\`is\_correct\`) ở mạng Network/Frontend. | 🔴 Cao | Chỉ cấp quyền \`SELECT\` bảng \`answers\` qua một RPC Function có nhiệm vụ "làm sạch" dữ liệu cờ đúng/sai trước khi gửi về Client. |  
| 2 | Gemini AI "ảo giác" hoặc trích xuất sai đáp án tài liệu. | 🟡 TB | Bắt buộc luồng "Review Editor". Giáo viên phải đọc duyệt lại JSON trả về trên UI trước khi được quyền bấm Publish. |  
| 3 | Sập Database do 10k học sinh vào thi cùng một giây. | 🔴 Cao | Bắt buộc bật Supavisor (IPv4). Cache toàn bộ JSON đề thi ở Vercel Edge. Chỉ gọi DB khi học sinh thực sự Submit. |  
| 4 | Học sinh nhập tên phá hoại (VD: HTML Tag, tên quá dài). | 🟡 TB | Validate 2 lớp: Frontend (React maxLength) và Backend (Postgres \`VARCHAR(20)\` \+ \`TRIM()\`). Loại bỏ ký tự đặc biệt nếu cần. |

\---

\#\# 8\. Metrics Thành Công  
| Metric | Mục tiêu Phase 1 | Mục tiêu Full |  
| :--- | :--- | :--- |  
| \*\*Tốc độ tải Player\*\* | \< 1.5 giây (Mạng 4G) | \< 1.0 giây (Edge Caching) |  
| \*\*Tốc độ xử lý AI\*\* | \< 10s cho file dưới 5 trang | \< 5s trung bình với Gemini Flash |  
| \*\*Khả năng chịu tải\*\* | 5.000 CCU mượt mà | Đạt mốc 10.000 CCU không rớt DB |  
| \*\*Bảo mật học thuật\*\* | 0% lộ đáp án qua Inspect Element | 0% gian lận copy/paste trên UI |

\---

\#\# 9\. Phụ Lục  
\*\*Quy tắc logic nghiệp vụ đặc thù (Business Rules)\*\*

| Hạng mục | Quy tắc xử lý |  
| :--- | :--- |  
| \*\*Quy tắc Validate Tên (Display Name)\*\* | 1\. Frontend khóa nút Submit nếu \`length \< 2\` hoặc \`\> 20\`. \<br\>2. Backend tự động gọi hàm \`TRIM()\` loại bỏ khoảng trắng hai đầu. Nếu string trống, reject request. \<br\>3. Postgres table định nghĩa \`VARCHAR(20) NOT NULL\`. |  
| \*\*Quy tắc xử lý AI (Gemini)\*\* | 1\. File upload xong $\\rightarrow$ Đẩy URL hoặc Base64 qua Gemini kèm Prompt yêu cầu cấu trúc JSON. \<br\>2. Bật \`responseMimeType: "application/json"\`. \<br\>3. Nhận JSON $\\rightarrow$ Thực thi hàm gọi Supabase Storage xóa ngay file gốc để bảo mật bản quyền đề thi của trung tâm. |  
| \*\*Cơ chế Auto-Submit & Chấm điểm\*\* | 1\. Thời gian bắt đầu làm bài lưu mốc \`started\_at\` ở Backend. \<br\>2. Nếu Client Submit chậm hơn \`timer\_minutes\` \+ 10s (độ trễ mạng), Backend từ chối chấm các câu gửi lố giờ. \<br\>3. Điểm được tính hoàn toàn bằng hàm Backend chạy ngầm, Client chỉ nhận lại kết quả con số cuối cùng. |  
| \*\*Anti-cheat UI\*\* | Lắng nghe event Javascript chặn phím tắt, chặn Context Menu. Ghi nhận cảnh báo nếu học viên rời khỏi tab trình duyệt (Focus out) quá 3 lần. |  
