# 👞 KOTHARI FOOTWEAR (कोठारी फुटवेयर)
> **Legacy of Craftsmanship & Trust Since 1998 • Idar, Gujarat**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)

Official web storefront and digital ordering platform for **Kothari Footwear**, Idar's premier footwear showroom founded in 1998 by **Shri Manak Kothari**. Handcrafted leather footwear, doctor-approved orthopedic comfort, festive wedding mojaris, and daily essentials engineered strictly in Indian footwear sizing (**IND / UK**).

---

## 🌟 Key Highlights & Features

- **🛍️ Complete Multi-Category Footwear Catalog:**
  - **Men’s Collection:** Genuine handcrafted leather shoes, festive wedding juttis/mojaris, formal dress shoes, lightweight clogs, and daily comfort slippers.
  - **Women’s Collection:** Doctor-orthopedic comfort heels, Kolhapuri ethnic sandals, everyday slip-ons, and party footwear.
  - **Kids’ Collection:** Ergonomic school shoes, sandals, and playful footwear.
- **📏 Indian Size Advisor & Interactive Size Guide:**
  - Accurate Indian standard sizing (**IND 6 to 12 for Men**, **IND 3 to 9 for Women**).
  - Built-in centimeter-based foot measurement advisor and fit recommendation.
- **💰 Smart Multi-Pair Savings Engine:**
  - Buy 2 pairs → Automatic **5% Off**.
  - Buy 3 or more pairs → Automatic **10% Off** applied directly at checkout.
- **📱 Instant WhatsApp Direct Ordering:**
  - One-click checkout sends structured itemized order summary, sizing, delivery address, and payment method directly to the shop’s official WhatsApp desk.
- **🧾 Professional PDF Tax Invoice Generation:**
  - Instant PDF invoice generation (powered by `jspdf` and `html2canvas`) with GSTIN, customer details, item breakdown, multi-pair discounts, and QR payment stamp.
- **🔐 Secure Firebase Authentication & User Sessions:**
  - Email/Password login and quick signup with instant session isolation.
  - Role-based admin access for shop owners with protected route guards.
- **👑 Full-Featured Owner / Admin Dashboard:**
  - Real-time order monitoring (Pending, Confirmed, Shipped, Delivered).
  - Customer order lookup, search, status filtering, and invoice generation.
  - Live revenue analytics and sales summary.
- **🎨 Ultra-Modern Glassmorphic UI:**
  - Curated luxury color palette, micro-animations, quick-view product modal, wishlist drawer, floating WhatsApp assist, and celebration confetti on completed orders.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, React Router v7 |
| **Bundler & Build Tool** | Vite 8 |
| **Database & Cloud** | Google Firebase (Cloud Firestore & Firebase Auth) |
| **Styling** | Vanilla CSS Design System with responsive tokens & glassmorphism |
| **Icons & Media** | Lucide React |
| **Document Generation** | jsPDF, html2canvas, DOMPurify |
| **Effects & Utility** | Canvas Confetti, Oxlint |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 2. Clone the Repository
```bash
git clone https://github.com/Devvk29/KF.git
cd KF
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OWNER_EMAIL=your_admin_email@gmail.com
```

### 5. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 6. Build for Production
```bash
npm run build
```
The optimized production build will be generated in the `dist/` directory.

---

## 🌐 Live Website Deployment Options

### Option A: GitHub Pages (Automated via GitHub Actions)
This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push this repository to your GitHub account: `https://github.com/Devvk29/KF`
2. On GitHub, go to your repository **Settings** → **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The workflow will automatically build and publish your live website at:
   `https://devvk29.github.io/KF/`

### Option B: Vercel (1-Click Deployment - Recommended)
1. Go to [Vercel](https://vercel.com) and log in with your GitHub account (`Devvk29`).
2. Click **Add New** → **Project**, and select your `KF` repository.
3. Keep default settings (Framework Preset: `Vite`, Root Directory: `./`).
4. Click **Deploy**. Your site will be live instantly with global CDN and automated SSL!

---

## 📍 Store Information & Heritage

| Detail | Information |
|---|---|
| **Store Name** | KOTHARI FOOTWEAR (formerly Kothari Shoes) |
| **Established** | 1998 (25+ Years of Heritage) |
| **Founder / Owner** | Shri Manak Kothari |
| **Address** | 134, Kothari Footwear, Near Tiranga Circle, Idar, Gujarat - 383430 |
| **Phone / WhatsApp** | +91 94276 44222 |
| **Business Hours** | Monday – Sunday: 10:00 AM – 9:00 PM |
| **Google Maps** | [Visit Store in Idar](https://maps.google.com/?q=Tiranga+Circle+Idar+Gujarat+383430) |

---

## 👨‍💻 Author & Maintainer

- **Developer:** [Devvk29](https://github.com/Devvk29)
- **Owner / Proprietor:** Shri Manak Kothari
- **Location:** Idar, Sabarkantha, Gujarat, India
