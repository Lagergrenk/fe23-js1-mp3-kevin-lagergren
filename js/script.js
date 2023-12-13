//Global variable
const form = document.querySelector("form");

//Global variable for error and country container html
const errorContainer = document.querySelector(".error-container");
const countryContainer = document.querySelector(".country-container");

// ------------------ API FUNCTIONS ------------------
//Get country information from API
//Changin URL depending on search type (name or language)
async function getCountry(searchType, userInput) {
  //Changing user input to lowercase and replacing spaces with %20
  let userInputLowerCase = encodeURIComponent(userInput.toLowerCase().trim());
  console.log("getCountry", searchType, userInputLowerCase);
  let url;
  //Checking search type and changing url accordingly(name of country or language spoken)
  switch (searchType) {
    case "name":
      url = `https://restcountries.com/v3.1/name/${userInputLowerCase}`;
      break;
    case "language":
      url = `https://restcountries.com/v3.1/lang/${userInputLowerCase}`;
      break;
    default:
      displayError("Invalid input");
      return null;
  }
  try {
    let response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        displayError("404");
      } else {
        displayError();
      }
      return null;
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    displayError();
    return null;
  }
}

//Validate user input and fetch data from API
//Display error if input is invalid
async function validateAndFetchCountries(searchType) {
  let userInput = getUserInput();
  //inputvalidation
  if (!inputValidation(userInput)) {
    displayError("Invalid input");
    return null;
  }
  let result = await getCountry(searchType, userInput);
  return result;
}

//Search for country when user clicks submit button
//Prepare search, validate input and fetch data from API
async function searchCountry(event) {
  event.preventDefault();
  let searchType = await determineSearchType();
  let countries = await validateAndFetchCountries(searchType);
  if (countries) {
    processCountries(countries);
  }
}

// ------------------ DISPLAY FUNCTIONS ------------------
//Show country information on the page
function displayCountries(countries) {
  countryContainer.innerHTML = "";

  //Creating html for countries, displaying all countries asked for
  countries.forEach((country) => {
    let countryElement = document.createElement("div");
    countryElement.classList.add("country");

    let countryName = document.createElement("h2");
    countryName.innerText = country.name.common;
    countryElement.appendChild(countryName);

    let countrySubregion = document.createElement("p");
    countrySubregion.innerText = `Subregion: ${country.subregion}`;
    countryElement.appendChild(countrySubregion);

    let countryCapital = document.createElement("p");
    countryCapital.innerText = `Capital: ${country.capital}`;
    countryElement.appendChild(countryCapital);

    let countryPopulation = document.createElement("p");
    countryPopulation.innerText = `Population: ${country.population}`;
    countryElement.appendChild(countryPopulation);

    let countryFlag = document.createElement("img");
    countryFlag.className = "flag-img";
    countryFlag.src = country.flags.png;
    countryElement.appendChild(countryFlag);

    countryContainer.appendChild(countryElement);
  });
}

// ------------------ HELPER FUNCTIONS ------------------
//Determine wich radio button the user picked for name or language
function determineSearchType() {
  let searchType = document.querySelector("input[name=option]:checked").value;
  return searchType;
}

//Get the user input from the form
function getUserInput() {
  let userInput = document.querySelector("input[name=search]").value;
  return userInput;
}

//inputvalidation for user input
function inputValidation(input) {
  //regex for only letters
  let regex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
  if (input.match(regex)) {
    return true;
  } else {
    return false;
  }
}

//Process countries and display them on the page
//Sort countries by population
function processCountries(countries) {
  console.log("processCountries", countries);
  if (countries && countries.length > 0) {
    countries.sort((a, b) => b.population - a.population);
    displayCountries(countries);
  }
}

// ------------------ ERROR FUNCTIONS ------------------
// Display error on the page depending on error code
function displayError(errorCode) {
  console.log("displayError", errorCode);
  // Clearing containers
  countryContainer.innerHTML = "";
  errorContainer.innerHTML = "";
  let errorEl = document.createElement("h2");
  switch (errorCode) {
    case "404":
      errorEl.innerText = "Country not found. Please try a different search.";
      break;
    case "Invalid input":
      errorEl.innerText = "Invalid input.";
      break;
    default:
      errorEl.innerText = "Network error. Please try again later.";
      break;
  }
  errorContainer.appendChild(errorEl);
}

// Event listener for submit button in the form
form.addEventListener("submit", searchCountry);
