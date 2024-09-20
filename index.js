// pages/api/students.js
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'students.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Leer el archivo y devolver los estudiantes
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error reading file" });
      }
      const students = JSON.parse(data);
      res.status(200).json(students);
    });
  } else if (req.method === 'POST') {
    const { email, first_name, last_name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error reading file" });
      }
      const studentsData = JSON.parse(data);
      const newUser = {
        id: studentsData.length + 1,
        first_name,
        last_name,
        email,
      };

      studentsData.push(newUser);
      const updatedData = JSON.stringify(studentsData, null, 2);

      fs.writeFile(dataPath, updatedData, 'utf-8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error writing to file" });
        }
        res.status(201).json({ message: "Student added successfully" });
      });
    });
  } else if (req.method === 'PUT') {
    const studentId = parseInt(req.query.id, 10);

    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading data file' });
      }
      const studentsData = JSON.parse(data);
      const findStudent = studentsData.findIndex(student => student.id === studentId);

      if (findStudent === -1) {
        return res.status(404).json({ error: 'Student not found' });
      }

      studentsData[findStudent] = {
        ...studentsData[findStudent],
        first_name: req.body.first_name || studentsData[findStudent].first_name,
        last_name: req.body.last_name || studentsData[findStudent].last_name,
        email: req.body.email || studentsData[findStudent].email,
      };

      const updatedData = JSON.stringify(studentsData, null, 2);
      fs.writeFile(dataPath, updatedData, "utf-8", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error updating file" });
        }
        res.status(200).json({ message: "Student updated successfully" });
      });
    });
  } else if (req.method === 'DELETE') {
    const studentId = parseInt(req.query.id, 10);

    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading data file' });
      }
      const studentsData = JSON.parse(data);
      const findStudent = studentsData.findIndex(student => student.id === studentId);

      if (findStudent === -1) {
        return res.status(404).json({ error: 'Student not found' });
      }

      studentsData.splice(findStudent, 1);
      const updatedData = JSON.stringify(studentsData, null, 2);

      fs.writeFile(dataPath, updatedData, "utf-8", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error deleting student" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
