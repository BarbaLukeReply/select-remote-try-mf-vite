import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const selectedProjects = req.body;
    const commands = [];
    const names = [];
    const colors = [];

    // Read the JSON file
    const filePath = path.join(process.cwd(), 'projects.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(fileData);

    // Get the commands for the selected projects
    for (const project of projects) {
      if (selectedProjects.includes(project.name) || project.name === 'host') {
        // Assuming each project has a 'directory', 'scripts', 'name', and 'color' property
        const command = `cd ${project.directory}; ${project.scripts.join('; ')}`;
        commands.push(command);
        names.push(project.name);
        colors.push(project.color);
      }
    }

    // Generate the concurrently command
    const concurrentlyCommand = `concurrently --names "${names.join(',')}" -c "${colors.join(',')}" ${commands.map(cmd => `'${cmd}'`).join(' ')}`;

    // Write the command to data.txt
    const dataFilePath = path.join(process.cwd(), 'data.txt');
    fs.writeFileSync(dataFilePath, concurrentlyCommand);

    res.status(200).json({ message: 'Saved successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}