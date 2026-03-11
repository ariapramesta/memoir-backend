import { StrictMode } from "react";
import {
  loginService,
  logoutService,
  refreshService,
  registerService,
} from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const userDatas = await registerService({ email, name, password });

    res.cookie("refreshToken", userDatas.meta.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account Created",
      data: userDatas.data,
      accessToken: userDatas.meta.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userDatas = await loginService({ email, password });

    res.cookie("refreshToken", userDatas.meta.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
      data: userDatas.data,
      accessToken: userDatas.meta.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("token: ", refreshToken);

    if (refreshToken) await logoutService(refreshToken);

    res.clearCookie("refreshToken");

    res.json({ message: "Logout Successful" });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      res
        .status(401)
        .json({ message: "Refresh Token are missing! Please Login again" });

    const tokens = await refreshService(refreshToken);

    res.cookie("refreshToken", tokens.newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ accessToken: tokens.newAccessToken });
  } catch (error) {
    next(error);
  }
};
