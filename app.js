require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const botRoutes = require('./routes/botRoutes');
const fuzz = require('fuzzball');

// express app
const app = express();
const PORT = process.env.PORT || 3030;


// create a rate limiter for POST requests
const postLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 10 minutes
    max: 50, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`${new Date().toISOString()} :: Server started on port ${PORT}`);
});

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded( { extended: true}));
app.use(morgan('dev'));
app.use(express.json());
app.use(postLimiter);

// routes
app.get('/', (req, res) =>{
    res.render('index', {title: 'Home'})
});
app.get('/test', (req, res) =>{
    res.render('test', {title: 'Home'})
});

// bot routes
app.use(botRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
}); 