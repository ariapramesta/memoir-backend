import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const user = await registerUser({ email, name, password });

    res.status(201).json({
      message: "Account Created",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser({ email, password });

    res.status(200).json({
      message: "Login Successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
