import { weatherInstance } from "../../../lib/axios";

export default class WeatherService {
    async getWeather(code: string) {
        const { data } = await weatherInstance.get("/prakiraan-cuaca", {
            params: {
                adm4: code
            }
        });
        return data;
    }
}