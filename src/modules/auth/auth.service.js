import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";
import { compare, hash } from "../../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

export const registerService = async ({ email, name, password }) => {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) throw new Error("Email already in used");

  const hashedPassword = await hash(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  const payload = {
    sub: user.id,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    data: user,
    meta: {
      accessToken,
      refreshToken,
    },
  };
};

export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("Email or Password Invalid");

  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new Error("Email or Password Invalid");

  const payload = {
    sub: user.id,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    meta: {
      accessToken,
      refreshToken,
    },
  };
};

export const logoutService = async (refreshToken) => {
  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh Token missing");

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
  } catch {
    throw new Error("Invalid of expired token");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) throw new Error("Token not found");

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    throw new Error("Refresh token expired");
  }

  const payload = {
    sub: decoded.sub,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.delete({ where: { token: refreshToken } });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.sub,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    newAccessToken,
    newRefreshToken,
  };
};
