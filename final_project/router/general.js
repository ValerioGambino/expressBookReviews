const express = require('express');
let books = require("./booksdb.js");
const {json} = require("express");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send({ message: "Username and password are missing" });
  }

  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.status(400).send({ message: "Username already exists" });
  }

  users.push({ username, password });

  res.status(200).send({ message: "User registered successfully" });
});

//Task10
function retrieveBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //TASK1 return res.status(200).json(books)
  retrieveBooks().then(
      (books) => res.status(200).send(JSON.stringify(books, null, 4)),
      (error) =>
          res
              .status(404)
              .send("An error has occured trying to retrieve all the books")
  );
});
// Get the book list available in the shop
/*public_users.get('/books',function (req, res) {
  const allBooks = JSON.stringify(books);
  res.json(allBooks);
})*/
//Task11
function retrieveBookFromISBN(isbn) {
  let book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject(new Error("The provided book does not exist"));
    }
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  retrieveBookFromISBN(isbn).then(
      (book) => res.status(200).send(JSON.stringify(book, null, 4)),
      (err) => res.status(404).send(err.message)
  );
});

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  const bookList = Object.values(books)
  const book = bookList.find(b => b.isbn === isbn);

  if (book) {
    let bookDetails = JSON.stringify(book);
    res.send(`Book details for ISBN ${isbn}: ${bookDetails}`);
  } else {
    res.send(`No book found for ISBN ${isbn}`);}
 });*/

//Task 12
function retrieveBookFromAuthor(author) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookAuthor = books[bookISBN].author;
      if (bookAuthor === author) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided author does not exist"));
    }
  });
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  retrieveBookFromAuthor(author).then(
      (books) => res.status(200).send(JSON.stringify(books, null, 4)),
      (err) => res.status(404).send(err.message)
  );
});
/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookList = Object.values(books);
  const book = bookList.find(b => b.author === author)

  if (book) {
    let bookDetails = JSON.stringify(book);
    res.send(`Book details for author ${author}: ${bookDetails}`);
  } else {
    res.send(`No book found for author ${author}`);}
});
*/

//Task 13
function retrieveBookFromTitle(title) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookTitle = books[bookISBN].title;
      if (bookTitle === title) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided book title does not exist"));
    }
  });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  retrieveBookFromTitle(title).then(
      (book) => res.status(200).send(JSON.stringify(book, null, 4)),
      (err) => res.status(404).send(err.message)
  );
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookList = Object.values(books);
  const book = bookList.find(b => b.title === title)

  if (book) {
    let bookDetails = JSON.stringify(book);
    res.send(`Book details for title ${title}: ${bookDetails}`);
  } else {
    res.send(`No book found for title ${title}`);}
});*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookList = Object.values(books);
  const book = bookList .find(b => b.isbn === isbn);

  if (book) {
    const review = book.reviews;
    res.send(review);
  } else {
    res.send("Book not found");
  }
});

module.exports.general = public_users;
