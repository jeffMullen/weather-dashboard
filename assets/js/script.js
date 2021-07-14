var apiKey = '728241f4cb6c09bff9fdad1691ce482a';
var searchBtn = $('#search-btn');
var searchInput = $('#search-input');
var currentForecast = $('#current-forecast');
var futureForecast = $('#future-forecast');
var weatherCardRow = $('weather-card-row');
var cardOne = $('#card-1');
var cardTwo = $('#card-2');
var cardThree = $('#card-3');
var cardFour = $('#card-4');
var cardFive = $('#card-5');
var searchHistoryEl = $('#search-history');
var storageArr = [];

// || Parameters for fetch requests
var lat;
var lon;
var cityName;

// || Load search history buttons function
function loadSearchHistory() {
    if (localStorage.getItem('city') === null) {

    } else {
        storageArr = storageArr.concat(JSON.parse(localStorage.getItem('city')));
        for (var i = 0; i < storageArr.length; i++) {
            var searchedCity = $('<div>');
            var cityBtn = $('<button>');
            cityBtn.addClass('btn btn-secondary btn-lg btn-block');
            cityBtn.text(storageArr[i]);
            searchedCity.attr('style', 'margin-bottom: 15px;')
            searchedCity.append(cityBtn);
            searchHistoryEl.append(searchedCity);
        }
    }
}
loadSearchHistory();

// || Checking if input is valid
function getWeather() {
    if (searchInput.val() === '') {
        return;
    } else {
        cityName = searchInput.val();

        fetchWeather();
    }
}

// || Fetch request for Open Weather API
function fetchWeather() {
    // || If button is clicked after 404, clear search bar
    searchInput.attr('placeholder', '');

    // || API fetch for city latitude and longitude
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {
                // || Message displaying that city is invalid
                searchInput.val('');
                searchInput.attr('placeholder', 'Invalid City');
                return;
            } else {
                // || Clear all previously displayed weather data
                currentForecast.attr('style', 'display: none');
                currentForecast.empty();
                futureForecast.attr('style', 'display: none');
                cardOne.empty();
                cardTwo.empty();
                cardThree.empty();
                cardFour.empty();
                cardFive.empty();

                saveCity();
                return response.json();
            }
        })
        .then(function (data) {
            lat = data.coord.lat;
            lon = data.coord.lon;

            // || Add heading to weather display
            var cityChosen = $('<h2>');
            cityChosen.text(data.name);
            var currentDate = moment.unix(data.dt).format('MM/DD/YYYY');
            currentForecast.append(cityChosen);
            cityChosen.append(` (${currentDate})`);

            // || Fetch for open weather map one call API
            var requestOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
            fetch(requestOneCall)
                .then(function (response) {

                    return response.json();
                })
                .then(function (data) {
                    // || Today's Data
                    // || Display weather icon according to current conditions
                    var weatherIcon = data.current.weather[0].icon;
                    var iconImage = $('<img>');
                    iconImage.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                    iconImage.attr('alt', data.current.weather[0].description);
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
                        weatherCard = $(`#card-${cardId}`);

                        // || Add date to card
                        var futureDate = moment.unix(data.daily[i].dt).format('MM/DD/YYYY');
                        var fiveDayDate = $('<h3>');
                        fiveDayDate.text(`${futureDate}`);
                        weatherCard.append(fiveDayDate);

                        // || Adding weather icon to each card
                        var futureIcon = $('<img>');
                        var futureWeatherIcon = data.daily[i].weather[0].icon;
                        futureIcon.attr('src', `http://openweathermap.org/img/wn/${futureWeatherIcon}@2x.png`);
                        futureIcon.attr('alt', data.daily[i].weather[0].description);
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

                        // || Add 5 day forecast to section
                        weatherCardRow.append(weatherCard);
                        cardId++;
                    }
                    // || Show forecast
                    futureForecast.attr('style', 'display: block');

                    // || Clear search field
                    searchInput.val('');
                })
        })
}


// || Adds searched city to previously searched section
function saveCity() {
    // || Capitalizing the input
    var capitalize = cityName.split(' ');
    for (var i = 0; i < capitalize.length; i++) {

        var capitalizeLetter = capitalize[i].charAt(capitalize[i][0]).toUpperCase();
        capitalize[i] = capitalize[i].replace(capitalize[i][0], capitalizeLetter);
    }
    capitalize = capitalize.join(' ');
    cityName = capitalize;

    // || Checking if city is in local storage
    var nameCheck;
    for (var i = 0; i < storageArr.length; i++) {
        if (cityName === storageArr[i]) {
            nameCheck = true;
            break;
        }
    }
    // || Creating button for searched city if not already in local storage
    if (!nameCheck) {
        var searchedCity = $('<div>');
        var cityBtn = $('<button>');
        cityBtn.addClass('btn btn-secondary btn-lg btn-block');
        cityBtn.text(cityName);
        searchedCity.attr('style', 'margin-bottom: 15px;')
        searchedCity.append(cityBtn);
        searchHistoryEl.append(searchedCity);
        console.log(storageArr);


        storageArr = storageArr.concat(`${cityName}`);

        localStorage.setItem('city', JSON.stringify(storageArr));
        console.log(storageArr);
    }
}

// || Event handler on search button
searchBtn.on('click', function () {
    getWeather();
});

// || Event handler on search history buttons
searchHistoryEl.on('click', 'button', function () {
    // || Getting city name from button
    cityName = $(this).text();
    fetchWeather();
});