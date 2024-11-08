const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');  // Required for static file serving
const app = express();
const port = 3000;

// MongoDB connection setup
const url = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority';
const client = new MongoClient(url);
const dbName = 'yourDatabase';

// Define API route BEFORE static files
app.get('/data', async (req, res) => {
  try {
    await client.connect();
    console.log("Connected to MongoDB"); // For debugging
    const db = client.db(dbName);
    const collection = db.collection('yourCollection');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error("Database connection error:", err); // Log detailed error
    res.status(500).send('Error connecting to the database');
  } finally {
    await client.close();
  }
});

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
