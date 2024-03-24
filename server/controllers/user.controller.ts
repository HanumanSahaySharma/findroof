import bcryptjs from "bcryptjs";
import User from "../models/user.model";
import { errorHandler } from "../utils/error";
import { Request, Response, NextFunction } from "express";

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to update profile"));
  }
  if (req.body.password) {
    if (req.body.password.length < 5) {
      return next(errorHandler(400, "Password must be at least 5 charectors"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.name) {
    if (req.body.name.length < 2 || req.body.name > 20) {
      return next(errorHandler(400, "Name must be between 2 and 20 charectors"));
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          profileImage: req.body.profileImage,
        },
      },
      {
        new: true,
      }
    );
    const { password: pass, ...rest } = updatedUser._doc;
    return res.status(200).json({ user: rest, success: true, message: "Profile updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to update profile"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({ message: "Account deleted successfully.", success: true });
  } catch (error) {
    next(error);
  }
};
