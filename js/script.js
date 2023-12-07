//Global variable
const form = document.querySelector("form");

//Global variable for error and country container html
const errorContainer = document.querySelector(".error-container");
const countryContainer = document.querySelector(".country-container");

//Get country information from API
//Changin URL depending on search type (name or language)
async function getCountry(searchType, userInput) {
  //Changing user input to lowercase and removing spaces
  let userInputLowerCaseAndNoSpaces = userInput.toLowerCase().trim();
  let url;
  //Checking search type and changing url accordingly(name of country or language spoken)
  switch (searchType) {
    case "name":
      url = `https://restcountries.com/v3.1/name/${userInputLowerCaseAndNoSpaces}`;
      break;
    case "language":
      url = `https://restcountries.com/v3.1/lang/${userInputLowerCaseAndNoSpaces}`;
      break;
    default:
      throw new Error("Invalid search type");
  }
  try {
    let response = await fetch(url);

    if (!response.ok) {
      displayError();
      throw new Error("Something went wrong");
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

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

//Determine if the user picked radio button for name or language
function determineSearchType() {
  let searchType = document.querySelector("input[name=option]:checked").value;
  return searchType;
}

//Get the user input and check if it is empty
function getUserInput() {
  let userInput = document.querySelector("input[name=search]").value;
  if (userInput === "") {
    displayError();
  } else {
    return userInput;
  }
}

// Display error on the page
function displayError(error) {
  countryContainer.innerHTML = "";
  let errorEl = document.createElement("h2");
  if (error === "404") {
    errorEl.innerText = "404 Error";
  } else {
    errorEl.innerText = "Failed, try again later";
  }
  errorContainer.appendChild(errorEl);
}

//Get the user input and search type and display the country information
async function searchCountry(event) {
  errorContainer.innerHTML = "";
  // Prevent page reload
  event.preventDefault();
  //Getting searchtype by name or language
  let searchType = determineSearchType();
  //Get user input / displays error if null or empty
  let userInput = getUserInput();
  let countries;
  countries = await getCountry(searchType, userInput);

  //check if countries is empty if not : display countries
  if (countries.length > 0) {
    //sort countries by population descending(large first)
    countries.sort((a, b) => b.population - a.population);
    displayCountries(countries);
  } else {
    displayError();
  }
}

// Event listener for submit button in the form
form.addEventListener("submit", searchCountry);
