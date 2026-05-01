const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req,res) => {
  res.json({message: "Backend is running"})
})

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})

.catch((err) => console.error("MongoDB error:", err));