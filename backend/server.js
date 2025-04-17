const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./config/database')
require("dotenv").config();
const TransactionRoutes = require('./controllers/transactionController')

// middleware
app.use(cors())
app.use(express.json())

// Connect to database
connectDB()

// routes
app.use('/transactions', TransactionRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})

