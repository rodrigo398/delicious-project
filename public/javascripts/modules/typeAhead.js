import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores
    .map(store => {
      return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>        
      </a>
    `;
    })
    .join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    //console.log(this.value);
    if (!this.value) {
      searchResults.style.display = 'none';
      return; //stop
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';
    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        //console.log(res.data);
        if (res.data.length) {
          /* const html = searchResultsHTML(res.data);
        searchResults.innerHTML = html */
          dompurify.sanitize(
            (searchResults.innerHTML = searchResultsHTML(res.data))
          );
          return;
        }
        searchResults.innerHTML = dompurify.sanitize(
          `<div class="search__result">No results for ${
            this.value
          } found!</div>`
        );
        console.log(searchResults);
      })
      .catch(err => {
        console.error(err);
      });
  });

  //handle keyboard inputs
  searchInput.on('keyup', e => {
    if (![38, 40, 13].includes(e.keyCode)) {
      return; // nah
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    //console.log(next);
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

export default typeAhead;
