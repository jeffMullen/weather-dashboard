
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// 1. city name - check
// 2. date
// 3. icon representing weather conditions
// 4. temperature - sort of
// 5. humidity - check
// 6. wind speed
// 7. UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var apiKey = '728241f4cb6c09bff9fdad1691ce482a';
var searchBtn = $('#search-btn');
var searchInput = $('#search-input');



var searchHistoryEl = $('#search-history');

// || Fetch request for Open Weather API
function handleFormSubmit() {
    console.log(searchInput.val());
    console.log('hit');
    var cityName = searchInput.val();

    // API fetch for city latitude and longitude
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // for (var i = 0; i < data.length; i++) {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            console.log(lat);
            console.log(lon);

            var requestOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
            fetch(requestOneCall)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                })
            // console.log(data.name);
            // console.log(data.main.temp);
            // console.log(data.main.humidity);
            // console.log(data.wind.speed);
            // console.log(data.)
            // }
        })


    saveCity();
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