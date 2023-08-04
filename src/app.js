const express = require('express');
const mongoose = require('mongoose')
const handlebars = require('express-handlebars');
const socketServer = require('./utils/io');
require('dotenv').config();



const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const viewsRouterFn = require('./routes/viewsRouter');

const app = express();
const MONGODB_CONNECT = `mongodb+srv://carlosalfredogomez:MongoAtlas423@ecommerce.d3n3mjn.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(MONGODB_CONNECT)
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((error) => {
    if (error) {
      console.log('Error al conectarse a la base de datos', error.message)
    }
  })


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'));


const httpServer = app.listen(8080, () => {
  console.log(`Servidor express escuchando en el puerto 8080`);
});

const io = socketServer(httpServer);
const viewsRouter = viewsRouterFn(io)

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.get('/healthCheck', (req, res) => {
  res.json({
    status: 'running',
    date: new Date(),
  });
});