import express from "express";
const router = express.Router();
import { upload } from "../util/multerOpts";


import Product from "../models/product";

router.get("/", );

router.post("/", upload.single("productImage"), );

router.get("/:productId", );

router.patch("/:productId", );

router.delete("/:productId", );

module.exports = router;