const mongoose = require('mongoose');

// Cargar variables de entorno desde archivo local (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './config.env' });
}

const connectDB = async () => {
  try {
    // Verificar que la URI de MongoDB esté configurada
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está configurada en las variables de entorno');
    }

    // Opciones de conexión optimizadas para MongoDB Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Mantener hasta 10 conexiones en el pool
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      socketTimeoutMS: 45000, // Timeout de socket de 45 segundos
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    // Manejar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    // Manejar cierre graceful de la aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Conexión MongoDB cerrada por terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    
    // Verificar si es un error de autenticación
    if (error.message.includes('Authentication failed')) {
      console.error('🔐 Error de autenticación. Verifica tu usuario y contraseña en MONGODB_URI');
    }
    
    // Verificar si es un error de red
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error('🌐 Error de red. Verifica tu conexión a internet y la URI de MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 