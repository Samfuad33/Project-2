
const express = require('express');
const FavoriteLocation = require('../models/FavoriteLocation');

const router = express.Router();

// Add a favorite location
router.post('/', async (req, res) => {
    const { name, address, lat, lng } = req.body;

    try {
        const newFavorite = new FavoriteLocation({ name, address, lat, lng });
        await newFavorite.save();
        res.status(201).json(newFavorite);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all favorite locations
router.get('/', async (req, res) => {
    try {
        const favorites = await FavoriteLocation.find();
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a favorite location
router.delete('/:id', async (req, res) => {
    try {
        await FavoriteLocation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Favorite location deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
