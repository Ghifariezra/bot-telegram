import { getRedisClient } from "../../../lib/redis";
import { promisify } from "util";
import zlib from "zlib";
import PrismaService from "../../../lib/prisma";

export default class AreaService extends PrismaService {
    private readonly CACHE_KEY = "area:provinces:all";
    private readonly CACHE_TTL = 60 * 60 * 24;
    private gzip = promisify(zlib.gzip);
    private gunzip = promisify(zlib.gunzip);

    constructor() {
        super();
    }

    async getArea() {
        const redis = getRedisClient();
        const cached = await redis.get<string>(this.CACHE_KEY);
        
        if (cached) {
            console.log("✅ Cache hit");
            const buffer = Buffer.from(cached, "base64");
            const decompressed = await this.gunzip(buffer);
            return JSON.parse(decompressed.toString());
        }

        // 2. query ke DB
        console.log("⚡ Cache miss, query DB...");
        const prisma = this.getClient();
        const result = await prisma.$queryRaw<{ jsonb_array_elements: any }[]>`
                SELECT jsonb_array_elements(weather_id.get_village_area_codes());
            `;

        const provinces = result.flatMap(r => r.jsonb_array_elements) ?? [];

        // 3. simpan ke redis (compressed)
        const compressed = await this.gzip(JSON.stringify(provinces));
        await redis.set(this.CACHE_KEY, compressed.toString("base64"), { ex: this.CACHE_TTL });

        return provinces;
    }
}
