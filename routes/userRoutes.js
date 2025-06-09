import express from "express";
import {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    getUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.get("/:id",   getUserById);

export default router;
