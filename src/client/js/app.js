/* Global Variables */
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=edd6ece7ee85efec07d97efd28106c93&units=imperial';

const dateH = document.getElementById('date');
const tempH = document.getElementById('temp');
const contentH = document.getElementById('content');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;
  weatherData(baseURL, zip, apiKey).then((data) => {
    postData('/addWeather', {
      temperature: data.main.temp,
      date: newDate,
      feelings: feelings,
    }).then(updateUI());
  });
}

/*Integrating OpenWeatherMap API*/
const weatherData = async (baseURL, zipCode, key) => {
  const res = await fetch(baseURL + zipCode + key);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    //appropiately handles the error
    console.log('error', error);
  }
};

const postData = async (url = '', data = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
    },
    // Body data type must match "Content-Type" header
    body: JSON.stringify(data),
  });
  try {
    const newData = await res.json();
    console.log(newData);
    return newData;
  } catch (error) {
    console.log('error', error);
  }
};

const updateUI = async () => {
  const res = await fetch('/all');
  try {
    const fullData = await res.json();
    dateH.innerHTML = fullData.date;
    tempH.innerHTML = fullData.temperature;
    contentH.innerHTML = fullData.feelings;
  } catch (error) {
    console.log('error', error);
  }
};

export { performAction };
