import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.WEATHER_API || !process.env.NOMINATIM_API || !process.env.EMAIL) throw new Error("WEATHER_API is not defined in environment variables");

export const weatherInstance = axios.create({
    baseURL: process.env.WEATHER_API,
});

export const nominatimInstance = axios.create({
    baseURL: process.env.NOMINATIM_API,
    headers: {
        "User-Agent": `my-weather-app/1.0 (${process.env.EMAIL})`,
    }
});