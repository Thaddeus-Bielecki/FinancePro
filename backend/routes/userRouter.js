import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updateUserMembership,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/logout', logoutUser);
router.post('/auth', authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/updateMember')
  .put(protect, updateUserMembership);
  // .put(updateUserMembership);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

router.route('/forgot-password')
  .post(forgotPassword);

// router.route('/reset-password')
//   .put(resetPassword);

router.route('/resetPassword')
  .put((req, res, next) => {
    console.log('Reset password route hit');
    next();
  }, resetPassword);

export default router;