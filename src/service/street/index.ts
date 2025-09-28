import { nominatimInstance } from "../../../lib/axios";

export default class StreetService {
    async getStreet(lat: number, lon: number) {
        const { data } = await nominatimInstance.get("", {
            params: {
                format: "json",
                lat: lat,
                lon: lon,
                zoom: 18,
                addressdetails: 1,
            },
        });

        if (!data || data.length === 0) {
            throw new Error("❌ Street not found");
        };

        return {
            full_address: data.display_name,
            village: data.address.village || data.address.suburb || data.address.locality || null,
            raw: data.address
        };
    }
}