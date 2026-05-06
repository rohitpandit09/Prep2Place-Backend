const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./src/config/db');
require('dotenv').config();

// Importing routes

const authRoutes = require('./src/routes/authRoutes');
const roadmapRoutes = require('./src/routes/roadmapRoutes');
const practiceAIRoutes = require('./src/routes/practiceAIRoutes');

app.use(cors());
app.use(express.json());    


// Database connection
connectDB();

// Routes

app.use('/api/auth',authRoutes);
app.use('/api/get',roadmapRoutes)
app.use('/api/practice',practiceAIRoutes);


// Server starting

app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});
