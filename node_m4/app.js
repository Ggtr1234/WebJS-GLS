var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
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

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API WEB GLS',
            version: '1.1.0',
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
const Equipo = require('./models/Equipo.js');
mongoose.connect("mongodb://127.0.0.1:27017/f1?retryWrites=true&w=majority");

function findItem(where, id) {
    for (let i = 0; i < where.length; i++) {
        if (where[i].id == id) {
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
 *     tags:
 *       - Equipos
 *     summary: Obtener todos los equipos
 *     description: Retorna una lista de todos los equipos.
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del equipo.
 *                         example: "60d21b4667d0d8992e610c85"
 *                       idequipo:
 *                         type: string
 *                         description: Identificador único del equipo.
 *                         example: "E001"
 *                       equiponombre:
 *                         type: string
 *                         description: Nombre del equipo.
 *                         example: "Equipo A"
 *                       nacionequipo:
 *                         type: string
 *                         description: Nacionalidad del equipo.
 *                         example: "España"
 *                       nombrepiloto:
 *                         type: string
 *                         description: Nombre del piloto principal del equipo.
 *                         example: "Juan"
 *                       nacionespilotos:
 *                         type: string
 *                         description: Nacionalidad del piloto principal del equipo.
 *                         example: "España"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener los equipos."
 */

// MUESTRA TODOS LOS EQUIPOS
app.get('/api/equipos', async (req, res) => {
    const equipos = await Equipo.find({});
    res.json({equipos});
});
/**
 * @swagger
 * /api/equipos/{id}:
 *   get:
 *     tags:
 *       - Equipos
 *     summary: Obtener un equipo por ID
 *     description: Retorna un equipo basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del equipo
 *     responses:
 *       200:
 *         description: Equipo obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del equipo.
 *                   example: "60d21b4667d0d8992e610c85"
 *                 idequipo:
 *                   type: string
 *                   description: Identificador único del equipo.
 *                   example: "E001"
 *                 equiponombre:
 *                   type: string
 *                   description: Nombre del equipo.
 *                   example: "Equipo A"
 *                 nacionequipo:
 *                   type: string
 *                   description: Nacionalidad del equipo.
 *                   example: "España"
 *                 nombrepiloto:
 *                   type: string
 *                   description: Nombre del piloto principal del equipo.
 *                   example: "Juan"
 *                 nacionespilotos:
 *                   type: string
 *                   description: Nacionalidad del piloto principal del equipo.
 *                   example: "España"
 *       404:
 *         description: Equipo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Equipo no encontrado."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener el equipo."
 */

// ITEMS DETAIL
app.get('/api/equipos/:id', async (req, res) => {
    const id = req.params.id
    const result = await Equipo.find({_id: id})
    res.json(result);
});
/**
 * @swagger
 * /api/equipos/update/{id}:
 *   post:
 *     tags:
 *       - Equipos
 *     summary: Actualizar un equipo por ID
 *     description: Actualiza los detalles de un equipo basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del equipo
 *     requestBody:
 *       description: Datos a actualizar del equipo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idequipo:
 *                 type: string
 *                 description: Identificador único del equipo.
 *                 example: "E001"
 *               equiponombre:
 *                 type: string
 *                 description: Nombre del equipo.
 *                 example: "Equipo A"
 *               nacionequipo:
 *                 type: string
 *                 description: Nacionalidad del equipo.
 *                 example: "España"
 *               nombrepiloto:
 *                 type: string
 *                 description: Nombre del piloto principal del equipo.
 *                 example: "Juan"
 *               nacionespilotos:
 *                 type: string
 *                 description: Nacionalidad del piloto principal del equipo.
 *                 example: "España"
 *     responses:
 *       200:
 *         description: Equipo actualizado con éxito.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Updateado correctamente"
 *       404:
 *         description: Equipo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Equipo no encontrado."
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error en el servidor."
 */
// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/equipos/update/:id", async (req, res) => {
    let id = req.params.id;
    let dataBody = req.body;
    console.log(dataBody)
    try {
        await Equipo.findOneAndUpdate(
            {_id: id},
            {$set: dataBody},
            {new: true}
        );
        const findAllPiloto = await piloto.find({'equipo._id': id});
        for (const pilot of findAllPiloto) {
            await piloto.findOneAndUpdate(
                {_id: pilot._id},
                {$set: {equipo: req.body}},
                {new: true});
        }
        res.send('Updateado correctamente')
        console.log('Updateado id: ', id)
    } catch (error) {
        console.log(error)
        res.send('Error en el servidor.')
    }
});
/**
 * @swagger
 * /api/equipos/{id}:
 *   delete:
 *     tags:
 *       - Equipos
 *     summary: Eliminar un equipo por ID
 *     description: Elimina un equipo basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del equipo
 *     responses:
 *       200:
 *         description: Equipo eliminado con éxito.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Eliminado correctamente"
 *       404:
 *         description: Equipo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Equipo no encontrado."
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error en el servidor."
 */

// ELIMINAR UN ITEM DE EQUIPOS POR ID
app.delete('/api/equipos/:id', async (req, res) => {
    const equipoId = req.params.id;
    try {
        const equipoDeleted = await Equipo.deleteOne({_id: equipoId});
        const findallPilot = await piloto.find({'equipo._id': equipoId});
        for (const pilot of findallPilot) {
            await piloto.updateOne({_id: pilot._id},
                {$set: {equipo: 'No encontrado'}});
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
 *     tags:
 *       - Equipos
 *     summary: Crear un nuevo equipo
 *     description: Crea un nuevo equipo con los datos proporcionados.
 *     requestBody:
 *       description: Datos del nuevo equipo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idequipo:
 *                 type: string
 *                 description: Identificador único del equipo.
 *                 example: "E001"
 *               equiponombre:
 *                 type: string
 *                 description: Nombre del equipo.
 *                 example: "Equipo A"
 *               nacionequipo:
 *                 type: string
 *                 description: Nacionalidad del equipo.
 *                 example: "España"
 *               nombrepiloto:
 *                 type: string
 *                 description: Nombre del piloto principal del equipo.
 *                 example: "Juan"
 *               nacionespilotos:
 *                 type: string
 *                 description: Nacionalidad del piloto principal del equipo.
 *                 example: "España"
 *     responses:
 *       200:
 *         description: Equipo creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error en el servidor."
 */

// INSERTAR UN NUEVO ITEM A EQUIPOS
app.post('/api/equipos', async (req, res) => {
    const params = req.body;
    console.log(params);
    try {
        const nuevoEquipo = await Equipo.create(params);
        res.json(nuevoEquipo)
    } catch (e) {
        console.log(e)
        res.send('Error en el servidor')
    }

});

//////////////////////////// PILOTOS ///////////////////////////////
/**
 * @swagger
 * /api/pilotos:
 *   get:
 *     tags:
 *       - Pilotos
 *     summary: Obtener todos los pilotos
 *     description: Retorna una lista de todos los pilotos.
 *     responses:
 *       200:
 *         description: Lista de pilotos obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pilotos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Piloto'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener los pilotos."
 */

// MUESTRA TODOS LOS PILOTOS
app.get('/api/pilotos', async (req, res) => {
    const pilotos = await piloto.find({});
    res.json({pilotos});
});
/**
 * @swagger
 * /api/pilotos/{id}:
 *   get:
 *     tags:
 *       - Pilotos
 *     summary: Obtener un piloto por ID
 *     description: Retorna un piloto basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piloto
 *     responses:
 *       200:
 *         description: Piloto obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del piloto.
 *                   example: "60d21b4667d0d8992e610c85"
 *                 equipo:
 *                   $ref: '#/components/schemas/Equipo'
 *                 nombrepiloto:
 *                   type: string
 *                   description: Nombre del piloto.
 *                   example: "Juan"
 *                 apellidospiloto:
 *                   type: string
 *                   description: Apellidos del piloto.
 *                   example: "López"
 *                 nacionpiloto:
 *                   type: string
 *                   description: Nacionalidad del piloto.
 *                   example: "España"
 *                 titulospiloto:
 *                   type: string
 *                   description: Títulos del piloto.
 *                   example: "Campeón del mundo 2020"
 *                 imagenpiloto:
 *                   type: string
 *                   description: URL de la imagen del piloto.
 *                   example: "https://example.com/image.jpg"
 *       404:
 *         description: Piloto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Piloto no encontrado."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener el piloto."
 */

// ITEMS DETAIL
app.get('/api/pilotos/:id', async (req, res) => {
    const id = req.params.id
    const result = await piloto.find({_id: id})
    res.json(result);
});
/**
 * @swagger
 * /api/pilotos/update/{id}:
 *   post:
 *     tags:
 *       - Pilotos
 *     summary: Actualizar un piloto por ID
 *     description: Actualiza los detalles de un piloto basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piloto
 *     requestBody:
 *       description: Datos a actualizar del piloto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipo:
 *                 $ref: '#/components/schemas/Equipo'
 *               nombrepiloto:
 *                 type: string
 *                 description: Nombre del piloto.
 *                 example: "Juan"
 *               apellidospiloto:
 *                 type: string
 *                 description: Apellidos del piloto.
 *                 example: "López"
 *               nacionpiloto:
 *                 type: string
 *                 description: Nacionalidad del piloto.
 *                 example: "España"
 *               titulospiloto:
 *                 type: string
 *                 description: Títulos del piloto.
 *                 example: "Campeón del mundo 2020"
 *               imagenpiloto:
 *                 type: string
 *                 description: URL de la imagen del piloto.
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Piloto actualizado con éxito.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Updateado correctamente"
 *       404:
 *         description: Piloto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Piloto no encontrado."
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error en el servidor."
 */
// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/pilotos/update/:id", async (req, res) => {
    let id = req.params.id;
    let dataBody = req.body;
    console.log(dataBody)
    try {
        await piloto.findOneAndUpdate(
            {_id: id},
            {$set: dataBody},
            {new: true}
        );
        res.send('Updateado correctamente')
        // console.log('Updateado id: ', id)
    } catch (error) {
        console.log(error)
        res.send('Error en el servidor.')
    }
});
/**
 * @swagger
 * /api/pilotos/{id}:
 *   delete:
 *     tags:
 *       - Pilotos
 *     summary: Eliminar un piloto por ID
 *     description: Elimina un piloto basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piloto
 *     responses:
 *       200:
 *         description: Piloto eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Piloto eliminado"
 *                 deletedPiloto:
 *                   type: object
 *                   description: Detalles del piloto eliminado.
 *       404:
 *         description: Piloto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Piloto no encontrado"
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar el piloto"
 */

// ELIMINAR UN ITEM DE PILOTOS POR ID
app.delete('/api/pilotos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedPiloto = await piloto.deleteOne({_id: id});
        if (!deletedPiloto) {
            return res.status(404).json({error: 'Piloto no encontrado'});
        }
        res.json({message: 'Piloto eliminado', deletedPiloto});
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar el piloto'});
    }
});
/**
 * @swagger
 * /api/pilotos:
 *   post:
 *     tags:
 *       - Pilotos
 *     summary: Crear un nuevo piloto
 *     description: Crea un nuevo piloto con los datos proporcionados.
 *     requestBody:
 *       description: Datos del nuevo piloto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipo:
 *                 $ref: '#/components/schemas/Equipo'
 *               nombrepiloto:
 *                 type: string
 *                 description: Nombre del piloto.
 *                 example: "Juan"
 *               apellidospiloto:
 *                 type: string
 *                 description: Apellidos del piloto.
 *                 example: "López"
 *               nacionpiloto:
 *                 type: string
 *                 description: Nacionalidad del piloto.
 *                 example: "España"
 *               titulospiloto:
 *                 type: string
 *                 description: Títulos del piloto.
 *                 example: "Campeón del mundo 2020"
 *               imagenpiloto:
 *                 type: string
 *                 description: URL de la imagen del piloto.
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Piloto creado con éxito.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Insertado correctamente"
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Error en el servidor."
 */

// INSERTAR UN NUEVO ITEM A PILOTOS
app.post('/api/pilotos', async (req, res) => {
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
    res.render('index', {title: 'Formula 1'})
});

app.get('/contact', (req, res) => {
    res.render('contact', {title: 'Contacto'})
});
app.get('/about', (req, res) => {
    res.render('about', {title: 'About'})
});

app.get('/equipos/detalles/:id', async (req, res) => {
    const id = req.params.id
    const query = await Equipo.find({_id: id});
    console.log(query)
    const params = {
        title: 'Detalles Equipo',
        equipo: query[0]
    }
    res.render('detalles_equipo', params)
});

app.get('/pilotos/detalles/:id', async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        const query = await piloto.find({_id: id});
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
app.get('/pilotos/update/:id', async (req, res) => {
    const id = req.params.id
    const query = await piloto.find({_id: id});
    const equipos = await Equipo.find({});
    console.log(query)
    const params = {
        title: 'Update Piloto',
        pilotos: query[0],
        equipos: equipos
    }
    res.render('update_piloto', params)
});

// Update quipo
app.post("/pilotos/update", async (req, res) => {
    try {
        const {id,nombrepiloto, apellidospiloto, nacionpiloto, titulospiloto, imagenpiloto, equipo} = req.body;
        const equipoSelec = await Equipo.find({_id: equipo})
        const nuevoPiloto = await piloto.findOneAndUpdate({_id: id}, {
                nombrepiloto,
                apellidospiloto,
                nacionpiloto,
                titulospiloto,
                imagenpiloto,
                equipo: equipoSelec[0]
            },
            {new: false});
        console.log('insertado!', nuevoPiloto)

        res.redirect('/pilotos');
    } catch (error) {
        console.error(error);
        res.send(500);
    }
});

// INSERT ITEM GET: show form
app.get('/pilotos/insert', async (req, res) => {
    const equipos = await Equipo.find({});
    console.log(equipos)
    res.render('insert_piloto',
        {title: 'insert piloto', equipos: equipos},
    )
});

//Insertar piloto
app.post('/pilotos/insert', async (req, res) => {
    const {nombrepiloto, apellidospiloto, nacionpiloto, titulospiloto, imagenpiloto, equipo} = req.body;
    // console.log(params)
    try {
        const equipoSelec = await Equipo.find({_id: equipo})
        const nuevoPiloto = await piloto.create({
            nombrepiloto,
            apellidospiloto,
            nacionpiloto,
            titulospiloto,
            imagenpiloto,
            equipo: equipoSelec[0]
        });
        console.log('insertado!', nuevoPiloto)
        res.redirect('/pilotos')
    } catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});

//////////////////////////// EQUIPOS ///////////////////////////////

// Show ALL Items
app.get('/equipos', async (req, res) => {
    const query = await Equipo.find({})
    // console.log(query)
    const params = {
        title: 'Equipos',
        equipos: query
    }
    // console.log(params)
    res.render('equipos', params);
});
// Update quipo
app.post("/equipos/update", async (req, res) => {
    try {
        const equipoId = req.body.id
        await Equipo.findOneAndUpdate({_id: req.body.id}, req.body, {new: false});
        const findAllPilot = await piloto.find({'equipo._id': equipoId});
        // console.log(findAllPilot);
        for (const pilot of findAllPilot) {
            await piloto.findOneAndUpdate({_id: pilot._id},
                {$set: {equipo: req.body}}, {new: false});
            console.log("Piloto: ", pilot);
        }
        res.redirect('/equipos');
    } catch (error) {
        console.error(error);
        res.send(500);
    }
});
// INSERT ITEM GET: show form
app.get('/equipos/insert', (req, res) => {
    res.render('insert_equipo',
        {title: 'insert equipo'}
    )
});
// INSERT ITEM POST: get params and do your mojo!
app.post('/equipos/insert', async (req, res) => {
    const params = req.body
    console.log('params', params)
    try {
        const nuevoEquipo = Equipo.create(params);
        console.log('insertado!', nuevoEquipo)
        res.redirect('/equipos')
    } catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
});
// UPDATE ITEM
app.get('/equipos/update/:id', async (req, res) => {
    const id = req.params.id
    const query = await Equipo.find({_id: id});
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

