const express = require('express');
const morgan = require('morgan');
const helment = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const middleware = require('./middleware');
const logs = require('./api/logs');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(morgan('common'));
app.use(helment());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: "Hello World!",
    });
});

app.use('/api/logs', logs);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});