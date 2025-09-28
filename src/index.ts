import dotenv from "dotenv";
dotenv.config();

import TelegramBot from "node-telegram-bot-api";
import Events from "../utilities/event";
import AreaService from "./service/area";
import express from "express";

const token = process.env.TELEGRAM_TOKEN ?? "";
const botName = process.env.BOT_NAME ?? "MyBot";
const PORT = 3000;

if (!token) {
    throw new Error("TELEGRAM_TOKEN is not defined in environment variables");
}

// Bot
const bot = new TelegramBot(token, { polling: true });

// Data
const weather = new AreaService();
const dataAdm = await weather.getArea();

// Events
const events = new Events(dataAdm);

console.log("Bot is running...");

// /start command
bot.onText(/^\/start$/, (msg) => {
    const chatId = msg.chat.id;
    events.startEvent(chatId, bot, botName);
});

// Handle tombol
bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message!;
    const chatId = msg.chat.id;
    const data = callbackQuery.data ?? "";

    try {
        switch (true) {
            case data.includes("weather"):
                await events.weatherEvent(chatId, bot);
                break;

            case data.includes("province_"):
                await events.provinceEvent(data, chatId, bot);
                break;

            case data.includes("subdistrict_"):
                await events.subdistrictEvent(data, bot, chatId);
                break;

            case data.includes("district_"):
                await events.districtEvent(data, bot, chatId);
                break;

            case data.includes("village_"):
                await events.villageEvent(data, bot, chatId);
                break;

            case data.includes("location"):
                await events.locationEvent(bot, chatId);
                break;

            case data.includes("help"):
                await bot.sendMessage(
                    chatId,
                    "Available commands:\n/start - tampilkan menu\n/weather - cek cuaca\n/location - share lokasi"
                );
                break;
        }

        await bot.answerCallbackQuery(callbackQuery.id);
    } catch (err) {
        console.error("❌ Error di callback_query:", err);
        await bot.sendMessage(chatId, "⚠️ Terjadi kesalahan. Coba lagi nanti.");
    }
});

bot.on("message", async (msg) => {
    const checkLoc = msg.location !== undefined;

    switch (true) {
        case checkLoc:
            await events.geoLocationEvent(msg.chat.id, bot, msg.location!);
            break;
    }
});

// 🚀 Tambahkan Express server agar Render mendeteksi open port
const app = express();
app.get("/", (_, res) => {
    res.send("✅ Telegram bot is running...");
});
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});