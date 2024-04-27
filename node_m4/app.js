var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');
var  swaggerUi = require('swagger-ui-express');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

const swaggerOptions ={
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API WEB GLS',
            version: '1.0.0',
            description: 'Equipos y pilotos de Formula 1',
            contact: {
                name: "German Llerena Sanchez",
                email: 'llerenagerman4@gmail.com',
            },
            servers: ["http://localhost:3000"]
        },
        "tags": [
            {
                "name": "API Equipos",
                "description": "API manejo de equipos"

            },
            {
                "name": "API Pilotos",
                "description": "API manejo de pilotos"
            }
        ]
    },
    apis: ['app.js']
};
// Swagger
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//
// const db = require('knex')({
//     client:'sqlite3',
//     connection: './f1.sqlite',
// });

const mongoose = require('mongoose');
const piloto = require('./models/Piloto.js');
const equipo = require('./models/Equipo.js');
mongoose.connect("mongodb://127.0.0.1:27017/f1?retryWrites=true&w=majority");
function findItem(where, id){
    for (let i = 0; i < where.length ; i++) {
        if (where[i].id == id){
            return i
        }
    }
    return -1;
}

mongoose.connection.on('connected', () => {
    console.log(`Conexión establecida con la base de datos: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
    console.error(`Error de conexión a MongoDB: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Desconectado de MongoDB');
});

/**
 * @swagger
 * tags:
 *     name: API Pilotos
 *     description: API manejo de pilotos
 */
/**
 * @swagger
 * tags:
 *     name: API Equipos
 *     description: API manejo de equipos
 */

//////////////////////////////////////////////// API //////////////////////////////////////////////

                  //////////////////////////// EQUIPOS ///////////////////////////////
/**
 * @swagger
 * paths:
 *   /api/equipos:
 *     get:
 *       summary: Obtiene todos los equipos
 *       description: Retorna una lista de todos los equipos registrados.
 *       responses:
 *         '200':
 *           description: OK. Lista de equipos obtenida con éxito.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   equipos:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Equipo'
 *         '500':
 *           description: Error interno del servidor. No se pudo obtener la lista de equipos.
 * components:
 *   schemas:
 *     Equipo:
 *       type: object
 *       properties:
 *         idequipo:
 *           type: string
 *           description: ID del equipo.
 *         equiponombre:
 *           type: string
 *           description: Nombre del equipo.
 *         nacionequipo:
 *           type: string
 *           description: Nacionalidad del equipo.
 *         nombrepiloto:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de nombres de pilotos del equipo.
 *         nacionespilotos:
 *           type: string
 *           description: Nacionalidades de los pilotos del equipo.
 */
// MUESTRA TODOS LOS EQUIPOS
app.get('/api/equipos', async (req, res) => {
    const equipos = await equipo.find({});
    res.send(equipos)

});
/**
 * @swagger
 * /api/equipos/{id}:
 *   get:
 *     tags: [API Equipos]
 *     summary: Obtener un equipo por su ID
 *     description: Obtiene un equipo específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del equipo que se desea obtener
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipo obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 nacion:
 *                   type: string
 *                 campeonatos:
 *                   type: integer
 *                 historia:
 *                   type: string
 *                 imagen:
 *                   type: string
 *       404:
 *         description: No se encontró el equipo con el ID proporcionado
 *       500:
 *         description: Error en el servidor al obtener el equipo
 */
// ITEMS DETAIL
app.get('/api/equipos/:id', async (req, res) => {
    const id = req.params.id
    const result = await equipo.findById(id);
    if (equipo){
        res.send(equipo);
    }else {
        res.status(500).send("Error");
    }
    res.send(result);
});
/**
 * @swagger
 * /api/equipos/update/{id}:
 *   post:
 *     tags: [API Equipos]
 *     summary: Actualizar un equipo por su ID
 *     description: Actualiza los datos de un equipo específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del equipo que se desea actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               nacion:
 *                 type: string
 *               campeonatos:
 *                 type: integer
 *               historia:
 *                 type: string
 *               imagen:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipo actualizado correctamente
 *       404:
 *         description: No se encontró el equipo con el ID proporcionado
 *       500:
 *         description: Error en el servidor al intentar actualizar el equipo
 */
// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/equipos/update/:id", async (req, res)=>{
    let id = req.params.id;
    let params = req.body;
    console.log(params)
    try{
        const equipoUpdate = await equipo.findOneAndUpdate({_id: id},{$set: params},{new: true});
        if (!equipoUpdate){
            res.status(404).json({succes: false, message: 'No econtrado, Error'})
        }
        res.status(200).json({succes: true, message: 'Updateado Correctamente'})
        console.log('Updateado id: ', id)
    } catch (error){
        console.log(error)
        res.send('Error en el servidor.')
    }
});
/**
 * @swagger
 * /api/equipos/{id}:
 *   delete:
 *     tags: [API Equipos]
 *     summary: Eliminar un equipo por su ID
 *     description: Elimina un equipo específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del equipo que se desea eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipo eliminado correctamente
 *       404:
 *         description: No se encontró el equipo con el ID proporcionado
 *       500:
 *         description: Error en el servidor al intentar eliminar el equipo
 */
// ELIMINAR UN ITEM DE EQUIPOS POR ID
app.delete('/api/equipos/:id', async (req, res)=>{
    const id = req.params.id
    try{
        const eliminarEquipo = await equipo.deleteOne({_id:id});
        console.log(eliminarEquipo)
        if (deletedEquipo) {
            res.send('Equipo eliminado correctamente');
        } else {
            res.status(404).send('Equipo no encontrado');
        }
    }catch (e){
        console.log(e);
        res.send('Error en el servidor')
    }
});
/**
 * @swagger
 * /api/equipos:
 *   post:
 *     tags: [API Equipos]
 *     summary: Insertar un nuevo equipo
 *     description: Inserta un nuevo equipo con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               nacion:
 *                 type: string
 *               campeonatos:
 *                 type: integer
 *               historia:
 *                 type: string
 *               imagen:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo equipo insertado correctamente
 *       500:
 *         description: Error en el servidor al insertar el nuevo equipo
 */
// INSERTAR UN NUEVO ITEM A EQUIPOS
app.post('/api/equipos', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await equipo.create(params)
        res.send('Insertado correctamente')
    }catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }

});

                    //////////////////////////// PILOTOS ///////////////////////////////
/**
 * @swagger
 * /api/pilotos:
 *   get:
 *     summary: Obtener todos los pilotos
 *     description: Obtiene una lista de todos los pilotos.
 *     tags:
 *       - API Pilotos
 *     responses:
 *       200:
 *         description: Lista de pilotos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pilotos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       equipo_id:
 *                         type: integer
 *                       puntos:
 *                         type: integer
 *                       edad:
 *                         type: integer
 *       500:
 *         description: Error en el servidor al obtener la lista de pilotos
 *     servers:
 *       - url: http://localhost:3000
 */
// MUESTRA TODOS LOS PILOTOS
app.get('/api/pilotos',async (req, res) => {
    try{
        const pilotos = await piloto.find({});
        res.send(pilotos);
    }catch (e) {
        console.log(e)
    }
});
/**
 * @swagger
 * /api/pilotos/{id}:
 *   get:
 *     summary: Obtener un piloto por su ID
 *     description: Obtiene un piloto específico basado en su ID.
 *     tags:
 *       - API Pilotos
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del piloto que se desea obtener
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Piloto obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   equipo_id:
 *                     type: integer
 *                   puntos:
 *                     type: integer
 *                   edad:
 *                     type: integer
 *       404:
 *         description: No se encontró el piloto con el ID proporcionado
 *       500:
 *         description: Error en el servidor al obtener el piloto
 *     servers:
 *       - url: http://localhost:3000
 */
// ITEMS DETAIL
app.get('/api/pilotos/:id',async (req, res)=>{
    const id = req.params.id
    const result = await piloto.findById(id);
    res.status(200).send(result)
});
/**
 * @swagger
 * /api/pilotos/update/{id}:
 *   post:
 *     tags: [API Pilotos]
 *     summary: Actualizar un piloto por su ID
 *     description: Actualiza los datos de un piloto específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del piloto que se desea actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               equipo_id:
 *                 type: integer
 *               puntos:
 *                 type: integer
 *               edad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Piloto actualizado correctamente
 *       404:
 *         description: No se encontró el piloto con el ID proporcionado
 *       500:
 *         description: Error en el servidor al intentar actualizar el piloto
 */

// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/pilotos/update/:id", async (req, res)=>{
    let id = req.params.id;
    let params = req.body;
    console.log(params)
    try{
        const pilotoUpdated = await piloto.findOneAndUpdate({_id: id},{$set: params},{new: true});

        res.status(200).json({success: true, message: 'Updatedado Correctamente'});
        console.log('Updateado id: ', id)
    } catch (error){
        console.log(error)
        res.send('Error en el servidor.')
    }
});
/**
 * @swagger
 * /api/pilotos/{id}:
 *   delete:
 *     tags: [API Pilotos]
 *     summary: Eliminar un piloto por su ID
 *     description: Elimina un piloto específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del piloto que se desea eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Piloto eliminado correctamente
 *       404:
 *         description: No se encontró el piloto con el ID proporcionado
 *       500:
 *         description: Error en el servidor al intentar eliminar el piloto
 */
// ELIMINAR UN ITEM DE PILOTOS POR ID
app.delete('/api/pilotos/:id',async (req, res)=>{
    const id = req.params.id
    try{
        const pilotoElim = await piloto.deleteOne({_id:id});
        console.log(pilotoElim)
        if (pilotoElim) {
            res.send('Equipo eliminado correctamente');
        } else {
            res.status(404).send('Equipo no encontrado');
        }
    }catch (e){
        console.log(e);
        res.send('Error en el servidor')
    }
});
/**
 * @swagger
 * /api/pilotos:
 *   post:
 *     summary: Insertar un nuevo piloto
 *     description: Inserta un nuevo piloto con los datos proporcionados.
 *     tags:
 *       - API Pilotos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               equipo_id:
 *                 type: integer
 *               puntos:
 *                 type: integer
 *               edad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Nuevo piloto insertado correctamente
 *       500:
 *         description: Error en el servidor al insertar el nuevo piloto
 */
// INSERTAR UN NUEVO ITEM A PILOTOS
app.post('/api/pilotos', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await piloto.create(params);
        res.send('Insertado correctamente')
    }catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }
});

////////////////////////////////////////// WEB //////////////////////////////////////
            //////////////////////////// PILOTOS ///////////////////////////////

// INDEX
app.get('/', (req, res) => {
    res.render('index',{title:'Formula 1'})
});

app.get('/contact', (req, res) => {
    res.render('contact',{title:'Contacto'})
});
app.get('/about', (req, res) => {
    res.render('about',{title:'About'})
});

app.get('/equipos/detalles/:id',async (req, res) => {
    const id = req.params.id
    const query = await equipo.findById(id);
    console.log(query)
    const params = {
        title: 'Detalles Equipo',
        equipo: query
    }
    res.render('detalles_equipo', params)
});

app.get('/pilotos/detalles/:id',async (req, res) => {
    const id = req.params.id
    const query = await piloto.findById(id);
    console.log(query)
    const params = {
        title: 'Detalles Piloto',
        piloto: query
    }
    res.render('detalles_piloto', params)
});

// Show ALL Items
app.get('/pilotos', async (req, res) => {
    const query = await piloto.find({})
    // console.log(query)
    const params = {
        title: 'Pilotos',
        pilotos: query
    }
    console.log(params)
    res.render('pilotos', params);
});
// UPDATE ITEM
app.get('/pilotos/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await piloto.findById(id);
    console.log(query)
    const params = {
        title: 'Update Piloto',
        pilotos: query
    }
    res.render('update_piloto', params)
});

// Update quipo
app.post("/pilotos/update", async (req, res)=>{
    const {_id,apellidospiloto,idequipo,nacionpiloto,nombrepiloto,imagenpiloto,titulospiloto} = req.body
    console.log('params',{_id,apellidospiloto,idequipo,nacionpiloto,nombrepiloto,imagenpiloto,titulospiloto})
    try {
        const result = await piloto.findByIdAndUpdate(_id,{_id,apellidospiloto,idequipo,nacionpiloto,nombrepiloto,imagenpiloto,titulospiloto},{new:true});
        console.log('insertado!', result)
        res.redirect('/pilotos')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// INSERT ITEM GET: show form
app.get('/pilotos/insert', (req,res)=>{
    res.render('insert_piloto',
        {title:'insert piloto'}
    )
});

//Insertar piloto
app.post('/pilotos/insert',async (req, res)=>{
    const {_id,apellidospiloto,idequipo,nacionpiloto,nombrepiloto,imagenpiloto,titulospiloto} = req.body
    console.log('params',{_id,apellidospiloto,idequipo,nacionpiloto,nombrepiloto,imagenpiloto,titulospiloto})
    try {
        const result = await piloto.create({apellidospiloto,idequipo,nacionpiloto,nombrepiloto,imagenpiloto,titulospiloto})
        console.log('insertado!', result)
        res.redirect('/pilotos')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});

        //////////////////////////// EQUIPOS ///////////////////////////////

// Show ALL Items
app.get('/equipos', async (req, res) => {
    const query = await equipo.find({})
    // console.log(query)
    const params = {
        title: 'Equipos',
        equipos: query
    }
    console.log(params)
    res.render('equipos', params);
});
// Update quipo
app.post("/equipos/update", async (req, res)=>{
    const {_id, equinombre,nacionequipo,nombrepiloto,idequipo,nacionespilotos} = req.body;
    console.log('params',{_id, equinombre,nacionequipo,nombrepiloto,idequipo,nacionespilotos})
    try {
        const result = await equipo.findByIdAndUpdate(_id, {equinombre,nacionequipo,nombrepiloto,idequipo,nacionespilotos},{new:true});
        console.log('insertado!', result)
        res.redirect('/equipos')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// INSERT ITEM GET: show form
app.get('/equipos/insert', (req,res)=>{
    res.render('insert_equipo',
        {title:'insert equipo'}
    )
});
// INSERT ITEM POST: get params and do your mojo!
app.post('/equipos/insert',async (req, res)=>{
    const {_id, equinombre,nacionequipo,nombrepiloto,idequipo,nacionespilotos} = req.body;
    console.log('params',{_id, equinombre,nacionequipo,nombrepiloto,idequipo,nacionespilotos})
    try {
        const result = await equipo.create({equinombre,nacionequipo,nombrepiloto,idequipo,nacionespilotos})
        console.log('insertado!', result)
        res.redirect('/equipos')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// UPDATE ITEM
app.get('/equipos/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await equipo.findById(id);
    console.log(query)
    const params = {
        title: 'Update Equipo',
        item: query
    }
    res.render('update_equipo', params)
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

