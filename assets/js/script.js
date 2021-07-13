
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// 1. city name - check
// 2. date - check
// 3. icon representing weather conditions - check
// 4. temperature - check
// 5. humidity - check
// 6. wind speed - check
// 7. UV index - check

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// 1. date - check
// 2. icon of weather - check
// 3. temp - check
// 4. wind speed - check
// 5. humidity - check

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var apiKey = '728241f4cb6c09bff9fdad1691ce482a';
var searchBtn = $('#search-btn');
var searchInput = $('#search-input');
var currentForecast = $('#current-forecast');
var futureForecast = $('#future-forecast');

var lat;
var lon;

var searchHistoryEl = $('#search-history');

// || Fetch request for Open Weather API
function handleFormSubmit() {
    console.log(searchInput.val());
    console.log('hit');
    var cityName = searchInput.val();
    saveCity();

    // || API fetch for city latitude and longitude
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            lat = data.coord.lat;
            lon = data.coord.lon;

            var cityChosen = $('<h2>');
            cityChosen.text(data.name);
            var currentDate = moment.unix(data.dt).format('MM/DD/YYYY');
            currentForecast.append(cityChosen);
            cityChosen.append(` (${currentDate})`);

            // || Fetch for open weather map one call API
            var requestOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
            fetch(requestOneCall)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    // || Today's Data
                    // || Display weather icon according to current conditions
                    var weatherIcon = data.current.weather[0].icon;
                    var iconImage = $('<img>');
                    iconImage.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                    iconImage.attr('alt', data.current.weather[0].main);
                    cityChosen.append(iconImage);

                    // || Display current temperature
                    var currentTemp = $('<p>');
                    currentTemp.text(`Temp: ${data.current.temp}°F`)
                    currentForecast.append(currentTemp);

                    // || Display current wind speed
                    var currentWindSpeed = $('<p>');
                    currentWindSpeed.text(`Wind: ${data.current.wind_speed} MPH`);
                    currentForecast.append(currentWindSpeed);

                    // || Display current humidity
                    var currentHumidity = $('<p>');
                    currentHumidity.text(`Humidity: ${data.current.humidity} %`);
                    currentForecast.append(currentHumidity);

                    // || Display current UV Index
                    var currentUvIndex = $('<p>');
                    var uvIndexText = $('<button>');

                    // || color added to background of UV index text
                    uvIndexText.attr('style', 'display: inline');
                    uvIndexText.addClass('index-color');
                    uvIndexText.text(data.current.uvi);

                    currentUvIndex.text(`UV Index: `);
                    currentUvIndex.append(uvIndexText);

                    if (uvIndexText.text() < '3') {
                        uvIndexText.attr('style', 'background: green');
                    } else if (uvIndexText.text() >= '3' && uvIndexText.text() < '6') {
                        uvIndexText.attr('style', 'background: orange');
                    } else {
                        uvIndexText.attr('style', 'background: red');
                    }
                    currentForecast.append(currentUvIndex);
                    currentForecast.attr('style', 'display: block');

                    // || Display 5 day forecast
                    var cardId = 1;
                    for (var i = 1; i < 6; i++) {
                        // || Create card
                        var weatherCardRow = $('weather-card-row');

                        var weatherCard = $(`#card-${cardId}`);
                        // weatherCard.addClass('card col-2');

                        // || Add date to card
                        var futureDate = moment.unix(data.daily[i].dt).format('MM/DD/YYYY');
                        var fiveDayDate = $('<h3>');
                        fiveDayDate.text(`(${futureDate})`);
                        // weatherCardRow.append(weatherCard);
                        weatherCard.append(fiveDayDate);

                        // || Adding weather icon to each card
                        var futureIcon = $('<img>');
                        var futureWeatherIcon = data.daily[i].weather[0].icon;
                        futureIcon.attr('src', `http://openweathermap.org/img/wn/${futureWeatherIcon}@2x.png`);
                        futureIcon.attr('alt', data.daily[i].weather[0].main);
                        weatherCard.append(futureIcon);

                        // || Adding Temperature
                        var futureTemp = $('<p>');
                        futureTemp.text(`Temp: ${data.daily[i].temp.day}°F`)
                        weatherCard.append(futureTemp);

                        // || Wind speed
                        var futureWindSpeed = $('<p>');
                        futureWindSpeed.text(`Wind: ${data.daily[i].wind_speed} MPH`);
                        weatherCard.append(futureWindSpeed);

                        // || Humidity
                        var futureHumidity = $('<p>');
                        futureHumidity.text(`Humidity: ${data.daily[i].humidity} %`);
                        weatherCard.append(futureHumidity);


                        futureForecast.append(weatherCard);
                        cardId++;
                        console.log(weatherCard.attr('id'));
                    }
                    futureForecast.attr('style', 'display: block');
                })
        })

}

// || Adds searched city to previously searched section
function saveCity() {
    var query = searchInput.val();
    console.log(typeof query);
    console.log(query.length);

    // || Checks if input field is empty or populated
    if (query.length === 0) {

    } else {
        var searchedCity = $('<div>');
        var cityBtn = $('<button>');
        cityBtn.addClass('btn btn-secondary btn-lg btn-block');
        cityBtn.text(searchInput.val());
        searchedCity.attr('style', 'margin-bottom: 15px;')
        searchedCity.append(cityBtn);
        searchHistoryEl.append(searchedCity);
        localStorage.setItem('city', searchInput.val());
    }

}

// || Event handler on button
searchBtn.on('click', handleFormSubmit);