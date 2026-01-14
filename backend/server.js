const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fs = require('fs')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')

mongoose.connect('mongodb://localhost:27017/review-platform')
.then(() => console.log('MongoDB connected'))
.catch(e => console.log(e))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/businesses', require('./routes/business'))
app.use('/api/reviews', require('./routes/review'))

app.get('/', (req, res) => res.json({ message: 'Server is running' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
