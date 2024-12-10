require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importing CORS
const authRoutes = require('./routes/authRoutes'); // Import the routes

const app = express();

// Enable CORS for all routes
app.use(cors());  // This allows cross-origin requests from your frontend

app.use(express.json());

// Use routes from authRoutes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
