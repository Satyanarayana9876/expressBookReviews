const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.use(express.json());

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body; // Extract username and password from request body

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Check if the user does not already exist
  if (!doesExist(username)) {
    // Add the new user to the users array
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
    } 
    else {
        return res.status(404).json({message: "User already exists!"});
    }
  
  // Return error if username or password is missing
  //return res.status(300).json({message: "Yet to be implemented"});
});

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  for (const isbn in books) {
      if (books[isbn].author === author) {
          booksByAuthor.push({ isbn, ...books[isbn] });
      }
  }

  if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
  } else {
      res.status(404).json({ message: "Author not found" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];

  for (const isbn in books) {
      if (books[isbn].title === title) {
        booksByTitle.push({ isbn, ...books[isbn] });
      }
  }

  if (booksByTitle.length > 0) {
      res.json(booksByTitle);
  } else {
      res.status(404).json({ message: "Title not found" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
