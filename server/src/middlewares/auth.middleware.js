import jwt from "jsonwebtoken";
import "dotenv/config";
import { ErrorResponse } from "../utils/errorResponse.js";
const JWT_SECRET = process.env.JWT_SECRET;

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    new ErrorResponse(401, {
      code: "",
      message: "Authorization Header missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    new ErrorResponse(401, { code: "", message: "Invalid or Expired Token" });
  }
};
