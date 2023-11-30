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
  const { url, expirationDate,qrapi } = req.body;
  

  const newLink = new Link({
    url,
    expirationDate: new Date(expirationDate),
  });

  try {
    const savedata=await newLink.save();

    const qrCode = await QRCode.toDataURL(`${qrapi}/comeon/${savedata._id}`);
    res.json({ qrCode });
    console.log("saved"+" "+savedata._id);
  } catch (error) {
    console.error('Error storing link:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/comeon/:id', async (req, res) => {
  const objectId = req.params.id;
  const currentDate = new Date();
  console.log(objectId)
  try {
    // Find the document by ObjectID
    const foundData = await Link.findById(objectId);

    if (!foundData) {
      res.status(404).json({ message: 'Data not found' });
      return;
    }
    if(currentDate>foundData.expirationDate)
    {
      res.status(300).json({message:'qr code has been expired'});
    }

    // res.status(200).json({ message: 'Data retrieved successfully', data: foundData });
    res.redirect(foundData.url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
  console.log("get function called");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

