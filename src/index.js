import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 1000;

const refs = {
  searchInput: document.querySelector('[id="search-box"]'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function searchCountries() {
  const inputValue = refs.searchInput.value.trim();
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(data => {
        if (data.length > 10) {
          return Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length !== 1) {
          renderCountriesList(data);
        } else {
          renderCountriesInfo(data);
        }
      })
      .catch(error => {
        Notify.failure('please enter a name');
      });
  } else {
    clearCountryData();
  }
}

function renderCountriesInfo(data) {
  clearCountryData();

  const markup = data
    .map(country => {
      return `
        <ul class="country-item">
          <li class="country-name"><img src="${country.flags.svg}" alt="">  ${
        country.name.official
      }</li>
          <li class="country-capital">Capital: ${country.capital}</li>
          <li class="country-population">Population: ${country.population}</li>
          <li class="country-language">Language: ${Object.values(
            country.languages
          )}</li>
        `;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

refs.searchInput.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

function renderCountriesList(data) {
  clearCountryData();
  const markup = data
    .map(country => {
      return `
          <li class="country-name"><img src="${country.flags.svg}" alt="">  ${country.name.official}</li>
        `;
    })
    .join('');
  refs.countriesList.insertAdjacentHTML('beforeend', markup);
}

function clearCountryData() {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
