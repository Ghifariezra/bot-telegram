export function getImageUrl(image: string) {
    let iconUrl = "";

    switch (image) {
        case "Partly Cloudy":
            iconUrl =
                "https://cdn2.iconfinder.com/data/icons/hobbies-misc-1/256/weather___cloudy_partly_forecast_sunny_season_sun_day.png";
            break;

        case "Sunny":
            iconUrl =
                "https://cdn2.iconfinder.com/data/icons/hobbies-misc-1/256/weather___sun_sunny_solar_forecast_day_season_heat_hot.png";
            break;

        case "Mostly Cloudy":
            iconUrl =
                "https://cdn3.iconfinder.com/data/icons/3d-applications/512/app_icons_storage_weather___cloud_cloudy_forecast_data_database.png";
            break;

        case "Thunder":
            iconUrl =
                "https://cdn0.iconfinder.com/data/icons/weather-1134/512/Storm_3.png";
            break;

        case "Thunderstorm":
            iconUrl =
                "https://cdn0.iconfinder.com/data/icons/weather-and-season-3d-pack/512/Windy_Thunderstrom.png";
            break;

        case "Light Rain":
            iconUrl =
                "https://cdn0.iconfinder.com/data/icons/weather-and-nature-3d-illustration-set/256/Rain_Shower.png";
            break;

        case "Rain":
            iconUrl =
                "https://cdn0.iconfinder.com/data/icons/weather-1073/256/Rain_2_Front.png";
            break;

        case "Moderate Rain":
            iconUrl =
                "https://cdn2.iconfinder.com/data/icons/weather-1344/256/Rain.png";
            break;

        case "Mist/Haze":
            iconUrl =
                "https://cdn4.iconfinder.com/data/icons/weather-3d-illustration-1/512/mist_night.png";
            break;

        default:
            iconUrl =
                "https://cdn3.iconfinder.com/data/icons/social-media-notification/256/657.png";
            break;
    }

    return iconUrl
}