import { serialize } from "cookie";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", serialize("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/login",
  }));

  res.status(200).json({ message: "Logged out" });
}
