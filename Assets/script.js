var searchEl = document.querySelector('#user-form')
var searchedCity = document.querySelector('.form-input')
var searchBtn = document.querySelector('.search-btn')
var currentWeatherEl = document.querySelector('#current');
var forecastWeatherEl = document.querySelector('#forecast')
var cityList = document.querySelector('.list-group')

var cityHistory = [];

//Render items in the city search list as <li> elements
function renderCityHistory() {
    //Clear city list element
    cityList.innerHTML = "";

    //Render a new li for each city
    for (var i = 0; i < cityHistory.length; i++) {
        var cityHistorySearch = cityHistory[i];

        var li = document.createElement('li');
        li.classList.add('custom-li')
        li.textContent = cityHistorySearch;
        li.setAttribute('data-index', i);
        cityList.appendChild(li);   
    }

    //Add click event to city li elements in the history list
    cityList.addEventListener('click', function(event){     
        console.log(event)
        var element = event.target;

        //check if element is an li
        if(element.matches('li') === true) {
            console.log(element.innerHTML)
            var historyCity = element.innerHTML
            //Run the API function with the city that was selected
            getAPI(historyCity)
        }
    })

}

//The init function will run when the page loads
function init() {
    //Get stored city names from localStorage
    var storedCities = JSON.parse(localStorage.getItem('cityHistory'))

    //If cities were retrieved from localStorage, update the city history array 
    if(storedCities !== null) {
        cityHistory = storedCities
    }

    renderCityHistory();
}

//Store the cities in local storage
function storeCities() {
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
}

//Add an evenet listener to the search form
searchEl.addEventListener('submit', function(event){
    console.log(event)
    event.preventDefault();
    var city = searchedCity.value;

    getAPI(city);

    //Add new city to history array, clear the input
    cityHistory.push(city);
    searchedCity.value = "";

    //If there are already 10 cities, remove the first in the array and shift everything one spot
    if(cityHistory.length > 10) {
        cityHistory.shift();
    }

    //Store updated search in localStorage, re-render the list
    storeCities();
    renderCityHistory();

});

//Function to print the current weather
function printCurrentWeather(name, resultObj) {
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'm-3', 'p-3');

    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    var titleEl = document.createElement('h3');
    var day = moment.unix(resultObj.daily[0].dt);
    titleEl.textContent = name + ' (' + day.format("M/D/YYYY") + ')'
    
    console.log(name);

    var iconEl = document.createElement('img');
    iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + resultObj.current.weather[0].icon + ".png")

    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML = '<strong>Temperature:</strong> ' + resultObj.current.temp + ' °C' + '<br/>';
    bodyContentEl.innerHTML += '<strong>Humidity:</strong> ' + resultObj.current.humidity + "%"+ '<br/>';
    bodyContentEl.innerHTML += '<strong>Wind:</strong> ' + resultObj.current.wind_speed + " MPH"+ '<br/>';
    
    var uvText = document.createElement('p');
    var uvEl = document.createElement('span');
    var uvIndex = uvEl.textContent = resultObj.current.uvi
    uvText.innerHTML = "<strong>UV index:</strong> "
    uvText.append(uvEl)
    bodyContentEl.append(uvText)

    if (uvIndex < 3) {
        uvEl.classList.add('green-uv')
    } else if (uvIndex >= 3 && uvIndex < 8) {
        uvEl.classList.add('warning-uv')
    } else {
        uvEl.classList.add('danger-uv')
    }

    resultBody.append(titleEl, iconEl, bodyContentEl);

    currentWeatherEl.append(resultCard);
}

//Function to print the forecast weather
function printForecastWeather(resultObj) {
    //Run a for loop to create 5 cards
    for (var i = 1; i < 6; i++) {
        var resultCol = document.createElement('div');
        resultCol.classList.add('col-lg-2');

        var resultCard = document.createElement('div');
        resultCard.classList.add('card', 'bg-light', 'text-dark');
        resultCol.append(resultCard)

        var resultBody = document.createElement('div');
        resultBody.classList.add('card-body');
        resultCard.append(resultBody)

        var titleEl = document.createElement('h4');
        var day = moment.unix(resultObj.daily[i].dt);
        titleEl.textContent = day.format("M/D/YYYY")

        var iconEl = document.createElement('img');
        iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + resultObj.daily[i].weather[0].icon + ".png")

        var bodyContentEl = document.createElement('p');
        bodyContentEl.innerHTML = '<strong>Temperature:</strong> ' + resultObj.daily[i].temp.day + ' °C' + '<br/>';
        bodyContentEl.innerHTML += '<strong>Humidity:</strong> ' + resultObj.daily[i].humidity + "%"+ '<br/>';

        resultBody.append(titleEl, iconEl, bodyContentEl);

        forecastWeatherEl.append(resultCol)

    }
}

//Function to call the open weather API and get the city name, lat and long
function getAPI(cityID) {
    var key = 'dd6c6dc7ead19d604aeaf2d9ada1f731';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityID+ '&units=metric&appid=' + key)
    .then(function(response){return response.json()}) //convert data to json
    .then(function(data) {
        console.log(data)
        getWeatherAPI(data.name ,data.coord.lat, data.coord.lon)
    })

    .catch(function(){}) //catch any errors
}

//Function to call the open weather API
function getWeatherAPI(name, lat, lon) {
    var key = 'dd6c6dc7ead19d604aeaf2d9ada1f731';
    fetch('http://api.openweathermap.org/data/2.5/onecall?lat='+ lat + '&lon=' + lon + '&units=metric&exclude=minutely,hourly,alerts&appid=' + key)
    .then(function(response){return response.json()})
    .then(function(data){
        console.log(data)
        currentWeatherEl.textContent = '';
        forecastWeatherEl.textContent = '';
        printCurrentWeather(name, data)
        printForecastWeather(data)
    })

    .catch(function(){}) //catch any errors
}


//Call init to retrieve data and render it to the page on load
init();



