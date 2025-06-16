const express = require("express");
const { getAllStorage, getStorageById, addStorage, editStorageById, deleteStorageById } = require("../controllers/StorageController");

const router = express.Router();

router.get("/", getAllStorage);
router.get("/:id", getStorageById);
router.post("/", addStorage);
router.put("/:id", editStorageById);
router.delete("/:id", deleteStorageById);

module.exports = router;
