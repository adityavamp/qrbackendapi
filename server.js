const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = 'mongodb+srv://Aditya:Aditya@cluster0.biqxk2d.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const linkSchema = new mongoose.Schema({
  url: String,
  expirationDate: Date,
});

const Link = mongoose.model('Link', linkSchema);

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.post('/storeLink', async (req, res) => {
  const { url, expirationDate } = req.body;

  const newLink = new Link({
    url,
    expirationDate: new Date(expirationDate),
  });

  try {
    await newLink.save();

    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode });
    console.log("saved");
  } catch (error) {
    console.error('Error storing link:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/redirect/:id', async (req, res) => {
  // ... (unchanged code)
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

