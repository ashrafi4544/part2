import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (query) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filtered = response.data.filter(country =>
            country.name.common.toLowerCase().includes(query.toLowerCase())
          );
          setCountries(filtered);
          if (filtered.length === 1) {
            setSelectedCountry(filtered[0]);
          } else {
            setSelectedCountry(null);
          }
        })
        .catch(() => setCountries([]));
    } else {
      setCountries([]);
      setSelectedCountry(null);
    }
  }, [query]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.capital && selectedCountry.capital.length > 0) {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const capital = selectedCountry.capital[0];
      const countryCode = selectedCountry.cca2;
      console.log("Fetching weather for:", capital + "," + countryCode, "with API Key:", apiKey);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital},${countryCode}&appid=${apiKey}&units=metric`;
      axios
        .get(url)
        .then(response => setWeather(response.data))
        .catch(error => {
          console.error("Weather fetch error:", error.response?.data || error.message);
          if (error.response) {
            setWeather({ error: `Error: ${error.response.data.message}` });
          } else {
            setWeather({ error: "Failed to fetch weather data." });
          }
        });
    } else if (selectedCountry) {
      setWeather({ error: "Capital not found for this country." });
    }
  }, [selectedCountry]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setSelectedCountry(null);
    setWeather(null); // ریست کردن وضعیت هواشناسی
  };

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  };

  const renderContent = () => {
    if (countries.length > 10) {
      return <p>Too many matches, please make your query more specific.</p>;
    } else if (countries.length > 1 && !selectedCountry) {
      return (
        <ul>
          {countries.map(country => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleShowCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      );
    } else if (selectedCountry || countries.length === 1) {
      const country = selectedCountry || countries[0];
      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital {country.capital[0]}</p>
          <p>Area {country.area}</p>
          <h3>Languages</h3>
          <ul>
            {Object.values(country.languages).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
          {weather ? (
            weather.error ? (
              <p>{weather.error}</p>
            ) : (
              <div>
                <h3>Weather in {country.capital[0]}</h3>
                <p>Temperature {weather.main.temp} Celsius</p>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather icon"
                  />
                <p>Wind {weather.wind.speed} m/s</p>
              </div>
            )
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      );
    } else {
      return <p>No matches found.</p>;
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleQueryChange}
        placeholder="Search for a country"
      />
      {renderContent()}
    </div>
  );
};

export default App; 