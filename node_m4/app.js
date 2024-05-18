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
    const equipoId = req.params.id;


    try {
        const equipoDeleted = await equipo.deleteOne({ _id: equipoId });
        const findallPilot = await piloto.find({'equipo._id': equipoId});
        for (const pilot of findallPilot){
            await piloto.updateOne({_id:pilot._id},
                { $set: { equipo: 'No encontrado' }});
        }
        // console.log(pilotoUpdate)
        // console.log(equipoDeleted);
        res.send('Eliminado correctamente');
    } catch (error) {
        console.log(error);
        res.send('Error en el servidor');
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
 *     summary: Eliminar un piloto existente.
 *     description: Elimina un piloto existente según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del piloto a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Piloto eliminado exitosamente.
 *       '404':
 *         description: No se encontró el piloto con el ID especificado.
 *       '500':
 *         description: Error en el servidor al intentar eliminar el piloto.
 */

// ELIMINAR UN ITEM DE PILOTOS POR ID
app.delete('/api/pilotos/:id',async (req, res)=>{
    const id = req.params.id;

    try {
        const deletedPiloto = await piloto.deleteOne({ _id: id });
        if (!deletedPiloto) {
            return res.status(404).json({ error: 'Piloto no encontrado' });
        }
        res.json({ message: 'Piloto eliminado', deletedPiloto });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el piloto' });
    }
});
/**
 * @swagger
 * /api/pilotos:
 *   post:
 *     summary: Agregar un nuevo piloto.
 *     description: Crea un nuevo piloto utilizando los datos proporcionados en el cuerpo de la solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: integer
 *               equipo:
 *                 type: string
 *             required:
 *               - nombre
 *               - edad
 *               - equipo
 *     responses:
 *       '200':
 *         description: Éxito al insertar el piloto.
 *       '500':
 *         description: Error en el servidor.
 */

// INSERTAR UN NUEVO ITEM A PILOTOS
app.post('/api/pilotos', async (req, res)=>{
    const params = req.body;
    console.log(params);
    try {
        const nuevoPiloto = await piloto.create(params);
        console.log('Insertado', nuevoPiloto);
        res.send('Insertado correctamente');
    } catch (error) {
        console.error(error);
        res.send('Error en el servidor');
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
    const query = await equipo.find({_id:id});
    console.log(query)
    const params = {
        title: 'Detalles Equipo',
        equipo: query[0]
    }
    res.render('detalles_equipo', params)
});

app.get('/pilotos/detalles/:id',async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const query = await piloto.find({ _id: id });
        console.log(query);
        const params = {
            title: 'Detalles Piloto',
            piloto: query[0]
        };
        res.render('detalles_piloto', params);
    } catch (error) {
        console.error(error);
    }
});

// Show ALL Items
app.get('/pilotos', async (req, res) => {
    const query = await piloto.find({})
    // console.log(query)
    const params = {
        title: 'Pilotos',
        pilotos: query
    }
    // console.log(params)
    res.render('pilotos', params);
});

// UPDATE ITEM
app.get('/pilotos/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await piloto.find({_id:id});
    console.log(query)
    const params = {
        title: 'Update Piloto',
        pilotos: query[0]
    }
    res.render('update_piloto', params)
});

// Update quipo
app.post("/pilotos/update", async (req, res)=>{
    try {
        await piloto.findOneAndUpdate({ _id: req.body.id },req.body, { new: false });

        res.redirect('/pilotos');
    } catch (error) {
        console.error(error);
        res.send(500);
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
    const params = req.body;
    console.log(params)
    try {
        const nuevoPiloto = piloto.create(params);
        console.log('insertado!', nuevoPiloto)
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
    // console.log(params)
    res.render('equipos', params);
});
// Update quipo
app.post("/equipos/update", async (req, res)=>{
    try {
        await equipo.findOneAndUpdate({ _id: req.body.id },req.body, { new: false });

        res.redirect('/equipos');
    } catch (error) {
        console.error(error);
        res.send(500);
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
        const nuevoEquipo = equipo.create(params);
        console.log('insertado!', nuevoEquipo)
        res.redirect('/equipos')
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// UPDATE ITEM
app.get('/equipos/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await equipo.find({_id:id});
    console.log(query)
    const params = {
        title: 'Update Equipo',
        item: query[0]
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

