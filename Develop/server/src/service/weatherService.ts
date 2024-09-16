import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lng: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvi: number;
  weather: string;
  constructor(temp: number, feelsLike: number, humidity: number, windSpeed: number, uvi: number, weather: string) {
    this.temp = temp;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.uvi = uvi;
    this.weather = weather;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}`;
    this.apiKey = "4d464bdc697ea98e92047163bcea4b5c";
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching location data: ', error);
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lng } = locationData.results[0].geometry.location;
    return { lat, lng };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geocode/json?address=${this.cityName}&key=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}onecall?lat=${coordinates.lat}&lon=${coordinates.lng}&exclude=minutely,hourly&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const weatherData = await this.fetchLocationData(query);
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const currentWeather = response.current;
    return {
      temp: currentWeather.temp,
      feelsLike: currentWeather.feels_like,
      humidity: currentWeather.humidity,
      windSpeed: currentWeather.wind_speed,
      uvi: currentWeather.uvi,
      weather: currentWeather.weather,
    };
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    const forecast = weatherData.daily.map((day: any) => {
      return {
        temp: day.temp.day,
        feelsLike: day.feels_like.day,
        humidity: day.humidity,
        windSpeed: day.wind_speed,
        uvi: day.uvi,
        weather: day.weather[0].description,
      };
    });

    // Add current weather to the forecast array
    forecast.unshift({
      temp: currentWeather.temp,
      feelsLike: currentWeather.feelsLike,
      humidity: currentWeather.humidity,
      windSpeed: currentWeather.windSpeed,
      uvi: currentWeather.uvi,
      weather: currentWeather.weather,
    });

    return forecast;
}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData);
    return { currentWeather, forecast };
  }
}

export default new WeatherService();
