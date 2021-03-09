var searchEl = document.querySelector('#user-form')
var searchedCity = document.querySelector('.form-input')
var searchBtn = document.querySelector('.search-btn')
var currentWeatherEl = document.querySelector('#current');
var forecastWeatherEl = document.querySelector('#forecast')

function printCurrentWeather(resultObj) {
    console.log(resultObj.name)
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    var titleEl = document.createElement('h3');
    titleEl.textContent=resultObj.name

    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML = '<strong>Temperature:</strong> ' + resultObj.main.temp + ' °C' + '<br/>';
    bodyContentEl.innerHTML += '<strong>Humidity:</strong> ' + resultObj.main.humidity + "%"+ '<br/>';
    bodyContentEl.innerHTML += '<strong>Wind:</strong> ' + resultObj.wind.speed + " MPH"+ '<br/>';
    
    resultBody.append(titleEl, bodyContentEl);

    currentWeatherEl.append(resultCard);
}

function getAPI(cityID) {
    var key = 'dd6c6dc7ead19d604aeaf2d9ada1f731';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityID+ '&units=metric&appid=' + key)
    .then(function(response){return response.json()}) //convert data to json
    .then(function(data) {
        console.log(data)
        printCurrentWeather(data)
    })

    .catch(function(){}) //catch any errors
}


function handleSearchFormSubmit(event) {
    event.preventDefault();
    var city = searchedCity.value;

    getAPI(city);
}

searchEl.addEventListener('submit', handleSearchFormSubmit);

