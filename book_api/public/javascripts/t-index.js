$(document).ready( () => {
  $('#Author').keypress( (e) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      searchBookByAuthor();
    }
  });

  $('#Title').keypress( (e) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      searchBookByTitle();
    }
  });

  function displaySearchResult(url) {
    $.get(url, (data) => {
      console.log(data);
      const books = data.books;
      let searchResultElem = document.createElement('div');
      searchResultElem.id = 'search-result';
      
      let innerHTMLString = `
        <div class="search-result-title">
          <h2>Search Results</h2>
          <button id="btn-close-search-result">Close</button>
        </div>
        <table>
          <thead>
            <tr>
              <td>Book cover</td>
              <td>Title</td>
              <td>Author(s)</td>
              <td>Owner's ID</td>
            </tr>
          </thead>
          <tbody>`;

      
      for (let book of books) {
        innerHTMLString += `
          <tr>
            <td><a href="/book?idbook=${book.idbook}" target="_blank"><img src="/images/books/${book.image}" style="width: 150px; height: 150px; cursor: pointer;"></a></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.idmember}</td>
          </tr>`;
      };


      innerHTMLString += `</tbody></table>`;


      searchResultElem.innerHTML = innerHTMLString;

      $('main').append(searchResultElem);

      $('#btn-close-search-result').click( () => $('#search-result').remove() );
      
    });
  }

  function searchBookByTitle() {
    const key = 'title';
    const value = $('#Title').val().trim();
    const url = `/book/search?${key}=${value}`;
    displaySearchResult(url);
  }

  function searchBookByAuthor() {
    const key = 'author';
    const value = $('#Author').val().trim();
    const url = `/book/search?${key}=${value}`;
    displaySearchResult(url);
  }

  $('#btn-title-search').click( () => searchBookByTitle() );
  $('#btn-author-search').click( () => searchBookByAuthor() );

  $('#btn-latest-books').click( () => {
    displaySearchResult('/book/latest');
  });
})