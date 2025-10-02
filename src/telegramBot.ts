import TelegramBot from "node-telegram-bot-api";
import Events from "../utilities/event";
import AreaService from "./service/area";

const token = process.env.TELEGRAM_TOKEN ?? "";
const botName = process.env.BOT_NAME ?? "MyBot";
const renderURL = process.env.RENDER_EXTERNAL_URL;
const PORT = process.env.PORT || 3000;

if (!token) {
    throw new Error("TELEGRAM_TOKEN is not defined in environment variables");
}

const bot = new TelegramBot(token, { polling: true });
// const bot = new TelegramBot(token, { webHook: true });

// ✅ Daftarkan webhook ke URL Render
if (renderURL) {
    bot.setWebHook(`${renderURL}/bot${token}`);
    console.log(`✅ Webhook set: ${renderURL}/bot${token}`);
}

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
                await events.helpEvent(chatId, bot, botName);
                break;
        }

        await bot.answerCallbackQuery(callbackQuery.id);
    } catch (err) {
        console.error("❌ Error di callback_query:", err);
        await bot.sendMessage(chatId, "⚠️ Terjadi kesalahan. Coba lagi nanti.");
    }
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const checkLoc = msg.location !== undefined;
    const checkText = msg.text !== undefined && typeof msg.text === "string";
 
    switch (true) {
        case checkLoc:
            await events.geoLocationEvent(chatId, bot, msg.location!);
            break;
        case checkText:
            if (msg.text) {
                const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;

                const match = msg.text.match(coordRegex);

                if (match) {
                    if (match[1] && match[3]) {
                        await events.geoLocationEvent(chatId, bot, {
                            latitude: parseFloat(match[1]),
                            longitude: parseFloat(match[3])
                        });
                    }
                }
            }
            break;
    }
});

export { bot, PORT, token };