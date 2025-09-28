# 🤖 Bot Telegram Node.js

Project ini adalah implementasi Bot Telegram menggunakan Node.js dengan dukungan TypeScript.

Dibangun agar mudah dikembangkan dengan hot-reload (nodemon) dan environment modern (pnpm).

## 🚀 Tech Stack

-   Node.js
    -   JavaScript runtime
-   TypeScript
    -   Superset JavaScript dengan type safety
-   pnpm
    -   Package manager yang cepat dan efisien
-   ts-node
    -   Eksekusi langsung file .ts
-   nodemon
    -   Hot reload saat development

## 📦 Installation

1. Clone repository:
    ```bash
     git clone https://github.com/username/bot-telegram.git
     cd bot-telegram
    ```
2. Install dependencies:
    ```bash
     pnpm install
    ```

## ⚡ Development

Jalankan project dengan hot-reload:

```bash
    pnpm run dev
```

## 🛠️ Build & Run

Build TypeScript ke JavaScript:
```bash
    pnpm run build
```

Jalankan hasil build:
```bash
    pnpm run start
```

## 📂 Project Structure

```bash
    bot-telegram/
    │── src/
    │   └── index.ts        # Entry point bot
    │── package.json
    │── tsconfig.json
    │── nodemon.json        # Konfigurasi nodemon
    │── README.md           # Dokumentasi
    └── .gitignore
```


## 🔑 Environment Variables
Buat file `.env` di root project:
```bash
    # Telegram
    TELEGRAM_TOKEN="your-telegram-token-here"
    BOT_NAME="your-bot-name-here"

    # Supabase
    DATABASE_URL="your-database-url-here"
    DIRECT_URL="your-direct-url-here"

    # Upstash Redis
    UPSTASH_REDIS_REST_URL="your-upstash-redis-rest-url-here"
    UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token-here"

    # BMKG API
    WEATHER_API="bmkg-api-url-here"

    # OpenStreetMap API
    NOMINATIM_API="nominatim-api-url-here"

    # Email
    EMAIL="your-email-here"
```