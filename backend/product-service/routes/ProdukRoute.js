const express = require("express");
const { getAllProduk, getProdukById, addProduk, editProdukById, deleteProdukById } = require("../controllers/ProdukController");

const router = express.Router();

router.get("/", getAllProduk);
router.get("/:id", getProdukById);
router.post("/", addProduk);
router.put("/:id", editProdukById);
router.delete("/:id", deleteProdukById);

module.exports = router;
