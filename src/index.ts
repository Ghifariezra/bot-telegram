import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import { bot, PORT, token } from "./telegramBot";

const app = express();
app.use(bodyParser.json());

// ✅ endpoint untuk webhook
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.get("/", (_, res) => {
    res.send("✅ Telegram bot with webhook is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
