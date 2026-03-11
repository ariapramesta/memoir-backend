import { prisma } from "../../lib/prisma.js";

export const create = async ({ title, content, userId }) => {
  if (content === null || content === undefined)
    throw new Error("Content are required");

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId,
    },
  });

  return note;
};

export const getAll = async (userId) => {
  const notes = await prisma.note.findMany({ where: { userId } });
  return notes;
};

export const getOne = async (noteId, userId) => {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  return note;
};
