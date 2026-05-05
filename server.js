const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./src/config/db');
require('dotenv').config();

// Importing routes

const authRoutes = require('./src/routes/authRoutes');

app.use(cors());
app.use(express.json());    


// Database connection
connectDB();

// Routes

app.use('/api/auth',authRoutes);


// Server starting

app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});
