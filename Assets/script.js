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

    //Add click event to city history
    cityList.addEventListener('click', function(event){     
        console.log(event)
        var element = event.target;

        //check if element is an li
        if(element.matches('li') === true) {
            console.log(element.innerHTML)
            var historyCity = element.innerHTML
            //How do I run the historyCity variable through the weather API?
            getAPI(historyCity)
        }
    })

}

//The init function will run when the page loads
function init() {
    //Get stored city names from localStorage
    var storedCities = JSON.parse(localStorage.getItem('cityHistory'))

    //If cities were retrieved from localStorage, update the todos array 
    if(storedCities !== null) {
        cityHistory = storedCities
    }

    renderCityHistory();
}

function storeCities() {
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
}

searchEl.addEventListener('submit', function(event){
    event.preventDefault();
    var city = searchedCity.value;

    getAPI(city);

    //Add new city to history array, clear the input
    cityHistory.push(city);
    searchedCity.value = "";

    //Reverse the order of the array so it displays most recent searched at the top
    // cityHistory.reverse();

    //If there are already 5 cities show in the history, remove the first in the array and shift everything one spot
    if(cityHistory.length > 5) {
        cityHistory.shift();
    }

    //Story updated search in localStorage, re-render the list
    storeCities();
    renderCityHistory();

});

function printCurrentWeather(resultObj) {
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    var titleEl = document.createElement('h3');
    titleEl.textContent=searchedCity.value;

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

function printForecastWeather(resultObj) {
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody)

    var titleEl = document.createElement('h4');
    var day = moment.unix(resultObj.daily[1].dt);
    titleEl.textContent = day.format("M/D/YYYY")

    var iconEl = document.createElement('img');
    iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + resultObj.daily[1].weather[0].icon + ".png")

    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML = '<strong>Temperature:</strong> ' + resultObj.daily[1].temp.day + ' °C' + '<br/>';
    bodyContentEl.innerHTML += '<strong>Humidity:</strong> ' + resultObj.daily[1].humidity + "%"+ '<br/>';

    resultBody.append(titleEl, iconEl, bodyContentEl);

    forecastWeatherEl.append(resultCard)

    console.log(resultObj.daily.length)
}

function getAPI(cityID) {
    var key = 'dd6c6dc7ead19d604aeaf2d9ada1f731';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityID+ '&units=metric&appid=' + key)
    .then(function(response){return response.json()}) //convert data to json
    .then(function(data) {
        console.log(data)
        getWeatherAPI(data.coord.lat, data.coord.lon)
    })

    .catch(function(){}) //catch any errors
}

function getWeatherAPI(lat, lon) {
    var key = 'dd6c6dc7ead19d604aeaf2d9ada1f731';
    fetch('http://api.openweathermap.org/data/2.5/onecall?lat='+ lat + '&lon=' + lon + '&units=metric&exclude=minutely,hourly,alerts&appid=' + key)
    .then(function(response){return response.json()})
    .then(function(data){
        console.log(data)
        currentWeatherEl.textContent = '';
        printCurrentWeather(data)
        printForecastWeather(data)
    })

    .catch(function(){}) //catch any errors
}



//Call init to retrieve data and render it to the page on load
init();




//Things to do
//1) Add the list so it is in reverse order
//2) Change the hover over pointer to just the text, not the entire link element
//3) Add the city to the title element (2 steps - (1) if you click on a li element, update the title to the inner HTML of that li and if you search an elemenet, make the title the 0th array element)
//4) run the 5-day forecast API (use the moment library?)



