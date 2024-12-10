
const express = require('express');
const Business = require('../models/Business');

const router = express.Router();

// Create a business
router.post('/', async (req, res) => {
    const { name, location, category, rating, description } = req.body;

    try {
        const newBusiness = new Business({ name, location, category, rating, description });
        await newBusiness.save();
        res.status(201).json(newBusiness);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read all businesses
router.get('/', async (req, res) => {
    try {
        const businesses = await Business.find();
        res.json(businesses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a business
router.put('/:id', async (req, res) => {
    try {
        const updatedBusiness = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBusiness);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a business
router.delete('/:id', async (req, res) => {
    try {
        await Business.findByIdAndDelete(req.params.id);
        res.json({ message: 'Business deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
