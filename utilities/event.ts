import type TelegramBot from "node-telegram-bot-api";
import WeatherService from "../src/service/weather";
import StreetService from "../src/service/street";
import { getImageUrl } from "./icon";
import { batch } from "./batch";
import { currentWeather } from "./currentWeather";
import type { District, Province, Data } from "../types/provinces";

export default class Events extends WeatherService {
    private dataAdm: Data[] = [];
    private districtNames: string[] = [];
    private subdistrictNames: string[] = [];
    private streetService = new StreetService();

    constructor(data: Data[]) {
        super();
        this.dataAdm = data;
    }

    startEvent(chatId: number, bot: TelegramBot, botName: string) {
        bot.sendMessage(
            chatId,
            `👋 Halo! Aku *${botName}*  
Saya bisa bantu kamu cek cuaca secara real-time 🌤️  

📌 *Catatan*: Tombol *Location* hanya bisa dipakai di aplikasi Telegram HP (Android/iOS).  

Kalau kamu pakai Telegram Web/PC, silakan kirim koordinat manual (contoh: \`-6.2000,106.8166\`).  

Pilih menu di bawah untuk mulai ⬇️`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "🌤️ Cek Cuaca", callback_data: "weather" },
                            { text: "📍 Kirim Lokasi", callback_data: "location" },
                        ],
                        [{ text: "ℹ️ Bantuan", callback_data: "help" }],
                    ],
                },
                parse_mode: "Markdown"
            }
        );
    }


    async weatherEvent(chatId: number, bot: TelegramBot) {
        const provinceButtons = this.dataAdm.flatMap((p: Province) => ({
            text: p.province,
            callback_data: `province_${encodeURIComponent(p.province)}`
        }));

        await bot.sendMessage(
            chatId,
            `🌍 *Cek Cuaca Berdasarkan Wilayah*  

Silakan pilih *Provinsi* terlebih dahulu dari daftar di bawah.  
Setelah itu, kamu bisa lanjut pilih *Kota/Kabupaten → Kecamatan → Kelurahan* untuk melihat cuaca detail. ⛅`,
            {
                reply_markup: {
                    inline_keyboard: batch(provinceButtons)
                },
                parse_mode: "Markdown"
            }
        );
    }

    async provinceEvent(data: string, chatId: number, bot: TelegramBot) {
        this.districtNames = [];

        // Ambil nama provinsi
        const province = decodeURIComponent(data.replace("province_", ""));
        const provinceData = this.dataAdm.find((p: Province) => p.province === province);

        if (!provinceData) {
            await bot.sendMessage(chatId, `⚠️ Provinsi "${province}" tidak ditemukan.`);
            return;
        }

        provinceData.villages.flatMap((d: District) => {
            if (!this.districtNames.includes(d.district_name)) {
                this.districtNames.push(d.district_name);
            }
        });

        const districtButtons = this.districtNames.flatMap((d: string) => ({
            text: d,
            callback_data: `district_${encodeURIComponent(d)}`
        }));

        await bot.sendMessage(
            chatId,
            `🏙️ *Daftar Kota/Kabupaten di Provinsi ${province}*  

Silakan pilih salah satu *Kota/Kabupaten* di bawah untuk melanjutkan.  

Setelah itu kamu bisa pilih *Kecamatan* yang tersedia. 🏢`,
            {
                reply_markup: {
                    inline_keyboard: batch(districtButtons)
                },
                parse_mode: "Markdown"
            }
        );

    }

    async districtEvent(data: string, bot: TelegramBot, chatId: number) {
        this.subdistrictNames = [];

        // Ambil nama kota
        const district = decodeURIComponent(data.replace("district_", ""));
        const subdistrictData = this.dataAdm.flatMap((d: Data) => d.villages).filter((d: District) => d.district_name === district);

        if (!subdistrictData) {
            await bot.sendMessage(chatId, `⚠️ Kota "${district}" tidak ditemukan.`);
            return;
        }

        subdistrictData.flatMap((d: District) => {
            if (!this.subdistrictNames.includes(d.subdistrict_name)) {
                this.subdistrictNames.push(d.subdistrict_name);
            }
        });

        const subdistrictButtons = this.subdistrictNames.flatMap((sd: string) => ({
            text: sd,
            callback_data: `subdistrict_${encodeURIComponent(sd)}`
        }));

        await bot.sendMessage(
            chatId,
            `🏢 *Daftar Kecamatan di ${district}*  

Pilih salah satu *Kecamatan* dari daftar berikut.  

Setelah itu kamu akan diminta memilih *Kelurahan/Desa* di dalamnya. 🏡`,
            {
                reply_markup: {
                    inline_keyboard: batch(subdistrictButtons)
                },
                parse_mode: "Markdown"
            }
        );

    }

    async subdistrictEvent(data: string, bot: TelegramBot, chatId: number) {
        // Ambil nama kecamatan
        const subdistrict = decodeURIComponent(data.replace("subdistrict_", ""));

        const villageData = this.dataAdm.flatMap((d: Data) => d.villages).filter((d: District) => d.subdistrict_name === subdistrict);

        if (!villageData) {
            await bot.sendMessage(chatId, `⚠️ Kecamatan "${subdistrict}" tidak ditemukan.`);
            return;
        }

        const villageButtons = villageData.flatMap((v: District) => ({
            text: v.village_name,
            callback_data: `village_${encodeURIComponent(v.village_code)}`
        }));

        await bot.sendMessage(
            chatId,
            `🏡 *Daftar Kelurahan/Desa di ${subdistrict}*  

Pilih salah satu *Kelurahan/Desa* dari daftar berikut.

Setelah kamu memilih, bot akan menampilkan *informasi cuaca terbaru* untuk wilayah tersebut. ⛅`,
            {
                reply_markup: {
                    inline_keyboard: batch(villageButtons)
                },
                parse_mode: "Markdown"
            }
        );
    }

    async villageEvent(data: string, bot: TelegramBot, chatId: number) {
        // Ambil nama kelurahan
        const village = decodeURIComponent(data.replace("village_", ""));

        const weather = await this.getWeather(village);
        const dt = weather.data[0].cuaca.flat();

        const weatherNow = currentWeather(dt);
        const check = weatherNow;

        if (!check) {
            await bot.sendMessage(chatId, `⚠️ Kelurahan "${village}" tidak ditemukan.`);
            return;
        }

        const image = getImageUrl(check.weather_desc_en);

        const messageWeather =
            `🌍 *Lokasi*  
• Provinsi: *${weather.lokasi.provinsi}*  
• Kota: *${weather.lokasi.kotkab}*  
• Kecamatan: *${weather.lokasi.kecamatan}*  
• Kelurahan: *${weather.lokasi.desa}*  

🌤️ *Cuaca* : ${check.weather_desc}  

🌡️ *Temperatur* : ${check.t}°C  
💧 *Kelembaban* : ${check.hu}%  
🍃 *Kecepatan Angin* : ${check.ws} m/s`;


        await bot.sendPhoto(chatId, image, {
            caption: messageWeather,
            parse_mode: "Markdown"
        });
    }

    async locationEvent(bot: TelegramBot, chatId: number) {
        await bot.sendMessage(chatId, "📍 Silakan kirim lokasi kamu:", {
            reply_markup: {
                keyboard: [
                    [{ text: "📌 Share Lokasi Saya", request_location: true }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }

    async geoLocationEvent(chatId: number, bot: TelegramBot, location: {
        latitude: number;
        longitude: number;
    }) {
        const street = await this.streetService.getStreet(location.latitude, location.longitude);
        const village = street.raw.neighbourhood.trim().split(" ").join("").toLowerCase();
        const villageCapitalized = village.charAt(0).toUpperCase() + village.slice(1);

        const villageCode = this.dataAdm.flatMap((d: Data) => d.villages).find((d: District) => d.village_name === villageCapitalized);

        if (!villageCode) {
            await bot.sendMessage(chatId, `⚠️ Kelurahan "${villageCapitalized}" tidak ditemukan.`);
            return;
        }

        const weather = await this.getWeather(villageCode.village_code);
        const dt = weather.data[0].cuaca.flat();

        const weatherNow = currentWeather(dt);
        const check = weatherNow;

        if (!check) {
            await bot.sendMessage(chatId, `⚠️ Kelurahan "${villageCapitalized}" tidak ditemukan.`);
            return;
        }

        const image = getImageUrl(check.weather_desc_en);

        const messageWeather =
            `🌍 *Lokasi*  
• Provinsi: *${weather.lokasi.provinsi}*  
• Kota: *${weather.lokasi.kotkab}*  
• Kecamatan: *${weather.lokasi.kecamatan}*  
• Kelurahan: *${weather.lokasi.desa}*  

🌤️ *Cuaca* : ${check.weather_desc}  

🌡️ *Temperatur* : ${check.t}°C  
💧 *Kelembaban* : ${check.hu}%  
🍃 *Kecepatan Angin* : ${check.ws} m/s`;


        await bot.sendPhoto(chatId, image, {
            caption: messageWeather,
            parse_mode: "Markdown"
        });

    }
}