// 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    require: true,
   //  unique: true,
  },
  content: {
    type: String
  },
  author: {
    type: String
  },
  status: {
    type: String
  },
  date: {
    type: String
  },
  password: {
    type: String
  }
});

module.exports = mongoose.model("product", productSchema);

