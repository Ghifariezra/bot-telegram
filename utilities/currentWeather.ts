import type { WeatherData } from "../types/weather";

export const currentWeather = (dt: WeatherData[]) => {
    const now = new Date();
    const today = {
        y: now.getFullYear(),
        m: now.getMonth(),
        d: now.getDate(),
        h: now.getHours()
    };
    const todayWeather = dt.filter((d: WeatherData) => {
        const date = new Date(d.local_datetime);
        return (
            date.getFullYear() === today.y &&
            date.getMonth() === today.m &&
            date.getDate() === today.d
        );
    });

    const check = todayWeather.find((d: WeatherData) => {
        const hours = new Date(d.local_datetime).getHours();
        return hours >= today.h;
    }) || todayWeather[todayWeather.length - 1];

    return check;
}