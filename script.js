const mongoose = require('mongoose');
require('dotenv').config();


// MongoDB Connection
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        console.log('Database connected!');
    })
    .catch((error) => {
        console.log('Database connection error := ', error);
    });



