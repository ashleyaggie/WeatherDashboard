# WeatherDashboard

## Description

We were learning to fetch data from API's and pick specific data from the response to show on the page. We also used local storage again to store the search history to be searched again as needed.

I had a really difficult time with this assignment. I didn't feel like my understanding of API's was very strong, so it took me a while to figure out how to work the parameters depending on which API I was fetching from. I have a better understanding now, but the fetching process did feel very finnicky at times.

[Deployed Website](https://ashleyaggie.github.io/WeatherDashboard/)

![Picture of website landing page](/assets/images/website.png)

![Picture of website with info](/assets/images/websiteInfo.png)

## Changes Made

GIVEN a weather dashboard with form inputs

WHEN I search for a city

THEN I am presented with current and future conditions for that city and that city is added to the search history

    * Fetched information from API's to provide current and future conditions to display on page.

    * City searched is added to search history on side and to local storage.

WHEN I view current weather conditions for that city

THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

    * Fetched necessary data from API and created divs to display the info

WHEN I view the UV index

THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

    * Used an if statement to determine whether UVI is favorable, moderate, or severe and colored it green, yellow, or red respectively.

WHEN I view future weather conditions for that city

THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity

    * Used a for loop to create cards for each day after fetching data from API

WHEN I click on a city in the search history

THEN I am again presented with current and future conditions for that city

    * Added a click to the list to get the city name of the list item and run the weather function with that city name.


## Credits

Website code was written by myself (Ashley Wright)

Assignment is part of the SMU Coding Boot Camp

## License

Copyright (c) 2021 Ashley Wright

Covered by the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)