import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { errorHandler } from "../utils/error";
import { Request, Response, NextFunction } from "express";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  let { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return next(errorHandler(403, "This email is already registered."));
    } else {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = bcryptjs.hashSync(password, salt);
      password = hashedPassword;
      const newUser = new User({ username, email, password });
      await newUser.save();
      return res.status(201).json({ message: "Signup successfully." });
    }
  } catch (error: any) {
    return next(errorHandler(403, error.message));
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found."));
    }
    const comparePassword = bcryptjs.compareSync(password, user.password);
    if (!comparePassword) {
      return next(errorHandler(404, "Invalid password."));
    }
    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`, { expiresIn: "1h" });
    const { password: userPassword, ...userInfo } = user._doc;
    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      user: userInfo,
      message: "SignIn successfully.",
      success: true,
    });
  } catch (error: any) {
    return next(errorHandler(400, error.message));
  }
};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).clearCookie("token").json({
      message: "Signout successfully.",
      status: true,
    });
  } catch (error: any) {
    return next(errorHandler(403, error.message));
  }
};

export const google = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "SignUp with Google successfully" });
};
