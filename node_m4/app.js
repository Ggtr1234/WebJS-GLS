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

// let equipos = [
//     {id: 1, idequipo: "mercedes", equiponombre: "Mercedes-AMG Petronas Formula One Team", nacionequipo: "Alemanes", nombrepiloto: ["Lewis Hamilton", "Valtteri Bottas"], nacionespilotos: "GBR FIN"},
//     {id: 2, idequipo: "redbull", equiponombre: "Red Bull Racing", nacionequipo: "Austriacos", nombrepiloto: ["Max Verstappen", "Sergio Pérez Mendoza"], nacionespilotos: "NLD MX"},
//     {id: 3, idequipo: "ferrari", equiponombre: "Scuderia Ferrari", nacionequipo: "Italianos", nombrepiloto: ["Charles Leclerc", "Carlos Sainz Vázquez"], nacionespilotos: "MC ESP"},
//     {id: 4, idequipo: "mclaren", equiponombre: "McLarenF1 Team", nacionequipo: "Britanicos", nombrepiloto: ["Lando Norris", "Daniel Ricciardo"], nacionespilotos: "GBr AUS"},
//     {id: 5, idequipo: "astonmartin", equiponombre: "Aston Martin Cognizant Formula One Team", nacionequipo: "Britanicos", nombrepiloto: ["Sebastian Vettel", "Lance Stroll"], nacionespilotos: "DEU CAN"},
// ]
//
// let pilotos = [
//     {id: 1, idequipo: "mercedes", nombrepiloto: "Lewis", apellidospiloto: "Hamilton", nacionpiloto: "Reino Unido", titulospiloto: "Siete veces Campeon del Mundo de Formula 1", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/hamilton.jpg.img.1536.high.jpg"},
//     {id: 2, idequipo: "mercedes", nombrepiloto: "Valtteri", apellidospiloto: "Bottas", nacionpiloto: "Finlandia", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/bottas.jpg.img.1536.high.jpg"},
//     {id: 3, idequipo: "redbull", nombrepiloto: "Max", apellidospiloto: "Verstappen", nacionpiloto: "Paises Bajos", titulospiloto: "Campeon del Mundo de Formula 1", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/verstappen.jpg.img.640.medium.jpg/1677069646195.jpg"},
//     {id: 4, idequipo: "redbull", nombrepiloto: "Sergio", apellidospiloto: "Perez Mendoza", nacionpiloto:"Mexico", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/perez.jpg.img.1536.high.jpg"},
//     {id: 5, idequipo: "ferrari", nombrepiloto: "Charles", apellidospiloto: "Leclerc", nacionpiloto: "Monaco", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/leclerc.jpg.img.1536.high.jpg"},
//     {id: 6, idequipo: "ferrari", nombrepiloto: "Carlos", apellidospiloto: "Sainz Vazquez", nacionpiloto: "España", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/sainz.jpg.img.1536.high.jpg"},
//     {id: 7, idequipo: "mclaren", nombrepiloto: "Lando", apellidospiloto: "Norris", nacionpiloto: "Reino Unido", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/norris.jpg.img.1536.high.jpg"},
//     {id: 8, idequipo: "mclaren", nombrepiloto: "Daniel", apellidospiloto: "Ricciardo", nacionpilot: "Australia", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/ricciardo.jpg.img.1536.high.jpg"},
//     {id: 9, idequipo: "astonmartin", nombrepiloto: "Sebastian", apellidospiloto: "Vettel", nacionpiloto: "Alemania", titulospiloto: "Cuatro veces Campeon del Mundo de Formula 1", imagenpiloto: "https://hips.hearstapps.com/hmg-prod/images/dsc-2917-edit-1-1645185757.jpg"},
//     {id: 10, idequipo: "astonmartin", nombrepiloto: "Lance", apellidospiloto: "Stroll", nacionpiloto: "Canada", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/stroll.jpg.img.1536.high.jpg"}
// ]

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
const db = require('knex')({
    client:'sqlite3',
    connection: './f1.sqlite',
});

function findItem(where, id){
    for (let i = 0; i < where.length ; i++) {
        if (where[i].id == id){
            return i
        }
    }
    return -1;
}
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
 * /api/equipos:
 *   get:
 *     tags: [API Equipos]
 *     summary: Obtener todos los equipos
 *     description: Obtiene una lista de todos los equipos.
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida correctamente
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
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       nacion:
 *                         type: string
 *                       campeonatos:
 *                         type: integer
 *                       historia:
 *                         type: string
 *                       imagen:
 *                         type: string
 *       500:
 *         description: Error en el servidor al obtener la lista de equipos
 */
// MUESTRA TODOS LOS EQUIPOS
app.get('/api/equipos', async (req, res) => {
    await db.select('*')
        .from('equipos')
        .then(function (data){
            data = {equipos: data}
            res.send(data)
        })
        .catch(function (error){
            console.log(error)
        })
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
    const id = parseInt(req.params.id)
    const result = await db.select('*').from('equipos').where('id', id);
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
    const id = parseInt(req.params.id)
    const result = await db.select('*').from('pilotos').where('id', id);
    res.send(result);
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
    const query = await db('pilotos')
        .select('pilotos.id', 'pilotos.nombre', 'pilotos.edad', 'pilotos.nacion', 'pilotos.premios', 'pilotos.imagen', 'equipos.nombre AS nombreEquipo')
        .leftJoin('equipos', 'pilotos.idEquipo', 'equipos.id')
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
    const query = await db('equipos')
        .select('*')
    // console.log(query)
    const params = {
        title: 'Equipos',
        equipos: query
    }
    console.log(params)
    res.render('equipos', params);
});
// Update quipo
app.post("/pilotos/update", async (req, res)=>{
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
app.get('/pilotos/update/:id', async (req,res)=>{
    const id = req.params.id
    const query = await db('equipos').where('id', '=', id).first();
    console.log(query)
    const params = {
        title: 'Update Equipo',
        pilotos: query
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

