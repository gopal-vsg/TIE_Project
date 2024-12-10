require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importing CORS
const authRoutes = require('./routes/authRoutes');

const app = express();

// Enable CORS for all routes
app.use(cors());  // This allows cross-origin requests from your frontend

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
