const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bodyParser = require('body-parser');

let users = [];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
//     return users.some(user => user.username === username);
// }

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

regd_users.use(bodyParser.json()); // Middleware to parse JSON bodies

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });
    req.session.token = token;
    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required." });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        const username = decoded.username;
        const { review } = req.body;
        const { isbn } = req.params;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found." });
        }

        let bookReviews = books[isbn].reviews || {};
        bookReviews[username] = review;
        books[isbn].reviews = bookReviews;

        return res.status(200).json({ message: "Review added/modified successfully." });
    } catch (error) {
        return res.status(401).json({ message: "Invalid authorization token." });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required." });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        const username = decoded.username;
        const { isbn } = req.params;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found." });
        }

        let bookReviews = books[isbn].reviews || {};
        if (!bookReviews[username]) {
            return res.status(404).json({ message: "Review not found." });
        }

        delete bookReviews[username];
        books[isbn].reviews = bookReviews;

        return res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        return res.status(401).json({ message: "Invalid authorization token." });
    }
});


module.exports.authenticated = regd_users;
//module.exports.isValid = isValid;
module.exports.users = users;
module.exports = { authenticated: regd_users,users };