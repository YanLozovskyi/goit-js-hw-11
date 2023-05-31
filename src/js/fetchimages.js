import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '36892972-3965195d48ffcffaf1a3741cc';
  #BASE_URL = 'https://pixabay.com/api/';
  #query = '';

  constructor(perPage = 10) {
    this.per_page = perPage;
  }

  getPhotosByQuery(page) {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page,
        per_page: this.per_page,
      },
    });
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    return (this.#query = newQuery);
  }
}
