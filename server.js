const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const invoice = require('./routes/invoice.routes');

const mongodbURL = process.env.MONGO_DB_URL;

const app = express();

mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.on('open', () => {
    console.log('connected to db');
    let port = process.env.PORT || 9000;
    app.listen(port, () => {
        console.log('server started at port', port);
    });
});

app.use(express.json());
app.use(cors());
app.use('/api/invoice', invoice);

