const express = require('express');
const mongoose = require('mongoose')
const handlebars = require('express-handlebars');
const socketServer = require('./utils/io');
require('dotenv').config();
//const mongodbUri = process.env.MONGODB_URI;

// Implementación de enrutadores
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const viewsRouterFn = require('./routes/viewsRouter');

const app = express();
const MONGODB_CONNECT = `mongodb+srv://carlosalfredogomez:MongoAtlas423@ecommerce.eygngrd.mongodb.net/ecommerce?retryWrites=true&w=majority`
mongoose.connect(MONGODB_CONNECT)
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((error) => {
    if (error) {
      console.log('Error al conectarse a la base de datos', error.message)
    }
  })

// Middleware para el manejo de JSON y datos enviados por formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Seteo de forma estática la carpeta public
app.use(express.static(__dirname + '/public'));


// Crear el servidor HTTP
const httpServer = app.listen(8080, () => {
  console.log(`Servidor express escuchando en el puerto 8080`);
});

// Crear el objeto `io` para la comunicación en tiempo real
const io = socketServer(httpServer);
const viewsRouter = viewsRouterFn(io)

// Rutas base de enrutadores
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Ruta de health check
app.get('/healthCheck', (req, res) => {
  res.json({
    status: 'running',
    date: new Date(),
  });
});