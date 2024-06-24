import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data.txt');

  if (req.method === 'POST') {
    const { data } = req.body;
    fs.writeFileSync(filePath, data);
    res.status(200).json({ message: 'Data written successfully' });
  } else if (req.method === 'GET') {
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).json({ data });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}