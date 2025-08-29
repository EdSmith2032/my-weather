const citySelect = document.getElementById('city-select');
        const displayWeatherBtn = document.getElementById('display-weather');
        const cityNameEl = document.getElementById('city-name');
        const latitudeEl = document.getElementById('latitude');
        const longitudeEl = document.getElementById('longitude');
        const temperatureEl = document.getElementById('temperature');


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
            latitudeEl.textContent = '';
            longitudeEl.textContent = '';
            temperatureEl.textContent = '';

            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&temperature_unit=fahrenheit`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`API error! Status: ${response.status}`);
                }
                const data = await response.json();
                updateWeatherUI(data, city.name); // Pass city name to the update function
            } catch (error) {
                console.error("Failed to fetch weather data:", error);
                // --- Display Error State in UI ---
                cityNameEl.textContent = 'Error';
                latitudeEl.textContent = 'Could not fetch data.';
                longitudeEl.textContent = 'Please try again later.';
                temperatureEl.textContent = '';
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
            if (data && data.current_weather) {
                cityNameEl.textContent = cityName;
                latitudeEl.textContent = `Latitude: ${data.latitude.toFixed(4)}`;
                longitudeEl.textContent = `Longitude: ${data.longitude.toFixed(4)}`;
                temperatureEl.textContent = `Temperature: ${data.current_weather.temperature.toFixed(1)}°F`;
            } else {
                 // --- Display Error State if data structure is unexpected ---
                cityNameEl.textContent = 'Error';
                latitudeEl.textContent = 'Received invalid data.';
                longitudeEl.textContent = 'Please check the API response.';
                temperatureEl.textContent = '';
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