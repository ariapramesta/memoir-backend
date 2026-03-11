import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startWith("Bearer "))
    return res.status(401).json({ message: "Unauthorize" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SERCRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or exipred token" });
  }
};
