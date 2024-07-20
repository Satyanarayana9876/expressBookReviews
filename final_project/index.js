const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general1.js').general;
//const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({
    secret:"fingerprint_customer",
    resave: true, 
    saveUninitialized: true
}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (!req.session || !req.session.token) {
    return res.status(401).json({ message: "Unauthorized: No session token" });
  }

  const token = req.session.token;
  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    next();
  });

});
 
const books = require('./router/booksdb.js'); // Assume this contains the books data

app.get('/', (req, res) => {
  res.json(books);
});

app.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.json(books[isbn]);
});


const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running at Port ${PORT}`));
