const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    amount: Number,
    date: Date,
    description: String,
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
