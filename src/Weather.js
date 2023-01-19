import "./Weather.css";
const Weather = ({ data, image }) => {
  if (!data) return null;
  const [locationData, weatherData] = data;
  const { name, country } = locationData;
  const { weather, dt, main } = weatherData;
  const { main: mainWeather, description, icon } = weather?.[0];
  const { temp_min, temp_max, humidity } = main;
  const date = new Date(dt * 1000);
  return (
    <div className="weatherContainer">
      <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt='weather_image' />
      
      <div>
        <div>
          <div className="weatherLabel">{mainWeather}</div>
          <div className="smallLabel">Description: {description}</div>
          <div className="smallLabel">
            Temperature: {Math.round((temp_min - 273) * 10) / 10}°C~
            {Math.round((temp_max - 273) * 10) / 10}°C
          </div>
          <div className="smallLabel">Humidity: {humidity}%</div>
        </div>
        <div className="smallLabel">
          {name}, {country}
          <div className="smallLabel">Time: {date.toLocaleString()}</div>
        </div>
      </div>
      {image && <img src={image} alt='location_image' className="locationImage"/>}
    </div>
  );
};

export default Weather;
