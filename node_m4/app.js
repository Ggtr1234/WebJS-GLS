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



//////////////////////////////////////////////// API //////////////////////////////////////////////

                  //////////////////////////// EQUIPOS ///////////////////////////////
/**
 * @swagger
 * /api/equipos:
 *   get:
 *     summary: Obtener todos los equipos
 *     tags:
 *       - Equipos
 *     responses:
 *       200:
 *         description: Éxito. Devuelve una lista de todos los equipos.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Equipo'
 */

// MUESTRA TODOS LOS EQUIPOS
app.get('/api/equipos', async (req, res) => {
    // await db.select('*')
    //     .from('equipos')
    //     .then(function (data){
    //         data = {equipos: data}
    //         res.send(data)
    //     })
    //     .catch(function (error){
    //         console.log(error)
    //     })
    const equipos = await equipo.find({});
    res.status(200).json({equipos});
});
/**
 * @swagger
 * /api/equipos/{id}:
 *   get:
 *     summary: Obtener un equipo por su ID
 *     tags:
 *       - Equipos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del equipo a buscar
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Éxito. Devuelve el equipo correspondiente al ID proporcionado.
 *         schema:
 *           $ref: '#/definitions/Equipo'
 *       404:
 *         description: No se encontró ningún equipo con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */

// ITEMS DETAIL
app.get('/api/equipos/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const result = await db.select('*').from('equipos').where('id', id);
    res.send(result);
});
/**
 * @swagger
 * /api/equipos/update/{id}:
 *   post:
 *     summary: Actualizar un equipo por su ID
 *     tags:
 *       - Equipos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del equipo a actualizar
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: Datos actualizados del equipo
 *         required: true
 *         schema:
 *           $ref: '#/definitions/EquipoUpdate'
 *     responses:
 *       200:
 *         description: Éxito. El equipo ha sido actualizado correctamente.
 *       404:
 *         description: No se encontró ningún equipo con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 * definitions:
 *   Equipo:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: ID único del equipo.
 *       nombre:
 *         type: string
 *         description: Nombre del equipo.
 *   EquipoUpdate:
 *     type: object
 *     properties:
 *       nombre:
 *         type: string
 *         description: Nuevo nombre del equipo.
 */
// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/equipos/update/:id", async (req, res)=>{
    let id = req.params.id;
    let params = req.body;
    console.log(params)
    try{
        await db('equipos').where('id','=' ,id).update(params);
        res.send('Updateado correctamente')
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
 *     summary: Eliminar un equipo por su ID
 *     tags:
 *       - Equipos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del equipo a eliminar
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Éxito. El equipo ha sido eliminado correctamente.
 *       404:
 *         description: No se encontró ningún equipo con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */

// ELIMINAR UN ITEM DE EQUIPOS POR ID
app.delete('/api/equipos/:id', async (req, res)=>{
    const id = parseInt(req.params.id)
    try{
        await db('equipos').where('id','=',id).del();
        res.send('Eliminado correctamente')
    }catch (e){
        console.log(e);
        res.send('Error en el servidor')
    }
});
/**
 * @swagger
 * /api/equipos:
 *   post:
 *     summary: Insertar un nuevo equipo
 *     tags:
 *       - Equipos
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Datos del nuevo equipo
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Equipo'
 *     responses:
 *       200:
 *         description: Éxito. El equipo ha sido insertado correctamente.
 *       500:
 *         description: Error interno del servidor.
 * definitions:
 *   Equipo:
 *     type: object
 *     properties:
 *       nombre:
 *         type: string
 *         description: Nombre del equipo.
 */

// INSERTAR UN NUEVO ITEM A EQUIPOS
app.post('/api/equipos', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await db('equipos').insert(params);
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
 *     tags:
 *       - Pilotos
 *     responses:
 *       200:
 *         description: Éxito. Devuelve una lista de todos los pilotos.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Piloto'
 *       500:
 *         description: Error interno del servidor.
 */

// MUESTRA TODOS LOS PILOTOS
app.get('/api/pilotos',async (req, res) => {
    await db.select('*')
        .from('pilotos')
        .then(function (data){
            data = {pilotos: data}
            res.send(data)
        })
        .catch(function (error){
            console.log(error)
        })
});
/**
 * @swagger
 * /api/pilotos/{id}:
 *   get:
 *     summary: Obtener un piloto por su ID
 *     tags:
 *       - Pilotos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del piloto a buscar
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Éxito. Devuelve el piloto correspondiente al ID proporcionado.
 *         schema:
 *           $ref: '#/definitions/Piloto'
 *       404:
 *         description: No se encontró ningún piloto con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */

// ITEMS DETAIL
app.get('/api/pilotos/:id',async (req, res)=>{
    const id = parseInt(req.params.id)
    const result = await db.select('*').from('pilotos').where('id', id);
    res.send(result);
});
/**
 * @swagger
 * /api/pilotos/update/{id}:
 *   post:
 *     summary: Actualizar un piloto por su ID
 *     tags:
 *       - Pilotos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del piloto a actualizar
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: Datos actualizados del piloto
 *         required: true
 *         schema:
 *           $ref: '#/definitions/PilotoUpdate'
 *     responses:
 *       200:
 *         description: Éxito. El piloto ha sido actualizado correctamente.
 *       500:
 *         description: Error interno del servidor.
 * definitions:
 *   PilotoUpdate:
 *     type: object
 *     properties:
 *       nombre:
 *         type: string
 *         description: Nuevo nombre del piloto.
 */


// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/pilotos/update/:id", async (req, res)=>{
    let id = req.params.id;
    let params = req.body;
    console.log(params)
    try{
        await db('pilotos').where('id','=' ,id).update(params);
        res.send('Updateado correctamente')
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
 *     summary: Eliminar un piloto por su ID
 *     tags:
 *       - Pilotos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del piloto a eliminar
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Éxito. El piloto ha sido eliminado correctamente.
 *       404:
 *         description: No se encontró ningún piloto con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */

// ELIMINAR UN ITEM DE PILOTOS POR ID
app.delete('/api/pilotos/:id',async (req, res)=>{
    const id = parseInt(req.params.id)
    try{
        await db('pilotos').where('id','=',id).del();
        res.send('Eliminado correctamente')
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
 *     tags:
 *       - Pilotos
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Datos del nuevo piloto
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Piloto'
 *     responses:
 *       200:
 *         description: Éxito. El piloto ha sido insertado correctamente.
 *       500:
 *         description: Error interno del servidor.
 * definitions:
 *   Piloto:
 *     type: object
 *     properties:
 *       nombre:
 *         type: string
 *         description: Nombre del piloto.
 */

// INSERTAR UN NUEVO ITEM A PILOTOS
app.post('/api/pilotos', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try{
        await db('pilotos').insert(params);
        res.send('Insertado correctamente')
    }catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }
});

////////////////////////////////////////// WEB //////////////////////////////////////
            //////////////////////////// PILOTOS ///////////////////////////////

// /**
//  * @swagger
//  * tags:
//  *   name: WEB (Pilotos)
//  *   description: Endpoints de la aplicación web relacionados con Pilotos
//  */
// /**
//  * @swagger
//  * /:
//  *   get:
//  *     tag: [WEB]
//  *     summary: Renderizar la página de inicio
//  *     description: Renderiza la página de inicio de la aplicación web.
//  *     tags: [WEB]
//  *     responses:
//  *       200:
//  *         description: Página de inicio renderizada correctamente
//  *         content:
//  *           text/html:
//  *             schema:
//  *               type: string
//  */
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
    const query = await db('equipos').where('id', '=', id).first();
    console.log(query)
    const params = {
        title: 'Detalles Equipo',
        equipo: query
    }
    res.render('detalles_equipo', params)
});

app.get('/pilotos/detalles/:id',async (req, res) => {
    const id = req.params.id
    const query = await db('pilotos').where('id', '=', id).first();
    console.log(query)
    const params = {
        title: 'Detalles Piloto',
        piloto: query
    }
    res.render('detalles_piloto', params)
});

// /**
//  * @swagger
//  * /pilotos:
//  *   get:
//  *     summary: Obtener lista de pilotos
//  *     description: Renderiza la página de lista de pilotos de la aplicación web.
//  *     tags: [WEB (Pilotos)]
//  *     responses:
//  *       200:
//  *         description: Lista de pilotos obtenida correctamente
//  *         content:
//  *           text/html:
//  *             schema:
//  *               type: string
//  */
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
// /**
//  * @swagger
//  *
//  * /pilotos/update/{id}:
//  *   get:
//  *     summary: Obtener datos de un piloto para actualizar
//  *     description: Renderiza la página para actualizar los datos de un piloto específico.
//  *     tags: [WEB (Pilotos)]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         description: ID del piloto que se desea actualizar
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Datos del piloto obtenidos correctamente para la actualización
//  *         content:
//  *           text/html:
//  *             schema:
//  *               type: string
//  */
// UPDATE ITEM
app.get('/pilotos/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await db('pilotos').where('id', '=', id).first();
    console.log(query)
    const params = {
        title: 'Update Piloto',
        pilotos: query
    }
    res.render('update_piloto', params)
});
// /**
//  * @swagger
//  *
//  * /pilotos/update:
//  *   post:
//  *     summary: Actualizar datos de un piloto
//  *     description: Actualiza los datos de un piloto específico.
//  *     tags: [WEB (Pilotos)]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: integer
//  *               nombre:
//  *                 type: string
//  *               edad:
//  *                 type: integer
//  *               nacion:
//  *                 type: string
//  *               premios:
//  *                 type: integer
//  *               imagen:
//  *                 type: string
//  *     responses:
//  *       302:
//  *         description: Redirige a la página de lista de pilotos después de la actualización
//  *       500:
//  *         description: Error en el servidor al intentar actualizar los datos del piloto
//  */
// Update quipo
app.post("/pilotos/update", async (req, res)=>{
    const params = req.body
    console.log('params',params)
    try {
        const result = await db('pilotos').where('id', '=',params.id).update(params)
        console.log('insertado!', result)
        res.redirect('/pilotos')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// /**
//  * @swagger
//  *
//  * /pilotos/insert:
//  *   get:
//  *     summary: Renderizar formulario para insertar un nuevo piloto
//  *     description: Renderiza la página para mostrar el formulario de inserción de un nuevo piloto.
//  *     tags: [WEB (Pilotos)]
//  *     responses:
//  *       200:
//  *         description: Página de formulario renderizada correctamente
//  *         content:
//  *           text/html:
//  *             schema:
//  *               type: string
//  */
// INSERT ITEM GET: show form
app.get('/pilotos/insert', (req,res)=>{
    res.render('insert_piloto',
        {title:'insert piloto'}
    )
});
// /**
//  * @swagger
//  *
//  * /pilotos/insert:
//  *   post:
//  *     summary: Insertar un nuevo piloto
//  *     description: Inserta un nuevo piloto con los datos proporcionados desde el formulario.
//  *     tags: [WEB (Pilotos)]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               nombre:
//  *                 type: string
//  *               edad:
//  *                 type: integer
//  *               nacion:
//  *                 type: string
//  *               premios:
//  *                 type: integer
//  *               imagen:
//  *                 type: string
//  *     responses:
//  *       302:
//  *         description: Redirige a la página de lista de pilotos después de la inserción
//  *       500:
//  *         description: Error en el servidor al intentar insertar el nuevo piloto
//  */
//Insertar piloto
app.post('/pilotos/insert',async (req, res)=>{
    const params = req.body
    console.log('params',params)
    try {
        const result = await db('pilotos').insert(params)
        console.log('insertado!', result)
        res.redirect('/pilotos')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});

        //////////////////////////// EQUIPOS ///////////////////////////////
// /**
//  * @swagger
//  *
// *   /equipos:
// *     get:
// *       summary: Obtener lista de equipos
// *       description: Renderiza la página de lista de equipos de la aplicación web.
// *       tags:
// *         - WEB (Equipos)
// *       responses:
// *         '200':
// *           description: Lista de equipos obtenida correctamente
// *           content:
// *             text/html:
// *               schema:
// *                 type: string
//  */
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
    const params = req.body
    console.log('params',params)
    try {
        const result = await db('equipos').where('id', '=',params.id).update(params)
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
    const params = req.body
    console.log('params',params)
    try {
        const result = await db('equipos').insert(params)
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
    const query = await db('equipos').where('id', '=', id).first();
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

