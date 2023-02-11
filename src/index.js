import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('[id="search-box"]'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function renderCountries(data) {
  refs.countryInfo.innerHTML = '';
  if (data.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  const markup = data
    .map(country => {
      if (data.length === 1) {
        return `
        <ul class="country-item">
          <li class="country-name"><img src="${country.flags.svg}" alt="">  ${country.name}</li>
          <li class="country-capital">Capital: ${country.capital}</li>
          <li class="country-population">Population: ${country.population}</li>
          <li class="country-language">Language: ${country.languages[0].name}</li>
        
        `;
      }
      return `
        <ul class="country-item">
          <li class="country-name"><img src="${country.flags.svg}" alt="">  ${country.name}</li>
        </ul>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

refs.searchInput.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

function searchCountries() {
  const inputValue = refs.searchInput.value.trim();
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(data => renderCountries(data))
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  } else {
    refs.countryInfo.innerHTML = '';
  }
}
