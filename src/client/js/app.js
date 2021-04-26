//API Keys
const geoApiKey = 'etanami';
const wBitApiKey = 'd5662da56cf148debed653381e7b914b';
const pixabayKey = '21033671-a327837f499062cd366d0e3de';

document.getElementById('submit').addEventListener('click', performAction);

export async function performAction(e) {
  e.preventDefault();
  const city = document.getElementById('form-city').value;
  const date = document.getElementById('form-date').value;
  const error = document.querySelector('.errorEl');

  if (city == '' || date == '') {
    error.innerHTML = 'please enter valid city or date!';
    error.classList.remove('d-none');
    return;
  } else {
    error.innerHTML = '';
  }

  //calls countdown function
  countDown();

  //calls geoname function
  getGeoname(city);
}

/*Geoname fetch function*/
const getGeoname = async (city) => {
  fetch(
    `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${geoApiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const country = data.geonames[0].countryName;
      const code = data.geonames[0].countryCode;
      const lat = data.geonames[0].lat;
      const long = data.geonames[0].lng;
      console.log(country, code, lat, long);

      getWeatherbit(lat, long, code, country);
    });
};

/*Weatherbit fetch function*/
const getWeatherbit = async (lat, long, code, country) => {
  let depDate = document.getElementById('form-date').value;
  let newDate = new Date(depDate);
  let day = newDate.getTime();
  let d = new Date();
  let today = d.getTime();
  let timeDiff = day - today;
  let daysDiff = timeDiff / (1000 * 3600 * 24);
  let count = Math.round(daysDiff);

  //dayN value between no: 1-15, helps select the accurate data of the day from the fetch call
  let dayN = count + 1;
  console.log('object data for the correct date is: ', dayN);

  fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${long}&key=${wBitApiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const city = data.city_name;
      const temp = data.data[0].temp;
      const description = data.data[0].weather.description;

      console.log(city, temp, description);

      getPixabay(pixabayKey, city, temp, description, code, country, dayN);
    });
};

/*Pixabay fetch function*/
const getPixabay = async (
  pixabayKey,
  city,
  temp,
  description,
  code,
  country,
  dayN
) => {
  fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${city}&image_type=photo`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const image = data.hits[0].webformatURL;
      console.log(image);

      updateUI(image, temp, description, code, country, dayN);
    });
};

/* Function that dynamically updates the UI */
const updateUI = (image, temp, description, code, country, dayN) => {
  //Integrating REST API to give more information about the country
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      //store data in variables
      const callingCode = data[0].callingCodes[0];
      const capital = data[0].capital;
      const currency = data[0].currencies[0].name;
      const currencyS = data[0].currencies[0].symbol;
      const subregion = data[0].subregion;
      const language = data[0].languages[0].name;
      const flag = data[0].flag;

      console.log(
        callingCode,
        capital,
        currency,
        currencyS,
        subregion,
        language,
        flag
      );
    });
};

/*Countdown function to count days left to the trip*/
const countDown = () => {
  let depDate = document.getElementById('form-date').value;
  let newDate = new Date(depDate);
  let day = newDate.getTime();
  let d = new Date();
  let today = d.getTime();

  //gets time difference
  let timeDiff = day - today;
  let daysDiff = timeDiff / (1000 * 3600 * 24);
  //rounds figure to whole number
  let count = Math.round(daysDiff);

  console.log(count);

  if (count === -1) {
    document.getElementById('countDown').innerHTML = 'Your trip is today!';
  } else if (count === 0) {
    document.getElementById('countDown').innerHTML =
      'You have less than a day to your trip!';
  } else if (count === 1) {
    document.getElementById('countDown').innerHTML =
      'You have 1 full day left to your trip!';
  } else if (count > 1) {
    document.getElementById(
      'countDown'
    ).innerHTML = `You have ${count} days left to your trip!`;
  } else if (count < -1) {
    alert("Can't enter a past date");
  }
};
