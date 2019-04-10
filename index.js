document.addEventListener("DOMContentLoaded", () => {

  // DOM elements and variables
  const listUl = document.querySelector('#list')
  const showPanelDiv = document.querySelector('#show-panel')
  let books = []


  // initial fetch
  fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(data => {
      books = data
      renderBookList()
    })


  // render the book list
  function renderBookList() {
    books.forEach(book => {
      listUl.innerHTML += `<li id="${book.id}">${book.title}</li>`
    })
  }

  // render a book in the show panel
  function renderBook(book) {
    let userIdsArr = book.users.map(user => user.id)
    return `<h1>${book.title}</h1>
            <img src="${book.img_url}">
            <p>${book.description}</p>
            <p>Users who like this book:</p>
            <ul id="like-list">
              ${book.users.map(user => `<li data-id='${user.id}'>${user.username}</li>`).join('')}
            </ul>
            <button id="${book.id}">${userIdsArr.includes(1) ? 'Unlike' : 'Like' }</button>`
  }

  // event listeners:

  // user clicks on book list item
  listUl.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      let book = books.find(book => book.id === parseInt(e.target.id))
      showPanelDiv.innerHTML = renderBook(book)
    }
  })


  // user clicks on like/unlike button
  showPanelDiv.addEventListener('click', (e) => {
    if (e.target.innerText === 'Like') {
      let bookId = parseInt(e.target.id)
      let users = books.find(book => book.id === bookId).users
      users.push({"id":1, "username":"pouros"})
      let body = { users }
      likeBook(bookId, body)
      let likeListUl = document.querySelector('#like-list')
      likeListUl.innerHTML += `<li data-id='1'>pouros</li>`
      e.target.innerText = 'Unlike'
    } else if (e.target.innerText === 'Unlike') {
      let bookId = parseInt(e.target.id)
      let users = books.find(book => book.id === bookId).users
      users.pop()
      let body = { users }
      unlikeBook(bookId, body)
      let currentUser = document.querySelector(`li[data-id='1']`)
      currentUser.remove()
      e.target.innerText = 'Like'
    }
  })

  // additional fetches:

  // user likes a book
  function likeBook(bookId, body) {
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
  }


  // user unlikes a book
  function unlikeBook(bookId, body) {
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
  }
})
