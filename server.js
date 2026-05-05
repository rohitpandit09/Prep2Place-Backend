const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./src/config/db');
require('dotenv').config();

app.use(cors());
app.use(express.json());    


// Database connection
connectDB();

// Routes

// Server starting

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
