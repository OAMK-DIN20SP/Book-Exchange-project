$(document).ready( () => {
  function displaySearchResult(url) {
    if ($('#search-result')) $('#search-result').remove();

    $.get(url, (data) => {
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
              <td>Book owner</td>
            </tr>
          </thead>
          <tbody>`;
      
      for (let i=0; i<books.length; i++) {
        const book = books[i];
        // await fetch(`/member/search?idmember=${book.idmember}`)
        //   .then( res => res.json() )
        //   .then( data => console.log(data) );


        innerHTMLString += `
          <tr>
            <td><a href="/book?idbook=${book.idbook}" target="_blank"><img src="/images/books/${book.image}"></a></td>
            <td><a href="/book?idbook=${book.idbook}" target="_blank">${book.title}</a></td>
            <td>${book.author}</td>
            <td><a href="/member?idmember=${book.idmember}">Visit owner</a></td>
          </tr>`;


        // await $.ajax({
        //   url: `/member/search?idmember=${book.idmember}`,
        //   type: 'GET',
        //   error: (err) => console.log(err),
        //   success: (data) => console.log(data),
        // });
      };

      for (let i=0; i<books.length; i++) {
        const book = books[i];
        const idmember = book.idmember;

        $.get( `/member/search?idmember=${idmember}`, (data2) => {
          const member = data2.members[0];
          const fullName = member.firstname + ' ' + member.lastname;
          document.querySelectorAll('#search-result tbody tr td:last-child a')[i].textContent = fullName;
        });
      }


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




  // main() :v
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

  $('#btn-title-search').click( () => searchBookByTitle() );
  $('#btn-author-search').click( () => searchBookByAuthor() );

  $('#btn-latest-books').click( () => {
    displaySearchResult('/book/latest');
  });
})