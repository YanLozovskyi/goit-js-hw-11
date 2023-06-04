import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'animate.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import refs from './js/refs';
import createGalleryCard from './templates/gallery_card.hbs';
import { PixabayAPI } from './js/fetchimages';
import { letScroll } from './js/smoth-scroll';
import { throttle } from 'throttle-debounce';

const pixabayAPI = new PixabayAPI(40);
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let page;

refs.formEl.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();

  refs.loadMoreBtn.classList.add('is-hidden');

  page = 1;
  const searchQuery = evt.currentTarget.elements['searchQuery'].value.trim();

  pixabayAPI.query = searchQuery;

  if (!searchQuery) {
    Notify.failure('Enter your request', { clickToClose: true });
    return;
  }

  try {
    const response = await pixabayAPI.getPhotosByQuery(page);

    if (response.data.hits.length === 0) {
      refs.galleryEl.innerHTML = '';
      refs.plug.classList.remove('is-hidden');
      refs.plug.textContent =
        'And I am here again,you must try to enter the correct query';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
      return;
    }
    refs.galleryEl.innerHTML = createGalleryCard(response.data.hits);
    refs.plug.classList.add('is-hidden');
    simpleLightbox.refresh();
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`, {
      clickToClose: true,
    });

    if (!(response.data.totalHits <= 40)) {
      refs.loadMoreBtn.classList.remove('is-hidden');
      refs.loadMoreBtn.addEventListener('click', onLoadMore);
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  page += 1;
  let totalPage;
  try {
    const response = await pixabayAPI.getPhotosByQuery(page);
    totalPage = response.data.totalHits / pixabayAPI.per_page;
    refs.galleryEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCard(response.data.hits)
    );
    simpleLightbox.refresh();
    letScroll();
    if (totalPage < page) {
      refs.loadMoreBtn.classList.add('is-hidden');
      refs.loadMoreBtn.removeEventListener('click', onLoadMore);
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        { clickToClose: true }
      );
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

// fixed header

function addIntersectionObserver() {
  const options = {
    rootMargin: '70px',
    threshold: 1.0,
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        document.getElementById('header').classList.add('header-scroll');
      } else {
        document.getElementById('header').classList.remove('header-scroll');
      }
    });
  }, options);

  observer.observe(document.querySelector('.observer-wrapper'));
}

addIntersectionObserver();
