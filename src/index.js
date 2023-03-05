import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewCountriesFetch from './js/API_SERVICE';
const DEBOUNCE_DELAY = 300;
const countriesHandler = new NewCountriesFetch();

const refs = { input: document.querySelector('#search-box') };

refs.input.addEventListener(
  'input',
  debounce(ev => {
    ResetMarkup();
    if (ev.target.value.trim() === '') return;

    countriesHandler.fetchCountries(ev.target.value.trim()).then(response => {
      if (response.status === 404) {
        return Notify.failure('Oops, there is no country with that name');
      } else if (response.length > 10) {
        ResetMarkup();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        if (response.length === 1) {
          return RenederMarkup(createInfoMarkup(response), 'info');
        } else return RenederMarkup(createListMarkup(response), 'list');
      }
    });
  }, DEBOUNCE_DELAY)
);

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

const RenederMarkup = (data, place) => {
  ResetMarkup();
  document.querySelector(`.country-${place}`).innerHTML = data;
};

const ResetMarkup = () => {
  document.querySelector(`.country-info`).innerHTML = '';
  document.querySelector(`.country-list`).innerHTML = '';
};
