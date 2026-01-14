const express = require('express')
const multer = require('multer')
const path = require('path')
const Review = require('../models/Review')
const Business = require('../models/Business')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads'),
    filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  })
})

router.get('/business/:id', async (req, res) => {
  const reviews = await Review.find({ business: req.params.id, status: 'approved' })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
  res.json(reviews)
})

router.get('/pending', auth, adminAuth, async (req, res) => {
  const reviews = await Review.find({ status: 'pending' })
    .populate('user', 'name email')
    .populate('business', 'name')
  res.json(reviews)
})

router.post('/', auth, upload.array('photos', 5), async (req, res) => {
  const { businessId, quality, service, value, comment } = req.body
  const exists = await Review.findOne({ business: businessId, user: req.userId })
  if (exists) return res.status(400).json({ message: 'Already reviewed' })

  const review = await Review.create({
    business: businessId,
    user: req.userId,
    rating: { quality, service, value },
    comment,
    photos: req.files?.map(f => f.path) || []
  })

  res.status(201).json(review)
})

router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  if (req.body.status === 'approved') await updateRating(review.business)
  res.json(review)
})

router.delete('/:id', auth, async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) return res.sendStatus(404)
  if (req.userRole !== 'admin' && review.user.toString() !== req.userId) return res.sendStatus(403)
  await review.deleteOne()
  await updateRating(review.business)
  res.json({ ok: true })
})

async function updateRating(businessId) {
  const reviews = await Review.find({ business: businessId, status: 'approved' })
  if (!reviews.length) return
  let q = 0, s = 0, v = 0
  reviews.forEach(r => {
    q += r.rating.quality
    s += r.rating.service
    v += r.rating.value
  })
  await Business.findByIdAndUpdate(businessId, {
    averageRating: ((q + s + v) / (reviews.length * 3)).toFixed(1),
    totalReviews: reviews.length
  })
}

module.exports = router
