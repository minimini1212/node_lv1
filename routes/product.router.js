const express = require("express");
const router = express.Router();
const productSchema = require("../schemas/product.schema.js");

// 상품 목록 조회 api
router.get("/product", async (req, res) => {
  const productRecord = await productSchema.find({}).sort({"_id":-1});
  const newPrd = productRecord.map((data) => {
      const {title, author, status, date, _id} = data;
         return {
             title,
             author,
             status,
             date,
             _id
         }
     })
  res.status(200).json({newPrd});
})

// 상품 상세 조회 api
router.get("/product/:productID",  async (req, res) => {
  const { productID } = req.params;
  console.log(productID);
  const [detail] = await productSchema.find({ _id: String(productID) });
  const {title, content, author, status, date, _id} = detail;
  res.json({title, content, author, status, date, _id});
});

// 상품 작성 api
router.post("/product", async (req, res) => {
    const {title, content, author, password} = req.body;
    console.log(req.body);
    const date1 = new Date();
    const date = date1.toLocaleString();
    const status = "판매 중";
    if(password) {
      const createdproduct = await productSchema.create({title, content, author, status, date, password});
      res.json({ products: createdproduct });
    } else {
      return res.status(401).json({ success: false, errorMessage: "비밀번호를 입력하지 않았습니다." });
    }
  });
  
// 상품 수정 api
router.put("/product/:productId/", async (req, res) => {
  const { productId } = req.params;
  
  const {title, content, author, status, password} = req.body;
  const date1 = new Date();
  const date = date1.toLocaleString();
  const existsproduct = await productSchema.find({ _id: String(productId) });
  const productPwd = existsproduct[0].password;
  console.log(productPwd);
  console.log(existsproduct[0]._id);
  if (existsproduct.length && password === productPwd) {
    await productSchema.updateOne({ _id: String(productId), password: String(password) }, 
                                  { $set: { title: title , content: content, author: author, 
                                  status: status, date: date} });
    res.status(200).json({ success: true, Message: "상품 수정에 성공했습니다."});
  } else if (existsproduct.length === 0){
    res.status(400).json({ success: false, errorMessage: "상품 조회에 실패하였습니다." });
  } else {
    res.status(401).json({ success: false, errorMessage: "비밀번호가 일치하지 않습니다." });
  }
});

// 상품 삭제 api
router.delete("/product/:productId/", async (req, res) => {
  const { productId } = req.params;
  const {password} = req.body;
  const existsproduct = await productSchema.find({ _id: String(productId) });
  console.log(existsproduct);
  const productPwd = existsproduct[0].password;
  console.log(productPwd);
  if (existsproduct.length > 0 && password === productPwd) {
    await productSchema.deleteOne({ _id: String(productId) });
    res.json({ result: "success", Message: "성공적으로 삭제되었습니다." });
  } else if (existsproduct.length === 0) {
    res.status(400).json({ success: false, errorMessage: "상품 조회에 실패하였습니다." });
  } else {
    res.status(401).json({ success: false, errorMessage: "비밀번호가 일치하지 않습니다." });
  }
});

module.exports = router;
