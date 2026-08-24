import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";

function Weather() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const translations = {
    English: {
      farmWeather: "Weather & Agronomic Telemetry",
      loadingWeather: "Fetching meteorological data...",
      weatherConditions: "Real-time field conditions & forecast for",
      currentConditions: "Current Conditions",
      location: "Location",
      feelsLike: "Feels like",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      conditions: "Condition",
      fiveDayForecast: "5-Day Agricultural Forecast",
      forecastDescription: "Plan irrigation, fertilizing, and harvests.",
      rain: "Rain Probability",
      farmingAdvisory: "Agronomic Advisory",
      sunrise: "Sunrise",
      sunset: "Sunset",
      todaysSunrise: "Sunrise",
      todaysSunset: "Sunset",
      weatherProvided: "Meteorological telemetry provided by Open-Meteo API.",
      farmingDisclaimer: "Always confirm localized micro-climate variations before chemical spraying.",
      today: "Today",
      clearSky: "Clear Sky",
      mainlyClear: "Mainly Clear",
      partlyCloudy: "Partly Cloudy",
      overcast: "Overcast",
      foggy: "Foggy",
      drizzle: "Drizzle",
      rainWeather: "Rain",
      snow: "Snow",
      rainShowers: "Showers",
      thunderstorm: "Thunderstorm",
      unknownConditions: "Unknown",
      avoidFieldWork: "Postpone Field Spraying",
      thunderstormAdvice: "Thunderstorms detected. Avoid chemical spraying, exposed fieldwork, and electrical pump maintenance.",
      rainyConditions: "Precipitation Alert",
      rainAdvice: "Rain forecast. Postpone scheduled irrigation and avoid foliar fertilization to prevent chemical wash-off.",
      highTemperature: "Heat Stress Alert",
      highTemperatureAdvice: "Elevated temperature. Increase soil moisture retention and provide shade for vulnerable nursery seedlings.",
      highHumidity: "High Moisture & Fungal Risk",
      highHumidityAdvice: "Relative humidity exceeds 80%. Check crop leaves closely for spore development and powdery mildew.",
      goodConditions: "Favorable Agronomic Window",
      goodConditionsAdvice: "Atmospheric parameters are optimal for routine cultivation, field operations, and scheduled harvest.",
      unableToLoad: "Unable to retrieve meteorological telemetry.",
    },
    Telugu: {
      farmWeather: "వ్యవసాయ వాతావరణం",
      loadingWeather: "వాతావరణ సమాచారాన్ని లోడ్ చేస్తోంది...",
      weatherConditions: "వాతావరణ పరిస్థితులు మరియు సూచనలు",
      currentConditions: "ప్రస్తుత పరిస్థితులు",
      location: "ప్రాంతం",
      feelsLike: "అనుభూతి",
      humidity: "తేమ",
      windSpeed: "గాలి వేగం",
      conditions: "పరిస్థితి",
      fiveDayForecast: "5 రోజుల సూచన",
      forecastDescription: "పనులను ప్లాన్ చేసుకోండి.",
      rain: "వర్షం",
      farmingAdvisory: "వ్యవసాయ సలహా",
      sunrise: "సూర్యోదయం",
      sunset: "సూర్యాస్తమయం",
      todaysSunrise: "సూర్యోదయం",
      todaysSunset: "సూర్యాస్తమయం",
      weatherProvided: "Open-Meteo API ద్వారా అందించబడింది.",
      farmingDisclaimer: "పొల పరిస్థితులను గమనించండి.",
      today: "ఈరోజు",
      clearSky: "నిర్మలంగా ఉంది",
      mainlyClear: "ప్రధానంగా నిర్మలం",
      partlyCloudy: "పాక్షిక మేఘావృతం",
      overcast: "మేఘావృతం",
      foggy: "పొగమంచు",
      drizzle: "చిరుజల్లు",
      rainWeather: "వర్షం",
      snow: "మంచు",
      rainShowers: "జల్లులు",
      thunderstorm: "ఉరుములు",
      unknownConditions: "తెలియదు",
      avoidFieldWork: "పొల పనులను నివారించండి",
      thunderstormAdvice: "ఉరుములు ఉన్నాయి. పిచికారీ మరియు పనులను ఆపండి.",
      rainyConditions: "వర్షపు హెచ్చరిక",
      rainAdvice: "వర్షం ఉంది. నీటిపారుదల మరియు పిచికారీ నివారించండి.",
      highTemperature: "అధిక ఉష్ణోగ్రత",
      highTemperatureAdvice: "వేడి ఎక్కువగా ఉంది. తగినంత నీరు అందించండి.",
      highHumidity: "అధిక తేమ",
      highHumidityAdvice: "శిలీంధ్ర వ్యాధుల ప్రమాదం ఉంది. ఆకులను పరిశీలించండి.",
      goodConditions: "అనుకూల పరిస్థితులు",
      goodConditionsAdvice: "పరిస్థితులు వ్యవసాయానికి అనుకూలంగా ఉన్నాయి.",
      unableToLoad: "లోడ్ చేయడం సాధ్యపడలేదు.",
    },
    Hindi: {
      farmWeather: "कृषि मौसम सलाह",
      loadingWeather: "मौसम डेटा लोड हो रहा है...",
      weatherConditions: "वर्तमान मौसम और कृषि पूर्वानुमान",
      currentConditions: "वर्तमान स्थिति",
      location: "स्थान",
      feelsLike: "महसूस तापमान",
      humidity: "नमी",
      windSpeed: "हवा की गति",
      conditions: "स्थिति",
      fiveDayForecast: "5-दिन का पूर्वानुमान",
      forecastDescription: "कृषि गतिविधियों की योजना बनाएं।",
      rain: "बारिश",
      farmingAdvisory: "कृषि सलाह",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      todaysSunrise: "सूर्योदय",
      todaysSunset: "सूर्यास्त",
      weatherProvided: "Open-Meteo API द्वारा संचालित।",
      farmingDisclaimer: "निर्णय से पहले खेत की स्थिति देखें।",
      today: "आज",
      clearSky: "साफ आसमान",
      mainlyClear: "मुख्यतः साफ",
      partlyCloudy: "आंशिक बादल",
      overcast: "बादल",
      foggy: "कोहरा",
      drizzle: "बूंदाबांदी",
      rainWeather: "बारिश",
      snow: "बर्फ",
      rainShowers: "बौछारें",
      thunderstorm: "गरज के साथ बारिश",
      unknownConditions: "अज्ञात",
      avoidFieldWork: "छिड़काव स्थगित करें",
      thunderstormAdvice: "गरज के साथ बारिश की संभावना। खुले खेत में काम न करें।",
      rainyConditions: "बारिश चेतावनी",
      rainAdvice: "बारिश का अनुमान है। सिंचाई और छिड़काव रोकें।",
      highTemperature: "उच्च तापमान",
      highTemperatureAdvice: "गर्मी का तनाव। पर्याप्त नमी बनाए रखें।",
      highHumidity: "उच्च नमी",
      highHumidityAdvice: "फंगल रोगों का खतरा। पत्तियों की निगरानी करें।",
      goodConditions: "अनुकूल कृषि स्थिति",
      goodConditionsAdvice: "परिस्थितियाँ कृषि कार्यों के लिए उपयुक्त हैं।",
      unableToLoad: "डेटा लोड नहीं हो सका।",
    },
  };

  const t = translations[language] || translations.English;

  const getWeatherDescription = (code) => {
    if (code === 0) return { icon: "☀️", text: t.clearSky };
    if (code === 1) return { icon: "🌤️", text: t.mainlyClear };
    if (code === 2) return { icon: "⛅", text: t.partlyCloudy };
    if (code === 3) return { icon: "☁️", text: t.overcast };
    if (code === 45 || code === 48) return { icon: "🌫️", text: t.foggy };
    if (code >= 51 && code <= 57) return { icon: "🌦️", text: t.drizzle };
    if (code >= 61 && code <= 67) return { icon: "🌧️", text: t.rainWeather };
    if (code >= 71 && code <= 77) return { icon: "🌨️", text: t.snow };
    if (code >= 80 && code <= 82) return { icon: "🌦️", text: t.rainShowers };
    if (code >= 95) return { icon: "⛈️", text: t.thunderstorm };
    return { icon: "🌤️", text: t.unknownConditions };
  };

  const getFarmingAdvice = (temperature, humidity, weatherCode) => {
    if (weatherCode >= 95) {
      return { icon: "⚠️", title: t.avoidFieldWork, message: t.thunderstormAdvice };
    }
    if (weatherCode >= 61 && weatherCode <= 82) {
      return { icon: "🌧️", title: t.rainyConditions, message: t.rainAdvice };
    }
    if (temperature >= 35) {
      return { icon: "☀️", title: t.highTemperature, message: t.highTemperatureAdvice };
    }
    if (humidity >= 80) {
      return { icon: "💧", title: t.highHumidity, message: t.highHumidityAdvice };
    }
    return { icon: "🌱", title: t.goodConditions, message: t.goodConditionsAdvice };
  };

  const getUserLocation = () => {
    return user?.district || user?.region || user?.state || "Hyderabad";
  };

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");

        const userLoc = getUserLocation();
        setLocation(userLoc);

        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            userLoc
          )}&count=1&language=en&format=json`
        );
        const geoData = await geoResponse.json();

        let latitude = 17.385;
        let longitude = 78.4867;
        let displayName = userLoc;

        if (geoData.results && geoData.results.length > 0) {
          latitude = geoData.results[0].latitude;
          longitude = geoData.results[0].longitude;
          displayName = `${geoData.results[0].name}, ${geoData.results[0].admin1 || ""}`;
        }

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        if (!cancelled) {
          setLocation(displayName);
          setWeather(weatherData);
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
        if (!cancelled) setError(t.unableToLoad);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const currentWeatherDesc = weather
    ? getWeatherDescription(weather.current?.weather_code)
    : null;

  const advisory = weather
    ? getFarmingAdvice(
        weather.current?.temperature_2m,
        weather.current?.relative_humidity_2m,
        weather.current?.weather_code
      )
    : null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">☁️</span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
              {t.farmWeather}
            </h1>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {t.weatherConditions} <span className="font-semibold text-emerald-700 dark:text-emerald-400">{location}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            ● Live Telemetry
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-neutral-400">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 dark:border-neutral-700 dark:border-t-emerald-400" />
          <p className="mt-3">{t.loadingWeather}</p>
        </div>
      ) : error ? (
        <div className="notion-callout text-xs text-red-600 border border-red-200 bg-red-50 dark:bg-red-950/30">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Main Metric Banner */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {location}
                </span>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                    {Math.round(weather.current?.temperature_2m)}°
                  </span>
                  <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                    {currentWeatherDesc?.text}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {t.feelsLike} {Math.round(weather.current?.apparent_temperature)}° • H: {Math.round(weather.daily?.temperature_2m_max?.[0])}° L: {Math.round(weather.daily?.temperature_2m_min?.[0])}°
                </p>
              </div>

              {/* Telemetry Widgets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-800/80 pt-4 md:pt-0 md:pl-6">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                  <p className="text-[10px] uppercase font-semibold text-emerald-800 dark:text-emerald-400">{t.humidity}</p>
                  <p className="mt-1 text-base font-bold text-neutral-900 dark:text-white">
                    {weather.current?.relative_humidity_2m}%
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                  <p className="text-[10px] uppercase font-semibold text-emerald-800 dark:text-emerald-400">{t.windSpeed}</p>
                  <p className="mt-1 text-base font-bold text-neutral-900 dark:text-white">
                    {Math.round(weather.current?.wind_speed_10m)} km/h
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30 col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase font-semibold text-emerald-800 dark:text-emerald-400">{t.rain}</p>
                  <p className="mt-1 text-base font-bold text-neutral-900 dark:text-white">
                    {weather.daily?.precipitation_probability_max?.[0] || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agronomic Advisory Box */}
          {advisory && (
            <section className="notion-callout">
              <span className="text-base shrink-0">{advisory.icon}</span>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  {advisory.title}
                </h4>
                <p className="mt-0.5 text-xs text-emerald-800/90 dark:text-emerald-400/90">
                  {advisory.message}
                </p>
              </div>
            </section>
          )}

          {/* 5-Day Forecast Table */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {t.fiveDayForecast}
              </h3>
            </div>

            <div className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {weather.daily?.time?.slice(0, 5).map((day, idx) => {
                const desc = getWeatherDescription(weather.daily.weather_code[idx]);
                const dateObj = new Date(day);
                const dayLabel = idx === 0 ? t.today : dateObj.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

                return (
                  <div key={day} className="flex items-center justify-between py-3">
                    <div className="w-28 text-xs font-semibold text-neutral-900 dark:text-white">
                      {dayLabel}
                    </div>

                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-4">
                      <span className="text-base">{desc.icon}</span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{desc.text}</span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        💧 {weather.daily.precipitation_probability_max[idx] || 0}%
                      </span>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white w-20">
                        <span>{Math.round(weather.daily.temperature_2m_max[idx])}°</span>
                        <span className="text-neutral-400 font-normal ml-1.5">{Math.round(weather.daily.temperature_2m_min[idx])}°</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sun & Moon Schedule */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <span>🌅</span>
                <p className="text-[11px] font-medium text-neutral-400">{t.todaysSunrise}</p>
              </div>
              <p className="mt-2 text-sm font-bold text-neutral-900 dark:text-white">
                {weather.daily?.sunrise?.[0] ? new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <span>🌇</span>
                <p className="text-[11px] font-medium text-neutral-400">{t.todaysSunset}</p>
              </div>
              <p className="mt-2 text-sm font-bold text-neutral-900 dark:text-white">
                {weather.daily?.sunset?.[0] ? new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
              </p>
            </div>
          </div>

          <p className="text-center text-[10px] text-neutral-400 pt-2">
            {t.weatherProvided} {t.farmingDisclaimer}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default Weather;