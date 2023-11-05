require('dotenv').config();
const express = require("express");
const app = express();
const port = 2000;
const products = require("./routes/product.router.js"); 
const connect = require("./schemas/index.js");
connect();


app.use(express.json());
app.use("/api", products);


app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
})
