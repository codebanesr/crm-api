
import express from "express";
import * as fileController from "../controllers/file";
import multer from "multer";

const upload = multer({
    dest: 'uploads/'
})

const router = express.Router();

router.post("/",  upload.single('csvfile'), fileController.uploadFile);

export default router;