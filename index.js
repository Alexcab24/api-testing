const express = require('express');

const fs = require('node:fs');
const app = express();

const dataPath = './students.json'
const port = 3000;

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>API is working</h1>')
});



///Metodo GET
app.get('/api/students', (req, res) => {

  fs.readFile(dataPath, "utf-8", (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: "Error readind file" })
    }

    const students = JSON.parse(data)
    res.json(students)
  })

});






//Metodo POST
app.post('/api/students', (req, res) => {
  if (!req.body.email) {
    res.status(400);
    return res.json({ error: "Email is required" })
  };


  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
      return;
    }
    const studentsData = JSON.parse(data);

    const newUser = {
      id: studentsData.length + 1,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    };

    studentsData.push(newUser);

    const updatedData = JSON.stringify(studentsData, null, 2);

    fs.writeFile(dataPath, updatedData, 'utf-8', (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error writing to data file" });
      }
      console.log('Data written successfully to disk')
    })
  })
  res.json({ message: "Data written successfully to disk" })
})











//Metodo PUT
app.put('/api/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10)

  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Error reading data file' });
    }
    const studentsData = JSON.parse(data);
    const findStudent = studentsData.findIndex(student => student.id === studentId)
    console.log(findStudent)

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
        console.log(err);
        return res.status(500).json({ error: "Error updating file" });
      }
      console.log("Data written successfully to disk")
    })

    return res.json({ message: "Data updated successfully" })


  })

});


//Metodo DELETE
app.delete('/api/students/:id', (req, res) => {

  const studentId = parseInt(req.params.id, 10);


  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {

      return res.status(500).json({ error: 'Error reading data file' });
    }
    const studentsData = JSON.parse(data);

    const findStudent = studentsData.findIndex(student => student.id === studentId)


    if (findStudent === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }


    studentsData.splice(findStudent, 1);

    const updatedData = JSON.stringify(studentsData, null, 2);

    fs.writeFile(dataPath, updatedData, "utf-8", (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error updating file" });
      }
      console.log("Data written successfully to disk")
    })

    return res.json({ message: "Data deleted successfully" })


  })
});






app.listen(port, () => {
  console.log(`server is running on: http://localhost:${port}`)
})