import search from "./assets/search.svg";
import deleteIcon from "./assets/delete.svg";
import LoadingSpinner from "./LoadingSpinner";
import { useState, useEffect } from "react";
import Weather from "./Weather";
import "./App.css";

function App() {
  const appId = "7c06dab21118ad5fa9b7626b404c150b";
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cityValue, setCityValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem("weatherHistory"))
  );

  useEffect(() => {
    if (!errorMsg) {
      setTimeout(() => {
        setErrorMsg("");
      }, 6000);
    }
  }, [errorMsg]);

  const weatherSearch = async (locationMsg) => {
    const locationString =
      locationMsg || [cityValue, countryValue].filter(Boolean).join(", ");
    setIsLoading(true);
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${locationString}&limit=1&appid=${appId}`
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Api Error");
        }
        return res.json();
      })
      .catch((err) => console.log("error", err));
    if (response?.length >= 1) {
      const { lat, lon } = response?.[0];
      const urls = [
        {
          url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7c06dab21118ad5fa9b7626b404c150b`,
        },
        {
          url: `https://api.pexels.com/v1/search?query=${locationString}&per_page=1&size=small&per_page=1&orientation=portrait`,
          headers: {
            Authorization:
              "n74gE8TYfoOjSg7nqb8oXWaEbCnIEzTjKhwh77OtRodjKlJLyLRicvD7",
          },
        },
      ];

      Promise.all(
        urls.map((item) =>
          fetch(item.url, { headers: item.headers }).then((res) => {
            if (res.status !== 200) {
              throw new Error("Weather Api Error");
            }
            return res.json();
          })
        )
      )
        .then((data) => {
          const [weatherResponse, locationImg] = data;
          setWeatherData([response[0], weatherResponse]);
          const storageData =
            JSON.parse(localStorage.getItem("weatherHistory")) || [];
          const newData = {
            name: response[0]?.name,
            country: response[0]?.country,
            time: new Date().toLocaleString(),
            locationString,
          };
          storageData.unshift(newData);
          localStorage.setItem("weatherHistory", JSON.stringify(storageData));
          setSearchHistory(storageData);
          setImageUrl(locationImg?.photos?.[0]?.src?.tiny);
          setErrorMsg(null);
        })
        .catch((err) => {
          setWeatherData(null);
          setErrorMsg("Data Retrieve Fail, Please try again later");
        });
      // const weatherResponse = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7c06dab21118ad5fa9b7626b404c150b`
      // )
      //   .then((res) => {
      //     if (res.status !== 200) {
      //       throw new Error("Weather Api Error");
      //     }
      //     return res.json();
      //   })
      //   .catch((err) => console.log("error", err));
      // const imageResponse = await fetch(
      //   `https://api.pexels.com/v1/search?query=${
      //     locationMsg
      //   }&per_page=1&size=small&per_page=1&orientation=portrait`,
      //   {
      //     headers: {
      //       Authorization:
      //         "n74gE8TYfoOjSg7nqb8oXWaEbCnIEzTjKhwh77OtRodjKlJLyLRicvD7",
      //     },
      //   }
      // );
      // console.log("imageResponse", imageResponse);
      // setWeatherData([response[0], weatherResponse]);
      // const storageData =
      //   JSON.parse(localStorage.getItem("weatherHistory")) || [];
      // const newData = {
      //   name: response[0]?.name,
      //   country: response[0]?.country,
      //   time: new Date().toLocaleString(),
      //   locationString,
      // };
      // storageData.unshift(newData);
      // localStorage.setItem("weatherHistory", JSON.stringify(storageData));
      // setSearchHistory(storageData);
    } else {
      setWeatherData(null);
      setErrorMsg("Invalid Location");
    }
    setIsLoading(false);
  };

  const removeHistory = (index) => {
    const array = searchHistory;
    array.shift(index);
    localStorage.setItem("weatherHistory", JSON.stringify(array));
    setSearchHistory([...array]);
  };

  const renderSearchHistory = () => {
    if (!searchHistory) return null;
    return (
      <div>
        {searchHistory.map((item, index) => (
          <div className="searchItem" key={`SearchItem_${index}`}>
            <div>
              {index + 1}. {item.name}, {item.country}
            </div>
            <div className="searchItemRightSection">
              <div>{item?.time}</div>
              <img
                src={search}
                className="imageButton"
                onClick={() => weatherSearch(item.locationString)}
                alt="searchButton"
              />
              <img
                src={deleteIcon}
                className="imageButton"
                onClick={() => removeHistory(index)}
                alt="deleteButton"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="Weather-header borderLine">
        <h2>Today's Weather</h2>
      </header>
      <div className="locationContainer">
        <div>
          City:{" "}
          <input
            type="text"
            id="city"
            name="city"
            value={cityValue}
            onChange={(e) => setCityValue(e.target.value)}
          />
        </div>

        <div>
          Country:{" "}
          <input
            type="text"
            id="country"
            name="country"
            value={countryValue}
            onChange={(e) => setCountryValue(e.target.value)}
          />
        </div>
      </div>
      <div >
        <button
          onClick={() => weatherSearch()}
          disabled={cityValue === "" && countryValue === ""}
          className="buttonMargin"
        >
          Search
        </button>
        <button
          onClick={() => {
            setCountryValue("");
            setCityValue("");
          }}
        >
          Clear
        </button>
      </div>

      {errorMsg && <div className="errorContainer">{errorMsg}</div>}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Weather data={weatherData} image={imageUrl} />
      )}

      <div className="borderLine">
        <h3>Search History</h3>
      </div>
      {renderSearchHistory()}
    </div>
  );
}

export default App;
