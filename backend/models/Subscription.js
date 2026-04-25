const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: String,
  caId: String,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);