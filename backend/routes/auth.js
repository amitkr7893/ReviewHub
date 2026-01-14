const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (await User.findOne({ email })) return res.sendStatus(400)
  await User.create({ name, email, password: await bcrypt.hash(password, 10) })
  res.sendStatus(201)
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) return res.sendStatus(401)
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  )
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

module.exports = router
