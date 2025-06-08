import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
export default router;