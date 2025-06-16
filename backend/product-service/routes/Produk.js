const express = require("express");
const Produk = require("../models/Produk");
const { authenticateJWT } = require("../middleware/authenticateJWT");
const { getAllProduk, getProdukById, addProduk, editProdukById, deleteProdukById } = require("../controllers/ProdukController");

const router = express.Router();

router.get("/", authenticateJWT, getAllProduk);
router.get("/:id", authenticateJWT, getProdukById);
router.post("/", authenticateJWT, addProduk);
router.put("/:id", authenticateJWT, editProdukById);
router.delete("/:id", authenticateJWT, deleteProdukById);

module.exports = router;
