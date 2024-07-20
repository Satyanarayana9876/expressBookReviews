const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.use(express.json());

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (!doesExist(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  } else {
    return res.status(400).json({ message: "User already exists!" });
  }
});

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Get the book list available in the shop (Task 10)
public_users.get('/', async (req, res) => {
    try {
      // Assuming you have an endpoint to fetch books
      const response = await axios.get('/');
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
// Get book details based on ISBN (Task 11)
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`/isbn/${isbn}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Get book details based on author (Task 12)
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const response = await axios.get(`/author/${author}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Get book details based on title (Task 13)
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const response = await axios.get(`/title/${title}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`/review/${isbn}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports.general = public_users;
