require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const channelRoutes = require('./routes/channelRoutes');

const app = express();

// Enable CORS for all routes
app.use(cors()); // This allows cross-origin requests from your frontend

app.use(express.json());

// Auth routes for login/register
app.use('/api/auth', authRoutes);

// Data routes for bookings (requires authentication)
app.use('/api/data', dataRoutes);

app.use('/api/channel', channelRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
