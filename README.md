# 📺 TV SUPREME — Next-Gen Trilingual News & Live Broadcast Platform

> **"News • People • A Brighter Tomorrow"**  
> TV SUPREME is a modern, high-performance digital news portal, on-demand video platform, and Live TV streaming website with a powerful Content Management System (CMS). Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Prisma ORM** backed by a **MySQL** database.

---

## 📖 Table of Contents
1. [What is This Website?](#-what-is-this-website)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Administrative & CMS Credentials](#-administrative--cms-credentials)
5. [📖 CMS Editorial Guide — How to Add, Edit & Change Everything](#-cms-editorial-guide--how-to-add-edit--change-everything)
   - [5.1 How to Sign In](#51-how-to-sign-in)
   - [5.2 How to Upload & Publish a News Article](#52-how-to-upload--publish-a-news-article)
   - [5.3 How to Edit or Delete an Existing Article](#53-how-to-edit-or-delete-an-existing-article)
   - [5.4 How to Trigger Breaking News Alerts](#54-how-to-trigger-breaking-news-alerts)
   - [5.5 How to Upload Images & Manage Media](#55-how-to-upload-images--manage-media)
   - [5.6 How to Add Videos to the Video Hub](#56-how-to-add-videos-to-the-video-hub)
   - [5.7 How to Change the Live TV Broadcast Stream](#57-how-to-change-the-live-tv-broadcast-stream)
   - [5.8 How to Manage News Categories](#58-how-to-manage-news-categories)
   - [5.9 How to Edit Header Menu Navigation](#59-how-to-edit-header-menu-navigation)
   - [5.10 How to Update Footer, Social Links & Office Info](#510-how-to-update-footer-social-links--office-info)
   - [5.11 How to Add or Manage Newsroom Staff](#511-how-to-add-or-manage-newsroom-staff)
6. [Prerequisites](#-prerequisites)
7. [Step-by-Step Setup Guide (Beginner Friendly)](#-step-by-step-setup-guide-beginner-friendly)
   - [Step 1: Get the Code](#step-1-get-the-code)
   - [Step 2: Set Up the Database](#step-2-set-up-the-database)
   - [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
   - [Step 4: Install Dependencies](#step-4-install-dependencies)
   - [Step 5: Run the Website](#step-5-run-the-website)
8. [How to View and Manage the Database](#-how-to-view-and-manage-the-database)
9. [Live TV Broadcast Streaming](#-live-tv-broadcast-streaming)
10. [Contact Form & Email Setup](#-contact-form--email-setup)
11. [Scheduled Publishing (Cron)](#-scheduled-publishing-cron)
12. [Project Structure Overview](#-project-structure-overview)

---

## 🌟 What is This Website?

**TV SUPREME** is a full-featured digital media broadcasting website designed for Sri Lankan and global audiences. It serves two distinct audiences:

1. **For Visitors (Public Website):**
   - Read breaking news, feature stories, politics, business, sports, technology, and lifestyle.
   - Switch effortlessly between **English**, **Sinhala (සිංහල)**, and **Tamil (தமிழ்)**.
   - Watch **24/7 Live TV broadcasts** with zero buffering via Castr edge CDN.
   - Browse on-demand categorized videos and special broadcast recordings.
   - Search across all published news stories and video archives in real time.
   - Toggle between **Light Mode** and **Dark Mode**.

2. **For Journalists & Editors (Admin CMS):**
   - Access a secure newsroom control center (`/login` → `/admin`).
   - Create, edit, and publish stories with trilingual translations from a single screen.
   - Schedule articles and videos to auto-publish at future dates and times.
   - Manage the Live TV stream (change stream URLs, toggle broadcast live/offline).
   - Upload and organize images and videos in the centralized Media Library.
   - Reorder header navigation menus and footer branding without touching any code.

---

## 🚀 Key Features

- **🌐 Trilingual Localization (`next-intl`)**: True multi-language routing (`/en`, `/si`, `/ta`) with database-level translations and fallback to English.
- **📡 24/7 Live TV Streaming**: Adaptive bitrate HLS player and hosted Castr player iframe with automatic mute/autoplay policies.
- **⚡ Breaking News Alerts**: Real-time breaking news banner and ticker on the homepage.
- **📱 Fully Responsive UI**: Optimized for smartphones, tablets, laptops, and ultra-wide desktop screens.
- **🛡️ Secure Token-Based Sessions**: HttpOnly session cookies with SHA-256 server-side database hashing and Role-Based Access Control (`ADMIN` and `EDITOR`).
- **🔍 Full-Text Search**: Live keyword search across published MySQL articles and videos.
- **🧱 Drag-and-Drop Page Builder**: Structured block builder (Text, Images, Video) for creating custom institutional and legal pages.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.3.4 (App Router)** | Server Components, dynamic streaming, and `proxy.ts` middleware. |
| **UI Library** | **React 19.2.8** | Modern React Server Components & client hooks. |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS with scoped Dark Mode and custom brand tokens. |
| **Database ORM** | **Prisma 7.10** | Type-safe database queries using `@prisma/adapter-mariadb`. |
| **Database Engine** | **MySQL 8.0+ / MariaDB 10.5+** | Relational database (`supremenews`) with `utf8mb4` encoding. |
| **Internationalization** | **next-intl 4.14** | Trilingual route negotiation and UI string localization. |
| **Icons** | **Lucide React** | Clean, accessible vector icons. |
| **Live Streaming** | **HLS.js & Castr Player** | HTTP Live Streaming (`.m3u8`) and Castr Hosted Embeds. |
| **Email Service** | **Nodemailer** | Direct SMTP transport for visitor contact submissions. |

---

## 🔑 Administrative & CMS Credentials

The administrative Content Management System is protected by an authentication boundary.

| Field | Value |
| :--- | :--- |
| **Login URL** | [`http://localhost:3000/login`](http://localhost:3000/login) *(or `yourdomain.com/login`)* |
| **Admin Email** | `admin@supremenews.com` |
| **Admin Password** | `admin123` |
| **User Role** | `ADMIN` (Full administrative privileges) |

> 🔒 **Security Notice:** After your initial sign-in, it is strongly recommended to update this default password under **Admin → Profile** ([`/admin/profile`](http://localhost:3000/admin/profile)) or **Admin → Users** ([`/admin/users`](http://localhost:3000/admin/users)).

---

## 📖 CMS Editorial Guide — How to Add, Edit & Change Everything

This section explains step-by-step how editors, journalists, and site owners manage all content on the website without needing any programming knowledge.

### 5.1 How to Sign In
1. Go to **[`http://localhost:3000/login`](http://localhost:3000/login)** (or `https://yourdomain.com/login`).
2. Enter your Email (`admin@supremenews.com`) and Password (`admin123`).
3. Click **Sign in**. You will be taken directly to the **Admin Dashboard** (`/admin`).

---

### 5.2 How to Upload & Publish a News Article
1. In the left sidebar, click **News** → **New Article** (or go to [`/admin/news/new`](http://localhost:3000/admin/news/new)).
2. **Article Slug**: Enter a URL-friendly name (e.g. `sri-lanka-economic-growth-2026`).
3. **Category**: Choose the relevant category (e.g., *Sri Lanka*, *Politics*, *Business*, *Sports*, etc.).
4. **Main Feature Image**:
   - Click **Select Main Image** to choose an image from your Media Library or upload a new one.
5. **Trilingual Content Tabs (English, Sinhala, Tamil)**:
   - Click the **English** tab: Enter Article Title, a 1-sentence Summary, and the Full Story content.
   - Click the **Sinhala** tab: Enter the Sinhala title, summary, and story.
   - Click the **Tamil** tab: Enter the Tamil title, summary, and story.
   - *(Tip: If you do not have Sinhala or Tamil translations ready, leave them empty. The system will automatically fall back to English!)*
6. **Visibility & Badges**:
   - Check **Breaking News** if this is an urgent developing story.
   - Check **Featured Story** or **Show on Homepage** to pin it to top sections.
7. **Publishing Status**:
   - Select **PUBLISHED** to release it immediately.
   - Select **DRAFT** to save your work privately.
   - Select **SCHEDULED** and choose a date & time if you want it to publish automatically in the future.
8. Click **Publish Article** (or **Save**). The story is now live on the website!

---

### 5.3 How to Edit or Delete an Existing Article
1. In the left sidebar, click **News** ([`/admin/news`](http://localhost:3000/admin/news)).
2. You will see a list of all articles with their status (*Published*, *Draft*, *Scheduled*).
3. Use the search bar or category filters to find the story you want.
4. Click the **Edit (Pencil)** icon to open the article editor.
5. Update any text, image, category, or translations, then click **Save Changes**.
6. To delete an article, click the **Trash/Delete** icon and confirm.

---

### 5.4 How to Trigger Breaking News Alerts
1. When creating or editing an article, simply turn ON the **Breaking News** toggle.
2. Alternatively, go to **Breaking News** in the sidebar ([`/admin/breaking-news`](http://localhost:3000/admin/breaking-news)).
3. The story will immediately display with a pulsating **LIVE BREAKING** badge on the homepage header and breaking news ticker.

---

### 5.5 How to Upload Images & Manage Media
1. In the sidebar, click **Media** ([`/admin/media`](http://localhost:3000/admin/media)).
2. Click **Upload New Media** or drag & drop files from your computer.
3. You can upload photos (JPG, PNG, WebP) and video clips.
4. Add **Alt Text** (image description) for SEO and accessibility.
5. Once uploaded, any image is immediately available in the Media Picker whenever you write an article.

---

### 5.6 How to Add Videos to the Video Hub
1. In the sidebar, click **Videos** ([`/admin/videos`](http://localhost:3000/admin/videos)).
2. Click **Add Video**.
3. Enter:
   - **Video Title** & **Description**.
   - **Video URL**: Enter your video source (YouTube embed link, Castr stream link, or direct MP4 link).
   - **Thumbnail**: Pick an image from the Media Library.
   - **Video Category**: Choose where the video appears (News, Sports, Special Coverage).
   - **Duration**: (e.g. `05:30`).
4. Set status to **PUBLISHED** and click **Save Video**. It will now appear on [`/en/video`](http://localhost:3000/en/video).

---

### 5.7 How to Change the Live TV Broadcast Stream
1. In the sidebar, click **Live TV** ([`/admin/live-tv`](http://localhost:3000/admin/live-tv)).
2. You will see the Live Stream Configuration form:
   - **Stream URL**: Paste your live feed URL.
     - *For Castr Player:* `https://player.castr.com/YOUR_STREAM_ID`
     - *For Direct HLS:* `https://your-stream-server.com/live/stream.m3u8`
     - *For YouTube:* `https://www.youtube.com/embed/YOUR_VIDEO_ID`
   - **Stream Type**: Select **Embed** (for Castr/YouTube) or **HLS** (for `.m3u8`).
   - **Broadcast Status**: Toggle to **LIVE** (or toggle to OFFLINE during maintenance).
   - **Player Title**: (e.g. `TV SUPREME LIVE - 24/7 News Channel`).
3. Click **Save Settings**. Both the homepage compact player and the dedicated [`/watch-live`](http://localhost:3000/en/watch-live) page will update immediately!

---

### 5.8 How to Manage News Categories
1. In the sidebar, click **Categories** ([`/admin/categories`](http://localhost:3000/admin/categories)).
2. To create a category, click **Add Category**, enter the English slug (e.g., `economy`), and enter the names in English, Sinhala, and Tamil.
3. To edit an existing category's name or translation, click the Edit button next to it.

---

### 5.9 How to Edit Header Menu Navigation
1. In the sidebar, click **Menu** ([`/admin/menu`](http://localhost:3000/admin/menu)).
2. You can add custom links, category links, or page links to the top navigation bar.
3. Drag items or edit their **Position Number** to change the order in which they appear.
4. Toggle **Visible** on or off to temporarily hide links without deleting them.

---

### 5.10 How to Update Footer, Social Links & Office Info
1. In the sidebar, click **Footer** ([`/admin/footer`](http://localhost:3000/admin/footer)) or **Settings** ([`/admin/settings`](http://localhost:3000/admin/settings)).
2. You can update:
   - **Social Media Links**: Facebook, YouTube, Instagram, and TikTok URLs.
   - **Office Details**: Telephone number, physical address, and Google Maps embed link.
   - **Branding**: Tagline and Copyright text.
3. Click **Save Settings** to reflect changes across the entire site footer.

---

### 5.11 How to Add or Manage Newsroom Staff
1. In the sidebar, click **Users** ([`/admin/users`](http://localhost:3000/admin/users)).
2. Click **Add User** and provide their:
   - **Full Name**
   - **Email Address**
   - **Password** (minimum 8 characters)
   - **Role**: 
     - `ADMIN`: Full access to settings, user management, and all content.
     - `EDITOR`: Access to write, edit, and publish articles, videos, and media.
3. Click **Create User**. They can now sign in at `/login`.

---

## 📋 Prerequisites

Before setting up the project, make sure you have the following installed on your computer or server:

| Requirement | Windows | macOS | Linux |
| :--- | :--- | :--- | :--- |
| **Node.js** (v20+ recommended) | [Download Windows Installer (.msi)](https://nodejs.org/) | [Download macOS PKG](https://nodejs.org/) or `brew install node` | `sudo apt install nodejs npm` or via NodeSource |
| **MySQL Database** (v8.0+ or MariaDB) | [XAMPP for Windows](https://www.apachefriends.org/) *(Recommended)* or [MySQL Installer](https://dev.mysql.com/downloads/installer/) | Homebrew (`brew install mysql`) or [XAMPP for Mac](https://www.apachefriends.org/) | `sudo apt install mysql-server` |
| **Terminal / Shell** | PowerShell, Windows Terminal, or CMD | Terminal (zsh / bash) | Bash / Zsh |

---

## 💻 Step-by-Step Setup Guide (Windows, macOS & Linux)

### Step 1: Extract or Clone the Code

Extract the provided zip file or clone the repository to your machine, then open your terminal inside the project directory:

**Windows (PowerShell / Command Prompt):**
```cmd
cd tv-supreme-news
```

**macOS / Linux:**
```bash
cd tv-supreme-news
```

---

### Step 2: Set Up the Database (`supremenews`)

The project includes a ready-to-use, pre-seeded database file: `supremenews_database.sql`.  
You can import it using **either** the visual GUI method (phpMyAdmin) or the command line.

#### Method A: Using phpMyAdmin (Recommended — Works Identically on Windows & Mac)

If you are using **XAMPP**, **WAMP**, or standalone phpMyAdmin:
1. Start MySQL in your XAMPP Control Panel (or Homebrew on Mac).
2. Open your web browser and go to **`http://localhost/phpmyadmin`** (or `http://localhost:8080`).
3. Click **New** in the left sidebar.
4. Set Database Name: **`supremenews`**.
5. Set Collation: **`utf8mb4_unicode_ci`** *(Crucial for Sinhala and Tamil multi-byte script)*.
6. Click **Create**.
7. Click on the new **`supremenews`** database in the left sidebar.
8. Click the **Import** tab at the top.
9. Under **File to import**, click **Choose File** (or **Browse**) and select `supremenews_database.sql` from your project folder.
10. Ensure the **Character set of the file** is set to **`utf-8`**.
11. Scroll to the bottom and click **Import** (or **Go**).
12. All tables, news articles, categories, and settings are now imported!

---

#### Method B: Using Terminal / Command Prompt

##### 🪟 On Windows (PowerShell / Command Prompt):

> [!IMPORTANT]
> Windows Command Prompt uses Code Page 437 / 1252 by default, which corrupts non-English characters (Sinhala `සිංහල`, Tamil `தமிழ்`, smart quotes, and dashes) into literal question marks (`??????`). You **must** set the console to UTF-8 (`chcp 65001`) before piping the file:

**Option 1: Using Windows Command Prompt (CMD):**
```cmd
chcp 65001
mysql -h 127.0.0.1 -u root -p --default-character-set=utf8mb4 < supremenews_database.sql
```
*(If your root user has no password, simply press Enter when prompted for password).*

**Option 2: Using Windows PowerShell:**
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Get-Content -Encoding UTF8 supremenews_database.sql | mysql -h 127.0.0.1 -u root -p --default-character-set=utf8mb4
```

**Option 3: Interactive MySQL Shell (Universal for Windows & Mac):**
```cmd
mysql -u root -p
```
Inside the MySQL shell, run:
```sql
CREATE DATABASE IF NOT EXISTS supremenews CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE supremenews;
SET NAMES utf8mb4;
SOURCE supremenews_database.sql;
EXIT;
```
*(On Windows, you can provide the full path with forward slashes, e.g., `SOURCE C:/Users/YourName/tv-supreme-news/supremenews_database.sql;`)*

---

##### 🍎 On macOS & 🐧 Linux:

```bash
mysql -h 127.0.0.1 -u root -p --default-character-set=utf8mb4 < supremenews_database.sql
```
*(If your MySQL root user has no password, press Enter when prompted).*

---

### Step 3: Configure Environment Variables (`.env`)

Create your `.env` configuration file from the template:

**On Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**On macOS / Linux:**
```bash
cp .env.example .env
```

Open the newly created `.env` file in VS Code, Notepad, or any editor and verify your database settings:

```env
# Database Connection (MySQL / MariaDB)
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_DATABASE="supremenews"
MYSQL_USER="root"
MYSQL_PASSWORD=""

# Gmail SMTP for Contact Form (Optional - only needed if you want visitor emails sent to your inbox)
GMAIL_USER="your-newsroom@gmail.com"
GMAIL_APP_PASSWORD="your-google-app-password"
CONTACT_RECIPIENT_EMAIL="your-newsroom@gmail.com"

# Secret token for scheduled content publishing (leave default for local testing)
CRON_SECRET="your-secret-token-here"
```

> 💡 **Password Tip:**
> - If you are using **XAMPP on Windows or Mac**, the default MySQL password is empty. Leave `MYSQL_PASSWORD=""` blank.
> - If you installed MySQL via **MySQL Installer on Windows**, enter the root password you created during the installation wizard.
> - If you installed via **Homebrew on Mac**, the default root password is also empty.

---

### Step 4: Install Dependencies

Run `npm install` to download all project dependencies:

**On Windows / macOS / Linux:**
```bash
npm install
```

This installs all dependencies and automatically executes `prisma generate` to configure the database client for your operating system.

*(Optional)* Verify that your database connects cleanly:
```bash
npm run db:validate
```

---

### Step 5: Run the Website

#### Development Mode (Recommended for Testing & Editing):
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!
- The public website will load at `http://localhost:3000`.
- The admin login page is at `http://localhost:3000/login`.

#### Production Mode (Optimized Build):
```bash
npm run build
npm start
```

---

## 🛠️ Cross-Platform Troubleshooting (Common Issues & Fixes)

### 1. Windows: "Script execution is disabled on this system" in PowerShell
If PowerShell blocks running `npm` or `npx`:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. Windows: Sinhala or Tamil characters show as `??????`
This happens when importing SQL using Windows CMD without setting UTF-8.  
**Fix:** Use **phpMyAdmin** to import `supremenews_database.sql`, or in CMD run `chcp 65001` before running `mysql`.

### 3. Port 3000 is already in use
If another application or previous dev server is using port 3000:
- **Run on a different port:**
  ```bash
  npm run dev -- -p 3001
  ```
  Then visit `http://localhost:3001`.
- **Or free up port 3000:**
  - **On Windows (CMD):**
    ```cmd
    netstat -ano | findstr :3000
    taskkill /PID <PID_NUMBER> /F
    ```
  - **On macOS / Linux:**
    ```bash
    lsof -ti :3000 | xargs kill -9
    ```

### 4. MySQL Connection Refused (`ECONNREFUSED 127.0.0.1:3306`)
- **On Windows:** Open the **XAMPP Control Panel** and make sure the **MySQL** module is started (green indicator). If using Windows Service, open `services.msc` and start **MySQL80**.
- **On macOS:** Run `brew services start mysql` in your terminal.

---

## 🗄️ How to View and Manage the Database

You have three convenient ways to browse and edit the database:

### 1. Built-in Prisma Studio (Zero-Install GUI)
Run this command in your project terminal:
```bash
npm run db:studio
```
Prisma Studio opens an interactive web spreadsheet at **[http://localhost:51212](http://localhost:51212)** where you can view, filter, edit, and create records without any extra software.

### 2. phpMyAdmin (Without XAMPP on macOS)
If you have PHP installed on your Mac, you can run standalone phpMyAdmin anytime:
```bash
php -S localhost:8080 -t /opt/homebrew/share/phpmyadmin
```
Open **[http://localhost:8080](http://localhost:8080)**, login with user `root` (password empty), and choose `supremenews`.

### 3. Native Database Clients
You can also connect using free desktop apps like **[TablePlus](https://tableplus.com/)**, **[Sequel Ace](https://sequel-ace.com/)**, or **MySQL Workbench**:
- **Host**: `127.0.0.1`
- **Port**: `3306`
- **User**: `root`
- **Database**: `supremenews`

---

## 📡 Live TV Broadcast Streaming

The TV SUPREME Live TV system is powered by **Castr CDN**:

- **Active Stream URL:**  
  `https://player.castr.com/live_3b18e370d0f011efa5904f4336ecbf7e`
- **Stream Type:** `EMBED`
- **Watch Live Page:** [`http://localhost:3000/en/watch-live`](http://localhost:3000/en/watch-live)

### Changing the Live Stream URL:
1. Log in to the CMS at [`/login`](http://localhost:3000/login).
2. Go to **Live TV** in the sidebar ([`/admin/live-tv`](http://localhost:3000/admin/live-tv)).
3. Enter your new stream URL (supports **HLS `.m3u8`**, **MP4**, **YouTube**, or **Castr Player**).
4. Select the appropriate Stream Type and toggle **Live** / **Enabled**.
5. Click **Save Settings**. Both the homepage player and the `/watch-live` page will update immediately!

---

## 📧 Contact Form & Email Setup

The public **Contact Us** page ([`/en/contact`](http://localhost:3000/en/contact)) allows visitors to send feedback and news tips directly to your editorial team.

### How it works:
- Submissions are sent directly via Gmail SMTP using **Nodemailer**.
- When you click "Reply" in your email client, it automatically replies to the visitor's submitted email address.

### Setup Instructions:
1. Enable **2-Step Verification** on your Google Account (`myaccount.google.com/security`).
2. Generate an **App Password**:
   - Go to `myaccount.google.com/apppasswords`.
   - Name it `TV Supreme Website` and copy the 16-character generated password.
3. Put the credentials in your `.env` file:
   ```env
   GMAIL_USER="your-newsroom@gmail.com"
   GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"
   CONTACT_RECIPIENT_EMAIL="your-newsroom@gmail.com"
   ```
4. Restart the web server.

---

## ⏰ Scheduled Publishing (Cron)

Journalists can write news stories in advance and schedule them to publish automatically at a future date and time.

To automatically publish scheduled articles and videos when their time arrives:
- Set up a cron job on your server to call this endpoint **once every minute**:
  ```bash
  * * * * * curl -fsS -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/cron/publish-scheduled > /dev/null
  ```
- For local testing, you can run the included helper script:
  ```bash
  node scripts/publish-scheduled-local.mjs
  ```

---

## 📁 Project Structure Overview

```text
tv-supreme-news/
├── prisma/
│   ├── schema.prisma               # Prisma data models (Articles, Users, Media, etc.)
│   └── prisma.config.ts            # Prisma connection configuration
├── public/                         # Public logos, default images, and icons
├── scripts/                        # Utility scripts (scheduled publishing, DB tools)
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── [locale]/               # Localized public routes (en, si, ta)
│   │   │   ├── page.tsx            # Main Homepage
│   │   │   ├── [slug]/             # Category and custom CMS pages
│   │   │   ├── news/[slug]/        # Full article detail view
│   │   │   ├── video/              # On-demand video hub
│   │   │   ├── watch-live/         # Dedicated 24/7 Live TV page
│   │   │   ├── search/             # Full-text search page
│   │   │   └── about, contact, etc # Institutional pages
│   │   ├── admin/                  # CMS Control Panel (Articles, Media, Settings, Users)
│   │   ├── login/                  # CMS Authentication screen
│   │   └── api/                    # REST APIs (Public, Admin, Auth, Cron)
│   ├── components/                 # Reusable React components (Header, Footer, Sliders, Players)
│   ├── lib/                        # Core utilities (Auth, MySQL connection, Prisma client)
│   ├── messages/                   # Trilingual UI dictionaries (en.json, si.json, ta.json)
│   └── i18n/                       # Localization routing setup
├── proxy.ts                        # Next.js 16 Edge proxy (Auth protector & locale router)
├── package.json                    # Project dependencies and npm scripts
├── supremenews_database.sql        # Full MySQL database dump for instant import
└── README.md                       # This comprehensive documentation
```

---

## 🤝 Need Help or Support?
For any questions regarding deployment, database migration, or server setup, refer to the documentation above or contact the technical administrator.
