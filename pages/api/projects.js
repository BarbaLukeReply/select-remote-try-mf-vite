// pages/api/projects.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const filePath = path.join(process.cwd(), "projects.json");
  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);

  res.status(200).json(data);
}
