const apiKey = 'GENERATE WEATHERMAPAPI KEY AND PLACE HERE';

const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const daysToShow = 5; // Number of upcoming days to show weather forecast


const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const weatherContainer = document.querySelector('.weather-container');
const todayContainer = document.querySelector('.today-container');

// Search button event listener
searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeatherForecast(location);
    }
});

// Fetch weather information through API call 
function fetchWeatherForecast(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=imperial&cnt=${daysToShow * 8}`; // Fetch forecast for multiple days

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherData = data.list; // Get the forecast data

            // Reset search results for previous weather searches
            weatherContainer.innerHTML = ''; // Clear previous weather data
            todayContainer.innerHTML = ''; // Clear previous today's weather data
            todayContainer.style.border = '1px solid #ccc'; // Add border dynamically

            // Display today-container after weather data is fetched
            todayContainer.style.display = 'flex';
            
            // Display today's weather in separate container
            const today = weatherData[0]; // Get data for today
            const temperature = Math.round(today.main.temp);
            const description = today.weather[0].description;
            const day = weatherData[0]; // Get data for a specific day
            const date = new Date(day.dt * 1000); // Convert UNIX timestamp to date

            // Feels Like
            const feelsLike = today.main.feels_like;

            // Humidity
            const humidity = today.main.humidity;

            // Wind
            const wind = today.wind.speed;

            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // Get the weekday name

            todayContainer.classList.add('today-container');
            todayContainer.style.backgroundImage = `url("Photos/${description}.jpeg")`;

            // Create left column div
            const leftColumn = document.createElement('div');
            leftColumn.classList.add('left-column');

            // Create right column div
            const rightColumn = document.createElement('div');
            rightColumn.classList.add('right-column');

            const leftColumnContent = `
                <h2 style="font-size: 40px">${location}</h2>
                <h2>${weekday}</h2>
                <h2>${temperature}°F</h2>
            `;

            const rightColumnContent = `
                <p style="text-transform: capitalize">Description: ${description}</p>
                <p>Feels Like: ${feelsLike}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind: ${wind} mph</p>
            `;

            // Separate the information in the main weather container for today into 2 columns
            leftColumn.innerHTML = leftColumnContent;
            rightColumn.innerHTML = rightColumnContent;

            todayContainer.appendChild(leftColumn);
            todayContainer.appendChild(rightColumn);

            // Iterate over the forecast data for upcoming days
            for (let i = 8; i < weatherData.length; i += 8) {
                const day = weatherData[i]; // Get data for a specific day
                const date = new Date(day.dt * 1000); // Convert UNIX timestamp to date
                const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // Get the weekday name
                const temperature = Math.round(day.main.temp);
                const description = day.weather[0].description;

                // Display weather information for each day
                const dayContainer = document.createElement('div');
                dayContainer.classList.add('day-container');
                dayContainer.style.backgroundImage = `url("Photos/${description}.jpeg")`;
                
                dayContainer.innerHTML = `
                    <h2>${weekday}</h2>
                    <h2>${temperature}°F</h2>
                    <p style="text-transform: capitalize">${description}</p>
                `;

                // Append weather information to weather container
                weatherContainer.appendChild(dayContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}