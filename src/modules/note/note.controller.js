import { create, getAll, getOne } from "./note.service.js";

export const createNote = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { title, content } = req.body;

    const data = await create({ title, content, userId });

    res.status(201).json({ message: "Note Created", data });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    const data = await getAll(userId);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.sub;

    const data = await getOne(noteId, userId);

    if (data === null) res.status(404).json({ message: "Cannot find note" });

    res.json(data);
  } catch (error) {
    next(error);
  }
};
