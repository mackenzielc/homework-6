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
    console.log(resultObj.name)
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    var titleEl = document.createElement('h3');
    titleEl.textContent=resultObj.name

    var iconEl = document.createElement('img');
    iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + resultObj.weather[0].icon + ".png")

    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML = '<strong>Temperature:</strong> ' + resultObj.main.temp + ' °C' + '<br/>';
    bodyContentEl.innerHTML += '<strong>Humidity:</strong> ' + resultObj.main.humidity + "%"+ '<br/>';
    bodyContentEl.innerHTML += '<strong>Wind:</strong> ' + resultObj.wind.speed + " MPH"+ '<br/>';
    
    

    resultBody.append(titleEl, iconEl, bodyContentEl);

    currentWeatherEl.append(resultCard);
}

function getAPI(cityID) {
    var key = 'dd6c6dc7ead19d604aeaf2d9ada1f731';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityID+ '&units=metric&appid=' + key)
    .then(function(response){return response.json()}) //convert data to json
    .then(function(data) {
        console.log(data)
        currentWeatherEl.textContent = '';
        printCurrentWeather(data)
        getUVAPI(data.coord.lat, data.coord.lon)
    })

    .catch(function(){}) //catch any errors
}

function getUVAPI(lat, lon) {
    var key = 'dd6c6dc7ead19d604aeaf2d9ada1f731';
    fetch('http://api.openweathermap.org/data/2.5/uvi?lat='+ lat + '&lon=' + lon + '&appid=' + key)
    .then(function(response){return response.json()})
    .then(function(data){
        console.log(data)
        var uvText = document.createElement('p')
        var uvEl = document.createElement('span');
        uvIndex = uvEl.textContent = data.value
        uvText.innerHTML = "<strong>UV index:</strong> "
        uvText.append(uvEl)
        currentWeatherEl.append(uvText)

        if (uvIndex < 3) {
            uvEl.classList.add('green-uv')
        } else if (uvIndex >= 3 && uvIndex < 8) {
            uvEl.classList.add('warning-uv')
        } else {
            uvEl.classList.add('danger-uv')
        }
    })

}


//Call init to retrieve data and render it to the page on load
init();




//Things to do
//1) Add the list so it is in reverse order
//2) Change the hover over pointer to just the text, not the entire link element
//3) figure out how to put the UV API into the card element 
//4) run the 5-day forecast API (use the moment library?)