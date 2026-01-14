const express = require('express')
const Business = require('../models/Business')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  const { category, city, search } = req.query
  const q = {}
  if (category) q.category = category
  if (city) q['location.city'] = city
  if (search) q.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }]
  res.json(await Business.find(q).sort({ averageRating: -1 }))
})

router.get('/:id', async (req, res) => {
  const business = await Business.findById(req.params.id)
  if (!business) return res.sendStatus(404)
  res.json(business)
})

router.post('/', auth, adminAuth, async (req, res) => {
  res.status(201).json(await Business.create(req.body))
})

router.put('/:id', auth, adminAuth, async (req, res) => {
  const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!business) return res.sendStatus(404)
  res.json(business)
})

router.delete('/:id', auth, adminAuth, async (req, res) => {
  const business = await Business.findByIdAndDelete(req.params.id)
  if (!business) return res.sendStatus(404)
  res.json({ ok: true })
})

module.exports = router
