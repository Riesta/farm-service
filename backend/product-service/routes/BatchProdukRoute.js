const axios = require("axios");
const express = require("express");
const router = express.Router();
const BatchProduk = require("../models/BatchProdukModel");
const Produk = require("../models/ProdukModel");
const User = require("../models/User");
const { authenticateJWT } = require("../middleware/authenticateJWT");
const { deleteBatchProdukById, editBatchProdukById, addBatchProduk, getBatchProdukById, getAllBatchProduk } = require("../controllers/BatchProdukController");

router.get("/", authenticateJWT, getAllBatchProduk);
router.get("/:id", authenticateJWT, getBatchProdukById);
router.post("/", authenticateJWT, addBatchProduk);
router.put("/:id", authenticateJWT, editBatchProdukById);
router.delete("/:id", authenticateJWT, deleteBatchProdukById);

module.exports = router;
