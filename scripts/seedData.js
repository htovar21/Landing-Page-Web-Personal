const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
require('dotenv').config({ path: './config.env' });

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
      maxPoolSize: 5, // Pool más pequeño para scripts
      serverSelectionTimeoutMS: 10000, // Timeout más largo para scripts
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB Atlas conectado para poblar datos');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.error('🔐 Error de autenticación. Verifica tu usuario y contraseña en MONGODB_URI');
    }
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error('🌐 Error de red. Verifica tu conexión a internet y la URI de MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🗑️ Limpiando datos existentes...');
    
    // Limpiar datos existentes
    await Profile.deleteMany({});
    await Project.deleteMany({});
    
    console.log('✅ Datos existentes eliminados');

    // Crear perfil
    console.log('👤 Creando perfil...');
    const profile = new Profile({
      name: 'Héctor Tovar',
      title: 'Desarrollador Web Junior',
      description: 'Soy un desarrollador web junior apasionado por crear aplicaciones web modernas, responsivas e intuitivas. Disfruto transformar ideas en soluciones funcionales y elegantes a través de un código limpio y eficiente.',
      about: 'Soy un desarrollador web junior con una sólida base en tecnologías front-end. Estoy motivado por aprender constantemente y contribuir en proyectos innovadores. Mi objetivo es crear experiencias web accesibles, funcionales y con impacto positivo en los usuarios.',
      socialLinks: {
        twitter: 'https://x.com/HectorT33838505',
        github: 'https://github.com/htovar21',
        linkedin: '#'
      },
      technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Git'],
      heroImage: 'https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=800'
    });

    await profile.save();
    console.log('✅ Perfil creado exitosamente');

    // Crear proyectos
    console.log('🚀 Creando proyectos...');
    const projects = [
      {
        title: 'Web de Ventas de inmuebles',
        description: 'Página web de para venta de inmuebles.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
        githubUrl: 'https://github.com/yormanbalanD/proyecto__software_I',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        order: 1
      },
      {
        title: 'App Screen Share',
        description: 'Aplicación móvil para compartir la pantalla del manera segura a otros teléfonos Android.',
        image: 'https://images.pexels.com/photos/4549415/pexels-photo-4549415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        githubUrl: 'https://github.com/keimelR/ScreenShare',
        technologies: ['Android', 'Java', 'Kotlin'],
        order: 2
      },
      {
        title: 'Aplicacion Foodigo',
        description: 'Una app móvil para ubicar restaurantes cercanos mediante la toma de una foto en un ángulo o dirección.',
        image: 'https://images.pexels.com/photos/3296547/pexels-photo-3296547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        githubUrl: 'https://github.com/yormanbalanD/frontend_proyecto_software2',
        technologies: ['React Native', 'JavaScript', 'Node.js'],
        order: 3
      }
    ];

    for (const projectData of projects) {
      const project = new Project(projectData);
      await project.save();
      console.log(`✅ Proyecto "${projectData.title}" creado`);
    }

    console.log('🎉 Base de datos poblada correctamente');
    console.log(`📊 Total de documentos creados:`);
    console.log(`   - Perfiles: 1`);
    console.log(`   - Proyectos: ${projects.length}`);
    
    mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar el script
console.log('🚀 Iniciando proceso de población de datos...');
connectDB().then(() => {
  seedData();
}); 