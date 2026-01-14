const mongoose = require('mongoose')
require('dotenv').config()
const Business = require('./models/Business')

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/review-platform')

const businesses = [
  {
    name: 'Pizza Paradise',
    category: 'Restaurant',
    description: 'Best pizza in town with authentic Italian recipes',
    location: { address: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001' }
  },
  {
    name: 'Coffee Corner',
    category: 'Cafe',
    description: 'Cozy cafe with the best coffee and pastries',
    location: { address: '456 Oak Avenue', city: 'New York', state: 'NY', zipCode: '10002' }
  },
  {
    name: 'Tech Repair Pro',
    category: 'Service',
    description: 'Professional electronics repair service',
    location: { address: '789 Tech Street', city: 'New York', state: 'NY', zipCode: '10003' }
  },
  {
    name: 'Fashion Boutique',
    category: 'Shop',
    description: 'Trendy clothing and accessories',
    location: { address: '321 Style Boulevard', city: 'New York', state: 'NY', zipCode: '10004' }
  }
]

Business.insertMany(businesses)
.then(() => process.exit())
.catch(() => process.exit(1))
