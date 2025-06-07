const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/contacto', (req, res) => {
    const { nombre, email } = req.body;
    console.log(`Contacto: ${nombre} - ${email}`);
    res.send('Gracias por contactarnos.');
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
