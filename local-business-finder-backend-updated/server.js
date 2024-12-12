
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/localBusinessFinder';
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
const favoriteLocationRoutes = require('./routes/favoriteLocationRoutes');
app.use('/api/favorites', favoriteLocationRoutes);
const businessRoutes = require('./routes/businessRoutes');
app.use('/api/businesses', businessRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
