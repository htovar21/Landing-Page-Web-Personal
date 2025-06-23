const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
require('dotenv').config({ path: './config.env' });

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api', require('./routes/api'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de health check para Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
