import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hash = async (item) => {
  return bcrypt.hash(item, SALT_ROUNDS);
};

export const compare = async (plainItem, hashedItem) => {
  return bcrypt.compare(plainItem, hashedItem);
};
