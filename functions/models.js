/* Ignore eslint all*/
const mongoose = require("mongoose");

const SearchLogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const SearchLog = mongoose.model("SearchLog", SearchLogSchema);

module.exports = SearchLog;
