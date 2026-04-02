# 🏙️ Urbanity — Bakı Şəhər Mobillik İntellekt Platforması

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Frontend](https://img.shields.io/badge/frontend-React_19-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi)
![License](https://img.shields.io/badge/license-MIT-green)

**Bakı şəhərinin nəqliyyat şəbəkəsini real vaxt rejimində izləyən, proqnozlaşdıran və təhlil edən ağıllı mobillik platforması.**

</div>

---

## 📖 Layihə Haqqında

**Urbanity** — Bakı şəhərinin 14 müxtəlif nəqliyyat növünü (metro, avtobus, mikroavtobus, taksi, velosiped, piyada və s.) izləyən və 13 data provayderindən məlumat toplayan şəhər mobillik kəşfiyyat platformasıdır.

### 🎯 Əsas Xüsusiyyətlər

| Xüsusiyyət | Təsvir |
|---|---|
| 🗺️ **İnteraktiv Xəritə** | Leaflet əsaslı xəritə ilə transit şəbəkəsinin vizuallaşdırılması |
| 📊 **İcmal Dashboard** | Gündəlik səfər sayı, xəbərdarlıqlar və provayder sağlamlığı |
| 🚇 **Transit Şəbəkəsi** | Metro xətləri, avtobus marşrutları və stansiya əhatəsi |
| 🛣️ **Multimodal Routing** | Vaxt, xərc, emissiya və əlçatanlığa görə marşrut müqayisəsi |
| 📈 **Tıxac Proqnozu** | ML əsaslı tıxac proqnozları, etibarlılıq intervalları ilə |
| ⚠️ **Xəbərdarlıqlar** | Data mənşəyi göstəricili aktiv xəbərdarlıqlar |
| ♿ **Bərabərlik Təhlili** | Rayon səviyyəsində əlçatanlıq və bərabərlik indeksləri |
| 🛰️ **Peyk Müşahidəsi** | Sentinel-2 peyk verilənləri ilə ekoloji kontekst |
| 🔍 **Provayder Mənşəyi** | Bütün data provayderləri və onların etibarlılıq statusu |
| 🌓 **Light/Dark Tema** | Landing page üçün açıq, dashboard üçün tünd tema |

### 👥 İstifadəçi Rolları

Platformada 5 müxtəlif istifadəçi rolu mövcuddur:

- **👑 Executive / Jury** — Strateji icmal, ən güclü sübut nöqtələri
- **🏛️ B2G / Public Sector** — Dayanıqlılıq, bərabərlik, ictimai nəqliyyat
- **🖥️ B2B / Operator** — Operativ dashboard, provayder sağlamlığı
- **📱 B2C / Rider** — Səyahət planlaması, marşrut aydınlığı
- **⚙️ Technical / System** — Provayderilər, API hazırlığı, sistem sağlamlığı

---

## 🏗️ Arxitektura

```
Urbanity/
├── backend/                # FastAPI Backend Server
│   ├── server.py           # Əsas API serveri (bütün endpointlər)
│   ├── requirements.txt    # Python asılılıqları
│   └── .env                # Mühit dəyişənləri
│
├── frontend/               # React Frontend Tətbiqi
│   ├── src/
│   │   ├── App.js          # Router və əsas tətbiq
│   │   ├── context/
│   │   │   └── AppContext.js    # Qlobal state (tema, istifadəçi, rollar)
│   │   ├── components/
│   │   │   ├── Logo.jsx         # Urbanity loqosu
│   │   │   ├── MapComponent.js  # Leaflet xəritə komponenti
│   │   │   ├── ModeDetailPanel.js # Nəqliyyat növü detalları
│   │   │   └── ui/              # shadcn/ui komponentləri
│   │   └── pages/
│   │       ├── LandingPage.js   # Ana səhifə (açıq tema)
│   │       ├── LoginPage.js     # Giriş / Rol seçimi
│   │       ├── Dashboard.js     # Dashboard layout (tünd tema)
│   │       └── dashboard/       # Dashboard alt-səhifələri
│   │           ├── Overview.js        # İcmal (statistika, qrafiklər)
│   │           ├── TransitNetwork.js  # Transit şəbəkəsi xəritəsi
│   │           ├── Routing.js         # Multimodal marşrutlama
│   │           ├── Forecasting.js     # Tıxac proqnozu
│   │           ├── Alerts.js          # Xəbərdarlıqlar
│   │           ├── Equity.js          # Bərabərlik təhlili
│   │           ├── EarthObservation.js # Peyk müşahidəsi
│   │           ├── Provenance.js      # Provayder mənşəyi
│   │           └── DemoGuide.js       # Demo bələdçi
│   ├── package.json         # Node.js asılılıqları
│   ├── craco.config.js      # CRACO konfiqurasiyası (path aliases)
│   ├── tailwind.config.js   # TailwindCSS konfiqurasiyası
│   └── public/              # Statik fayllar
│
├── vercel.json              # Vercel deployment konfiqurasiyası
├── design_guidelines.json   # Dizayn qaydaları və rəng paletası
└── tests/                   # Test faylları
```

---

## 🛠️ Texnologiyalar

### Frontend
| Texnologiya | Versiya | Məqsəd |
|---|---|---|
| React | 19.0 | UI framework |
| React Router | 7.5 | Səhifə naviqasiyası |
| TailwindCSS | 3.4 | Utility-first CSS |
| Framer Motion | 12.x | Animasiyalar |
| Recharts | 3.6 | Qrafiklər və diaqramlar |
| React Leaflet | 5.0 | İnteraktiv xəritə |
| Lucide React | 0.507 | İkon kitabxanası |
| shadcn/ui | — | UI komponent kitabxanası |
| Axios | 1.8 | API sorğuları |
| CRACO | 7.1 | CRA konfiqurasiyası |

### Backend
| Texnologiya | Versiya | Məqsəd |
|---|---|---|
| FastAPI | 0.110 | REST API framework |
| Uvicorn | 0.25 | ASGI server |
| Motor | 3.3 | Async MongoDB driver |
| PyJWT | 2.10+ | JWT autentifikasiya |
| Pydantic | 2.6+ | Data validasiya |
| MongoDB | — | Verilənlər bazası |

---

## 🚀 Quraşdırma və İşə Salma

### Ön şərtlər

Aşağıdakıların sisteminizdə quraşdırılmış olduğundan əmin olun:

- **Node.js** (v18+ tövsiyə olunur) — [nodejs.org](https://nodejs.org)
- **Python** (v3.10+) — [python.org](https://python.org)
- **MongoDB** (opsional, demo data backend-də hardcoded-dir) — [mongodb.com](https://mongodb.com)
- **Git** — [git-scm.com](https://git-scm.com)

### 1️⃣ Reponu Klonlayın

```bash
git clone <repo-url>
cd Urbanity
```

### 2️⃣ Backend-i Quraşdırın və İşə Salın

```bash
# Virtual environment yaradın
cd backend
python -m venv .venv

# Virtual environment-i aktivləşdirin
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Asılılıqları quraşdırın
pip install -r requirements.txt

# .env faylını yoxlayın/düzəldin (lazım gələrsə)
# Standart olaraq aşağıdakı parametrlər var:
#   MONGO_URL=mongodb://localhost:27017
#   DB_NAME=urbanivity
#   CORS_ORIGINS=http://localhost:3000
#   SECRET_KEY=s0m3_s3cr3t_k3y_h3r3_f0r_jwt

# Serveri işə salın
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Backend `http://localhost:8000` ünvanında işə düşəcək.

> **💡 Qeyd:** MongoDB quraşdırılmamış olsa belə, backend işləyəcək — bütün demo data `server.py` faylında hardcoded şəkildə mövcuddur. MongoDB yalnız istifadəçi məlumatlarının saxlanması üçün lazımdır.

### 3️⃣ Frontend-i Quraşdırın və İşə Salın

```bash
# Yeni terminal açın
cd frontend

# Asılılıqları quraşdırın
npm install

# Development serverini işə salın
npm start
```

Frontend `http://localhost:3000` ünvanında açılacaq.

### 4️⃣ Tətbiqi İstifadə Edin

1. Brauzerinizdə `http://localhost:3000` ünvanına daxil olun
2. **Landing Page** açılacaq — platformanın xüsusiyyətləri ilə tanış olun
3. **"Explore Dashboard"** düyməsinə basın və ya `/login` səhifəsinə keçin
4. Adınızı, e-poçtunuzu daxil edin və **istifadəçi rolunu** seçin
5. **Dashboard**-a yönləndirilirsiniz — sol panelden bölmələri araşdırın

---

## 📡 API Endpointləri

Backend `http://localhost:8000/api` prefiksi altında işləyir.

### Açıq Endpointlər (tokensiz)

| Metod | Endpoint | Təsvir |
|---|---|---|
| GET | `/api/` | API status yoxlanması |
| GET | `/api/auth/roles` | Mövcud istifadəçi rollarını gətir |
| POST | `/api/auth/login` | Daxil ol (ad, email, rol göndər) → JWT token al |

### Qorunan Endpointlər (JWT token lazımdır)

| Metod | Endpoint | Təsvir |
|---|---|---|
| GET | `/api/dashboard/overview` | Dashboard icmal statistikası |
| GET | `/api/mobility-modes` | 14 nəqliyyat növü siyahısı |
| GET | `/api/mobility-modes/{id}/detail` | Xüsusi nəqliyyat növü detalları |
| GET | `/api/providers` | 13 data provayderi siyahısı |
| GET | `/api/transit/network` | Transit şəbəkəsi (xətlər, stansiyalar) |
| GET | `/api/routing/demo` | Demo marşrut seçimləri |
| GET | `/api/forecasting/congestion` | Tıxac proqnozu |
| GET | `/api/alerts` | Xəbərdarlıqlar (filtr: `?status=active&severity=warning`) |
| GET | `/api/equity/districts` | Rayon bərabərlik verilənləri |
| GET | `/api/earth-observation` | Peyk müşahidə verilənləri |
| GET | `/api/demo/guide` | Demo bələdçi addımları |
| POST | `/api/demo/reset` | Demo vəziyyəti sıfırla |

### API Sorğu Nümunəsi

```bash
# Daxil ol və token al
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "role": "executive"}'

# Token ilə dashboard icmalını gətir
curl http://localhost:8000/api/dashboard/overview \
  -H "Authorization: Bearer <your_token>"
```

---

## 🎨 Dizayn Sistemi

| Element | Detal |
|---|---|
| **Şriftlər** | Outfit (başlıqlar), Public Sans (mətn), JetBrains Mono (kod) |
| **Əsas Rəng** | Electric Blue `#2563EB` |
| **Aksent Rəng** | Flame Amber `#F97316` (Bakı aksenti) |
| **Landing Tema** | Açıq (Light) — `bg-slate-50` |
| **Dashboard Tema** | Tünd (Dark) — `bg-[#0B0E14]` |
| **İkonlar** | Lucide React (`stroke-width=1.5`) |
| **Animasiyalar** | Framer Motion |

---

## 🌐 Deploy (Vercel)

Layihə Vercel-ə deploy olunmağa hazırdır:

```bash
# Vercel CLI ilə deploy:
npx vercel

# Və ya avtomatik deploy üçün GitHub repo-nu Vercel-ə bağlayın
```

`vercel.json` artıq konfiqurasiya olunub:
- **Build əmri:** `cd frontend && npm run build`
- **Output qovluğu:** `frontend/build`

> **⚠️ Qeyd:** Vercel yalnız frontend-i deploy edir. Backend üçün ayrıca bir PaaS (Render, Railway, Fly.io) istifadə etməniz tövsiyə olunur.

---

## 🧪 Testlər

```bash
# Backend testlərini işə sal
cd backend
python -m pytest ../backend_test.py -v

# Frontend testlərini işə sal
cd frontend
npm test
```

---

## 📂 Əsas Fayllar

| Fayl | Təsvir |
|---|---|
| `backend/server.py` | Bütün API endpointləri, demo data, autentifikasiya |
| `frontend/src/App.js` | Router, qorunan marşrutlar |
| `frontend/src/context/AppContext.js` | Qlobal state: tema, istifadəçi, rol, dark/light mode |
| `frontend/src/pages/LandingPage.js` | Ana səhifə — platformanın tanıtımı |
| `frontend/src/pages/LoginPage.js` | Giriş və rol seçimi |
| `frontend/src/pages/Dashboard.js` | Dashboard layout — sidebar, header, content |
| `frontend/src/components/MapComponent.js` | Leaflet xəritə (Bakı: 40.4093°N, 49.8671°E) |
| `design_guidelines.json` | Rəng paletası, tipografiya, komponent qaydaları |

---

## 📄 Lisenziya

Bu layihə hackathon məqsədləri üçün hazırlanmışdır.

---

<div align="center">

**Urbanity** ilə Bakının nəqliyyat gələcəyini kəşf edin 🚀

</div>
