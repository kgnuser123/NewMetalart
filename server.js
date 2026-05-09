require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./confiq/db');  // ← fixed path

const bannerRoutes = require('./routes/bannerRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const navbarRoutes = require('./routes/navbarRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const contactRoutes = require('./routes/contactRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const footerRoutes = require('./routes/footerRoutes');
const videoRoutes = require('./routes/videoRoutes');
const colorRoutes = require('./routes/colorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const homeRoutes = require('./routes/storyRoutes'); 
const storyRoutes = require('./routes/storyRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/banner', bannerRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact-settings', contactRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stories', storyRoutes); // Yeh base path hai
app.use('/api/team-gallery', require('./routes/teamGallery'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));