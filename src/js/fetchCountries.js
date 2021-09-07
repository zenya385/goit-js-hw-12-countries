import { BASE_FETCH_URL } from '../const/index';
import { inputRefs, outputRefs } from '../const/refs';

import countryTpl from '../templates/country.hbs';
import countriesTpl from '../templates/countries.hbs';

import { error } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/Material.css';

function fetchCountries(name) {
  return fetch(BASE_FETCH_URL + name).then(response => {
    return response.json();
  });
}

function showNotice() {
  error({
    text: 'Too many matches found. Please enter a more specific query!',
    delay: 3000,
  });
}

function onCreateCountries() {
  const inputValue = inputRefs.value.toLowerCase();

  fetchCountries(inputValue)
    .then(data => {
      const dataLength = data.length;

      if (dataLength === 1) {
        const country = creatCountryMarkup(data);
        updatePage(country);
      } else if (dataLength > 1 && dataLength < 10) {
        updatePage(creatCountriesMarkup(data));
      } else {
        updatePage();
        showNotice();
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function updatePage(markup = '') {
  outputRefs.innerHTML = markup;
}

function creatCountriesMarkup(country) {
  return countriesTpl(country);
}

function creatCountryMarkup(country) {
  return countryTpl(country);
}

const debounce = require('lodash.debounce');

inputRefs.addEventListener('input', debounce(onCreateCountries, 500));
