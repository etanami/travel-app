/* API Keys */
const geoApiKey = 'etanami';
const wBitApiKey = 'd5662da56cf148debed653381e7b914b';
const pixabayKey = '21033671-a327837f499062cd366d0e3de';

/* Global variables */
const ui_country = document.querySelector('.country');
const ui_temp = document.querySelector('.temperature');
const ui_code = document.querySelector('.code');
const ui_description = document.querySelector('.description');
const ui_cloud_icon = document.querySelector('.icon');
const ui_img = document.getElementById('city-img');
const ui_callCode = document.querySelector('.call-code');
const ui_capital = document.querySelector('.capital');
const ui_currency = document.querySelector('.currency');
const ui_subregion = document.querySelector('.sub-region');
const ui_language = document.querySelector('.language');
const ui_flag = document.querySelector('.flag');
const countD = document.getElementById('countDown');

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

  //calls geoname function
  getGeoname(city);

  countDown();
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
      const temp = data.data[dayN].temp;
      const description = data.data[dayN].weather.description;
      const icon = data.data[dayN].weather.icon;

      console.log(city, temp, description, icon);

      getPixabay(
        pixabayKey,
        city,
        temp,
        description,
        icon,
        code,
        country,
        dayN
      );
    });
};

/*Pixabay fetch function*/
const getPixabay = async (
  pixabayKey,
  city,
  temp,
  description,
  icon,
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

      updateUI(image, temp, description, icon, code, country, dayN);
    });
};

/* Function that dynamically updates the UI */
const updateUI = (image, temp, description, icon, code, country, dayN) => {
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
        flag,
        icon
      );

      //updating countdown element
      //countD.innerHTML = 'You have ' + dayN + ' days to your trip!';

      //updating UI
      ui_country.innerHTML = 'Your trip is in ' + country;
      ui_code.innerHTML = code;
      ui_temp.innerHTML = temp + '°C';
      ui_description.innerHTML = description;
      ui_cloud_icon.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

      //updating UI with more information from REST API
      ui_img.src = image;
      ui_capital.innerHTML = capital;
      ui_callCode.innerHTML = '+' + callingCode;
      ui_currency.innerHTML = currency + ', or ' + currencyS;
      ui_language.innerHTML = language;
      ui_subregion.innerHTML = subregion;
      ui_flag.src = flag;
    });
};

/*Countdown function to count days left to the trip*/
const countDown = () => {
  //e.preventDefault();

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
    countD.innerHTML = 'Your trip is today!';
  } else if (count === 0) {
    countD.innerHTML = 'You have less than a day to your trip!';
  } else if (count === 1) {
    countD.innerHTML = 'You have 1 full day left to your trip!';
  } else if (count > 1) {
    countD.innerHTML = `You have ${count} days left to your trip!`;
  } else if (count < -1) {
    alert("Can't enter a past date");
  }
};
