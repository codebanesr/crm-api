import express from "express";
import * as productController from "../controllers/product";
import { upload } from "../util/multerOpts";
const router = express.Router();

router.get("/", productController.findAll);

router.get("/:productId", productController.findOneById);

router.patch("/:productId", productController.patch);

router.delete("/:productId", productController.deleteOne);

router.post("/", upload.single("productImage"), productController.insertOne);

export default router;