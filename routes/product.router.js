const express = require("express");
const router = express.Router();
const productSchema = require("../schemas/product.schema.js");

// 상품 목록 조회 api
router.get("/product", async (req, res) => {
  const productRecord = await productSchema.find({}).sort({"_id":-1});
  const newPrd = productRecord.map((data) => {
      const {productId, title, author, status, date} = data;
         return {
             productId,
             title,
             author,
             status,
             date
         }
     })
  res.status(200).json({newPrd});
})

// 상품 상세 조회 api
router.get("/product/:productID",  async (req, res) => {
  const { productID } = req.params;
  const productRecord = await productSchema.find({}).sort({"_id":-1});
  console.log(productID);
  const [detail] = productRecord.filter((products) => products.productId === Number(productID));
  const {title, content, author, status, date} = detail;
  res.json({title, content, author, status, date});
});

// 상품 작성 api
router.post("/product", async (req, res) => {
    const {productId, title, content, author, password} = req.body;
    console.log(req.body);
    const date1 = new Date();
    const date = date1.toLocaleString();
    const status = "판매 중";
    const prds = await productSchema.find({ productId });
    if (prds.length) {
      return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    }
    if(password) {
      const createdproduct = await productSchema.create({productId, title, content, author, status, date, password});
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
  const existsproduct = await productSchema.find({ productId: Number(productId) });
  console.log(existsproduct);
  const productPwd = existsproduct[0].password;
  console.log(productPwd);
  if (existsproduct.length && password === productPwd) {
    await productSchema.updateOne({ productId: Number(productId), password: String(password) }, 
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
  const existsproduct = await productSchema.find({ productId });
  console.log(existsproduct);
  const productPwd = existsproduct[0].password;
  console.log(productPwd);
  if (existsproduct.length > 0 && password === productPwd) {
    await productSchema.deleteOne({ productId });
    res.json({ result: "success", Message: "성공적으로 삭제되었습니다." });
  } else if (existsproduct.length === 0) {
    res.status(400).json({ success: false, errorMessage: "상품 조회에 실패하였습니다." });
  } else {
    res.status(401).json({ success: false, errorMessage: "비밀번호가 일치하지 않습니다." });
  }
});

module.exports = router;










//  // 토요일 8시에 완성 버전1
//  // 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜 조회하기
//  
//  const express = require("express");
//  const router = express.Router();
//  
//  // 상품 목록
//  const products = [
//      {
//        productId: 1,
//        title: "후라이드치킨",
//        content: "전통 그대로의 맛",
//        author: "익명4",
//        status: "판매 중",
//        date: "2020-08-25",
//      },
//      {
//        productId: 2,
//        title: "양념치킨",
//        content: "단짠단짠의 원조",
//        author: "익명3",
//        status: "판매 중",
//        date: "2020-06-22",
//      },
//      {
//        productId: 3,
//        title: "간장치킨",
//        content: "자극적인 그 맛",
//        author: "판매 완료",
//        status: "익명2",
//        date: "2022-01-15",
//      },
//      {
//        productId: 4,
//        title: "마늘치킨",
//        content: "새롭게 탄생한 그 녀석들",
//        author: "판매 중",
//        status: "익명1",
//        date: "2023-11-02",
//      },
//    ];
// 
// 
//  // 상품 목록 조회 api
//  router.get("/product", (req, res) => {
//   const newPrd = products.map((data) => {
//       const {productId, title, content, author, status, date} = data;
//       return {
//           productId,
//           title,
//           author,
//           status,
//           date
//       }
//   })
//    res.status(200).json({newPrd});
//  })
// 
// 
//  // 상품 상세 조회 api
//  router.get("/product/:productId", (req, res) => {
//   // 구조분해할당
//   const { productId } = req.params;
//   console.log(productId);
//   const [detail] = products.filter((products) => products.productId === Number(productId));
//   res.json({ detail });
//  });
// 
// 
// 
//  // 상품 작성 api
//  const productSchema = require("../schemas/product.schema.js");
//  
//  router.post("/product", async (req, res) => {
//        const {productId, title, content, author, status, date, password} = req.body;
//        console.log(req.body);
//  
//     const prds = await productSchema.find({ productId });
//     if (prds.length) {
//       return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
//     }
//   
//     const createdproduct = await productSchema.create({productId, title, content, author, status, date, password});
//   
//     res.json({ products: createdproduct });
//  });
// 
//  // 상품 수정 api
//  router.put("/product/:productId/", async (req, res) => {
//    const { productId } = req.params;
//    const {title, content, author, status, date, password} = req.body;
//    const existsproduct = await productSchema.find({ productId: Number(productId) });
//    console.log(existsproduct);
//    const productPwd = existsproduct[0].password;
//    console.log(productPwd);
//    if (existsproduct.length && password === productPwd) {
//      await productSchema.updateOne({ productId: Number(productId), password: String(password) }, 
//                                    { $set: { title: title , content: content, author: author, status: status, date: date} })
//                                    res.status(200).json({ success: true });
//    } else if (existsproduct.length === 0){
//      res.status(400).json({ success: false, errorMessage: "상품 조회에 실패하였습니다." });
//    } else {
//      res.status(400).json({ success: false, errorMessage: "비밀번호가 일치하지 않습니다." });
//    }
//   });
//  
//  
//  
//  // 상품 삭제 api
//  router.delete("/product/:productId/", async (req, res) => {
//    const { productId } = req.params;
//    const {password} = req.body;
//    const existsproduct = await productSchema.find({ productId });
//    console.log(existsproduct);
//    const productPwd = existsproduct[0].password;
//    console.log(productPwd);
//    if (existsproduct.length > 0 && password === productPwd) {
//      await productSchema.deleteOne({ productId });
//      res.json({ result: "success" });
//    } else if (existsproduct.length === 0) {
//      res.status(400).json({ success: false, errorMessage: "상품 조회에 실패하였습니다." });
//    } else {
//      res.status(400).json({ success: false, errorMessage: "비밀번호가 일치하지 않습니다." });
//    }
//    
//  });
//  
//  
//  
//  
//  module.exports = router;