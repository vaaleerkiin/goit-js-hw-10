export default class NewCountriesFetch {
  constructor() {
    this.URL = `https://restcountries.com/v3.1/name/`;
  }
  fetchCountries(name) {
    return fetch(
      `${this.URL}${name}?fields=name,capital,population,flags,languages`
    ).then(response => response.json());
  }
}
