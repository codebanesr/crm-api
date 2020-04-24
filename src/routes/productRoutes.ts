import express from "express";
const router = express.Router();
import { upload } from "../util/multerOpts";
import * as productController from "../controllers/product"

router.get("/", productController.findAll);

router.post("/", upload.single("productImage"), productController.insertOne);

router.get("/:productId", productController.findOneById);

router.patch("/:productId", productController.patch);

router.delete("/:productId", productController.deleteOne);

export default router;