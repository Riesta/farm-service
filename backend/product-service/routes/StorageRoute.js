const express = require("express");
const { authenticateJWT } = require("../middleware/authenticateJWT");
const { getAllStorage, getStorageById, addStorage, editStorageById, deleteStorageById } = require("../controllers/StorageController");

const router = express.Router();

router.get("/", authenticateJWT, getAllStorage);
router.get("/:id", authenticateJWT, getStorageById);
router.post("/", authenticateJWT, addStorage);
router.put("/:id", authenticateJWT, editStorageById);
router.delete("/:id", authenticateJWT, deleteStorageById);

module.exports = router;
