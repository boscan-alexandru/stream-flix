# 🎬 StreamFlix: Next.js HLS Streaming Platform

| Project Status     | Technologies                     | Deployment       |
| :----------------- | :------------------------------- | :--------------- |
| Active Development | Next.js 14, Tailwind CSS, Hls.js | Docker, CapRover |

## 🌟 Cinematic Hero section

StreamFlix is a modern, self-hosted video streaming platform built with **Next.js 14 (App Router)**. It features an admin panel for managing movies, a sleek, user-friendly frontend, and HLS streaming capabilities. The entire application is optimized for containerization and quick deployment.

---

## ✨ Key Features

### 🆓 Free Viewing, Smart Ads

Our core feature is the **unique ad-scheduling policy** designed to maximize user enjoyment and monetization efficiency:

- **Completely Free:** All movies are available to watch at no cost.
- **Ad-Free Prime Time:** Enjoy **ad-free viewing** during the day, specifically from **08:00 (8 AM) until 18:00 (6 PM)** daily.
- **Targeted Ads:** Ads are only played between **18:00 (6 PM) and 08:00 (8 AM)**.

### 🎥 Player Experience

- **"Skip Intro" Button:** A prominent feature in the player utilizing movie metadata (`lengthIntro`) to jump straight to the action.
- **Smooth Navigation:** Custom "Back" button on the stream page and a responsive **Glass Header** with an integrated search bar across the application.
- **HLS Streaming:** Uses `hls.js` for reliable, adaptive bitrate streaming across modern browsers.

### ⚙️ Administration & Structure

- **Admin Movie Management:** A dedicated section for managing movie details, including title, stream paths, and critical time markers (intro/credits).
- **API Proxy:** All stream requests are routed through a Next.js API handler (`/stream-proxy/...`) for token injection and security.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Video Playback:** Hls.js
- **Icons:** Lucide React
- **Containerization:** Docker

---

## 🚀 Installation & Local Development

### Prerequisites

- Node.js (v18+)
- npm or Yarn
- Docker (for containerized testing/deployment)

### 1. Setup

```bash
# Clone the repository
git clone [YOUR_REPO_URL]
cd streamflix

# Install dependencies
npm install
# or
yarn install
```
