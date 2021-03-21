// Declare variables
var cityName = $('#cityInput');
var searchBtn = $('#searchBtn');
var currentInfoEl = $('#currentInfo');
var forecastEl = $('#forecastCards');
var searchHistoryEl = $('#searchHist');
var forecastTitleEl = $('.forecastTitle');
var searchHistory = [];
var uvRes;
var cityNameVal;

// Setting variable to equal the current date
var today = moment().format("M/D/YYYY");

// Get search history from local storage and show onscreen
if (localStorage.length !== 0) {
  var search = localStorage.getItem('search');
  searchHistory = search.split(',');

  for (var i = 0; i < searchHistory.length; i++) {
    var searchItem = searchHistory[i];

    var li = $("<li></li>").addClass('list-group-item').addClass(searchItem + 'Btn').text(searchItem);

    searchHistoryEl.append(li);
  }
}

// When list is clicked, get the city name of the list item clicked and run current weather function
searchHistoryEl.click(function(event) {
  event.preventDefault();

  console.log(event.target.textContent);

  cityNameVal = event.target.textContent;
  searchCurrent(event,cityNameVal);
})

// Current weather API
function searchCurrent(event) {
  event.preventDefault();

  // Catch nothing inputted
  if (!cityNameVal) {
    console.log('You need a search input value!');
    return;
  }

  // Create list item and save value to local storage
  var listItem = $('<li></li>').addClass('list-group-item').text(cityNameVal);
  searchHistoryEl.append(listItem);
  searchHistory.push(cityNameVal);

  localStorage.setItem('search',searchHistory);

  // Fetch from API for current weather
  var queryString = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNameVal + '&appid=b002df7a7fe0ceddfb7f66664951ce5a&units=imperial';
    
  fetch(queryString)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (weathRes) {

    // Run forecast with weather response
    searchForecast(weathRes);

    // Catch nonexistent cities - else show info on page
    if (weathRes === 0) {
      console.log('No results found!');
      currentInfoEl.innerHTML = '<h3>No results found, search again!</h3>';
    } else {
      
      // Remove existing info
      currentInfoEl.text('');
      // Create h1 for header
      var cityDate = $('<h1></h1>');
      cityDate.css("font-weight","600")

      // Create icon info
      var iconCode = weathRes.weather[0].icon;
      var iconEl = $('<img>');
      var iconurl = 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png';
      iconEl.attr('src',iconurl);

      // Add city, date, and image to title element
      cityDate.html(cityNameVal + ' (' + today + ') ');
      cityDate.append(iconEl);
      currentInfoEl.append(cityDate);
      currentInfoEl.addClass('border').addClass('p-3');

      // Create p tags for detailed info
      var tempCurrent = $('<p></p>');
      tempCurrent.text('Temperature: ' + weathRes.main.temp + ' °F').addClass('pt-3');
      var humidCurrent = $('<p></p>');
      humidCurrent.text('Humidity: ' + weathRes.main.humidity + '%');
      var windCurrent = $('<p></p>');
      windCurrent.text('Wind Speed: ' + weathRes.wind.speed + ' MPH');
      var uvCurrent = $('<p></p>');

      // Fetch UVI
      var uvQuery = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + weathRes.coord.lat + '&lon=' + weathRes.coord.lon + '&appid=b002df7a7fe0ceddfb7f66664951ce5a';

      fetch(uvQuery)
      .then(function (response){
        if (!response.ok) {
          throw response.json();
        }

        return response.json();
      }).then(function (uvRes) {
        uvdetermine(uvRes);
      }).catch(function (error) {
        console.error(error);
      });

      function uvdetermine(uvRes) {
        var UVI = uvRes.value;
        uviEl = $('<span></span>').addClass('p-1');
        uviEl.text(UVI);
        uvCurrent.text('UV Index: ');
        uvCurrent.append(uviEl);

        if (UVI < 3.0) {
          uviEl.css('background-color','green').css('color','white')
        } else if (UVI >= 3 && UVI < 6) {
          uviEl.css('background-color','#F5BD1F')
        } else {
          uviEl.css('background-color','red').css('color','white')
        }
      }

      // Add p tags to current weather element
      currentInfoEl.append(tempCurrent).append(humidCurrent).append(windCurrent).append(uvCurrent);
    }
  })
  .catch(function (error) {
    console.error(error);
  });
}

// Forecast function
function searchForecast(weathRes) {

  // Title
  forecastTitleEl.text('5-Day Forecast:');

  // Fetch forecast
  var forecastQuery = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + weathRes.coord.lat + '&lon=' + weathRes.coord.lon + '&appid=b002df7a7fe0ceddfb7f66664951ce5a&exclude=current,minutely,hourly&units=imperial';

  fetch(forecastQuery)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (weathRes) {
    // Catch nonexistent cities - else show info onscreen
    if (weathRes === 0) {
      console.log('No results found!');
      currentInfoEl.innerHTML = '<h3>No results found, search again!</h3>';
    } else {
      
      // Only daily info
      var forecast = weathRes.daily;

      // Clear existing info from page
      forecastEl.text('');

      // Create card for each day for 5 days
      for (var i = 1; i < 6; i++) {

        // Card
        var card = $('<div></div>').addClass('card').addClass('px-2').addClass('pt-2').addClass('m-3').css('width','10rem').css('float','left');

        // Body
        var body = $('<div></div>');
        body.addClass('card-body');

        // Title - uses date from API
        var header = $('<h5></h5>').css('font-weight','bold').addClass('card-title');
        var forecastDate = forecast[i].dt;
        var forecastDateForm = moment(forecastDate,'X').format('M/DD/YYYY');
        header.text(forecastDateForm);

        // Card body info
        var bodyText = $('<div></div>');

        // Temperature
        var tempText = $('<p></p>').text('Temp: ' + forecast[i].temp.day + ' °F');

        // Weather icon
        var forecastIcon = forecast[i].weather[0].icon;
        forecastIconUrl = 'http://openweathermap.org/img/wn/' + forecastIcon + '@2x.png';
        console.log(forecastIconUrl);
        var weathImg = $('<img>').attr('src',forecastIconUrl);

        // Add to card body and add humidity
        bodyText.append(weathImg).append(tempText).append($('<p><br>Humidity: ' + forecast[i].humidity + '%</p>'));

        // Add date and info to card
        card.append(header).append(bodyText);

        // Add card to forecast element
        forecastEl.append(card);
      }
    }
  })
  .catch(function (error) {
    console.error(error);
  });

}

// When clicking search button, search for city name
searchBtn.click(function() {
  cityNameVal = (cityName.val());
  searchCurrent(event,cityNameVal);
})