// Importar express
const express = require('express');

// Crear una instancia de express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Definir una ruta simple de prueba (GET)
app.get('/', (req, res) => {
  res.send('¡Hola, esta es una API sencilla con Express!');
});

// Definir una ruta para obtener una lista de elementos (GET)
app.get('/items', (req, res) => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];
  res.json(items);
});

// Definir una ruta para obtener un solo elemento por ID (GET)
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = { id: id, name: `Item ${id}` };
  res.json(item);
});

// Definir una ruta para crear un nuevo elemento (POST)
app.post('/items', (req, res) => {
  const newItem = req.body; // El nuevo elemento será recibido en el cuerpo de la solicitud
  res.status(201).json({ message: 'Item creado', item: newItem });
});

// Definir una ruta para actualizar un elemento (PUT)
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  res.json({ message: `Item ${id} actualizado`, item: updatedItem });
});

// Definir una ruta para eliminar un elemento (DELETE)
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Item ${id} eliminado` });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
