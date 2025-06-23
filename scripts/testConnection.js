const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const testConnection = async () => {
  console.log('🔍 Probando conexión a MongoDB Atlas...\n');
  
  // Verificar variables de entorno
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está configurada');
    console.log('💡 Solución: Verifica que el archivo config.env existe y contiene MONGODB_URI');
    process.exit(1);
  }
  
  console.log('✅ Variable MONGODB_URI encontrada');
  
  // Ocultar la contraseña en los logs
  const uriParts = process.env.MONGODB_URI.split('@');
  if (uriParts.length > 1) {
    const safeUri = uriParts[0].replace(/\/\/[^:]+:[^@]+/, '//***:***') + '@' + uriParts[1];
    console.log(`🔗 URI: ${safeUri}`);
  }
  
  try {
    // Opciones de conexión para testing
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    
    console.log('\n🔄 Intentando conectar...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Conexión exitosa!');
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🔌 Puerto: ${conn.connection.port}`);
    console.log(`👤 Usuario: ${conn.connection.user}`);
    
    // Probar operaciones básicas
    console.log('\n🧪 Probando operaciones básicas...');
    
    // Listar colecciones
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📚 Colecciones encontradas: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Probar una consulta simple
    const Profile = require('../models/Profile');
    const profileCount = await Profile.countDocuments();
    console.log(`👤 Documentos en Profile: ${profileCount}`);
    
    const Project = require('../models/Project');
    const projectCount = await Project.countDocuments();
    console.log(`🚀 Documentos en Project: ${projectCount}`);
    
    console.log('\n🎉 Todas las pruebas pasaron exitosamente!');
    console.log('✅ Tu configuración de MongoDB Atlas está funcionando correctamente');
    
    mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    
  } catch (error) {
    console.error('\n❌ Error de conexión:');
    console.error(`   Mensaje: ${error.message}`);
    
    // Diagnóstico específico
    if (error.message.includes('Authentication failed')) {
      console.error('\n🔐 Error de autenticación detectado:');
      console.error('   - Verifica tu usuario y contraseña en MONGODB_URI');
      console.error('   - Asegúrate de que el usuario tenga permisos de lectura/escritura');
      console.error('   - Verifica que la contraseña no contenga caracteres especiales');
    }
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error('\n🌐 Error de red detectado:');
      console.error('   - Verifica tu conexión a internet');
      console.error('   - Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas');
      console.error('   - Verifica que la URI del cluster sea correcta');
    }
    
    if (error.message.includes('Invalid connection string')) {
      console.error('\n🔗 Error en la URI de conexión:');
      console.error('   - Verifica el formato de la URI');
      console.error('   - Asegúrate de que no haya espacios extra');
      console.error('   - Verifica que los parámetros de la URI sean correctos');
    }
    
    process.exit(1);
  }
};

// Ejecutar el test
console.log('🚀 Iniciando test de conexión a MongoDB Atlas...\n');
testConnection(); 