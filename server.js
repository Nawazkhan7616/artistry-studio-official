require('dotenv').config(); // Load the hidden variables from .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
// Dynamic port for publishing (Render/Railway) or localhost 5000
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static(__dirname)); 

// 1. DATABASE CONNECTION (Using Secure Environment Variable)
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Securely connected to Cloud MongoDB!"))
    .catch(err => console.error("❌ Connection Error:", err));

// 2. DATA SCHEMAS
const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String, 
    service: String,
    date: String,
    time: String,
    createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    imageUrl: String,
    date: { type: Date, default: Date.now }
});

// 3. MODELS
const Booking = mongoose.model('Booking', bookingSchema);
const Blog = mongoose.model('Blog', blogSchema);

// --- STATIC FILE ROUTES ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'artist.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'booking.html'));
});

// --- BOOKING API ROUTES ---
app.get('/api/bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find().sort({ createdAt: -1 });
        res.json(allBookings);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch bookings" });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            service: req.body.service,
            date: req.body.date,
            time: req.body.time
        });
        await newBooking.save();
        res.status(201).json({ message: "Booking received and saved!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save to database" });
    }
});

app.delete('/api/bookings/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Server error during deletion" });
    }
});

// --- BLOG API ROUTES ---
app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
});

app.delete('/api/blogs/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});