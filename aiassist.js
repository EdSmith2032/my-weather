 // --- DOM Elements ---
        const citySelect = document.getElementById('city-select');
        const displayWeatherBtn = document.getElementById('display-weather');
        const cityNameEl = document.getElementById('city-name');
        // Get the span inside the p tag for text content
        const temperatureEl = document.querySelector('#temperature span');
        const windSpeedEl = document.querySelector('#wind-speed span');
        const humidityEl = document.querySelector('#humidity span');
        const rainChanceEl = document.querySelector('#rain-chance span');


        // --- City Data ---
        const cityData = {
            'new-orleans': { name: 'New Orleans, LA', lat: 29.95, lon: -90.07 },
            'austin': { name: 'Austin, TX', lat: 30.27, lon: -97.74 },
            'san-francisco': { name: 'San Francisco, CA', lat: 37.77, lon: -122.42 },
            'new-york': { name: 'New York, NY', lat: 40.71, lon: -74.01 },
            'los-angeles': { name: 'Los Angeles, CA', lat: 34.05, lon: -118.24 },
            'chicago': { name: 'Chicago, IL', lat: 41.88, lon: -87.63 },
            'houston': { name: 'Houston, TX', lat: 29.76, lon: -95.36 },
            'phoenix': { name: 'Phoenix, AZ', lat: 33.45, lon: -112.07 },
            'philadelphia': { name: 'Philadelphia, PA', lat: 39.95, lon: -75.16 },
            'san-diego': { name: 'San Diego, CA', lat: 32.72, lon: -117.16 },
            'dallas': { name: 'Dallas, TX', lat: 32.78, lon: -96.80 },
            'seattle': { name: 'Seattle, WA', lat: 47.61, lon: -122.33 },
            'denver': { name: 'Denver, CO', lat: 39.74, lon: -104.99 },
            'boston': { name: 'Boston, MA', lat: 42.36, lon: -71.06 },
            'miami': { name: 'Miami, FL', lat: 25.76, lon: -80.19 },
            'atlanta': { name: 'Atlanta, GA', lat: 33.75, lon: -84.39 }
        };

        /**
         * Fetches live weather data from the weather.gov API and updates the UI.
         * @param {string} cityKey - The key for the city in the cityData object.
         */
        async function fetchAndDisplayWeather(cityKey) {
            const city = cityData[cityKey];
            if (!city) {
                console.error("Data not found for city:", cityKey);
                cityNameEl.textContent = 'Error: City not found.';
                return;
            }

            // --- Set Loading State ---
            displayWeatherBtn.disabled = true;
            displayWeatherBtn.textContent = 'Loading...';
            cityNameEl.textContent = 'Fetching Weather...';
            temperatureEl.textContent = '';
            windSpeedEl.textContent = '';
            humidityEl.textContent = '';
            rainChanceEl.textContent = '';

            // weather.gov API requires a User-Agent header.
            const headers = new Headers({
                'User-Agent': '(My Weather App, myemail@example.com)'
            });

            try {
                // Step 1: Get the forecast URL from the points endpoint
                const pointsUrl = `https://api.weather.gov/points/${city.lat.toFixed(4)},${city.lon.toFixed(4)}`;
                const pointsResponse = await fetch(pointsUrl, { headers });
                if (!pointsResponse.ok) {
                    throw new Error(`Points API error! Status: ${pointsResponse.status}`);
                }
                const pointsData = await pointsResponse.json();
                const forecastUrl = pointsData.properties.forecastHourly; // Use hourly for more immediate data

                // Step 2: Get the actual forecast data
                const forecastResponse = await fetch(forecastUrl, { headers });
                if (!forecastResponse.ok) {
                    throw new Error(`Forecast API error! Status: ${forecastResponse.status}`);
                }
                const forecastData = await forecastResponse.json();
                
                updateWeatherUI(forecastData, city.name);

            } catch (error) {
                console.error("Failed to fetch weather data:", error);
                // --- Display Error State in UI ---
                cityNameEl.textContent = 'Error';
                temperatureEl.textContent = 'Could not fetch data.';
                windSpeedEl.textContent = 'Please try again later.';
                humidityEl.textContent = '';
                rainChanceEl.textContent = '';
            } finally {
                // --- Reset Button State ---
                displayWeatherBtn.disabled = false;
                displayWeatherBtn.textContent = 'Display Weather';
            }
        }

        /**
         * Updates the UI with the fetched weather information.
         * @param {object} data - The weather data object from the API response.
         * @param {string} cityName - The name of the city to display.
         */
        function updateWeatherUI(data, cityName) {
            if (data && data.properties && data.properties.periods && data.properties.periods.length > 0) {
                const currentPeriod = data.properties.periods[0];
                
                // Safely access potentially null values using optional chaining (?.)
                const humidity = currentPeriod.relativeHumidity?.value;
                const chanceOfRain = currentPeriod.probabilityOfPrecipitation?.value;

                cityNameEl.textContent = cityName;
                temperatureEl.textContent = `Temperature: ${currentPeriod.temperature}°${currentPeriod.temperatureUnit}`;
                windSpeedEl.textContent = `Wind: ${currentPeriod.windSpeed}`;
                
                // Display 'N/A' if the value is null or undefined
                humidityEl.textContent = `Humidity: ${humidity == null ? 'N/A' : humidity + '%'}`;
                rainChanceEl.textContent = `Chance of Rain: ${chanceOfRain == null ? 'N/A' : chanceOfRain + '%'}`;

            } else {
                 // --- Display Error State if data structure is unexpected ---
                cityNameEl.textContent = 'Error';
                temperatureEl.textContent = 'Received invalid data.';
                windSpeedEl.textContent = 'Please check the API response.';
                humidityEl.textContent = '';
                rainChanceEl.textContent = '';
            }
        }

        // --- Event Listener ---
        displayWeatherBtn.addEventListener('click', () => {
            const selectedCity = citySelect.value;
            fetchAndDisplayWeather(selectedCity);
        });

        // --- Initial Load ---
        // Display the default city's weather when the page loads.
        window.addEventListener('DOMContentLoaded', () => {
            fetchAndDisplayWeather('new-orleans');
        });