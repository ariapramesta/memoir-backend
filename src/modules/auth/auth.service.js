import { prisma } from "../../lib/prisma.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";

export const registerUser = async ({ email, name, password }) => {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) throw new Error("Email already in used");

  const hashedPassword = await hashPassword(password);

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

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("Email or Password Invalid");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Email or Password Invalid");

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};
