const axios = require("axios");
const express = require("express");
const router = express.Router();
const BatchProduk = require("../models/BatchProdukModel");
const Produk = require("../models/ProdukModel");
const User = require("../models/User");
const { deleteBatchProdukById, editBatchProdukById, addBatchProduk, getBatchProdukById, getAllBatchProduk } = require("../controllers/BatchProdukController");

router.get("/", getAllBatchProduk);
router.get("/:id", getBatchProdukById);
router.post("/", addBatchProduk);
router.put("/:id", editBatchProdukById);
router.delete("/:id", deleteBatchProdukById);

module.exports = router;
