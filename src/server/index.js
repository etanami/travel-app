// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 9090;
//to spin up the server
const server = app.listen(port, listening);
//callback function
function listening() {
  console.log('The server works fine!');
  console.log(`The port is running on local host: ${port}`);
}

// responds with JS Object when GET request is made
app.get('/all', (req, res) => {
  res.send(projectData);
});

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});
