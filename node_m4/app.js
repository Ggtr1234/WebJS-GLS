var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let equipos = [
    {id: 1, idequipo: "mercedes", equiponombre: "Mercedes-AMG Petronas Formula One Team", nacionequipo: "Alemanes", nombrepiloto: ["Lewis Hamilton", "Valtteri Bottas"], nacionespilotos: "GBR FIN"},
    {id: 2, idequipo: "redbull", equiponombre: "Red Bull Racing", nacionequipo: "Austriacos", nombrepiloto: ["Max Verstappen", "Sergio Pérez Mendoza"], nacionespilotos: "NLD MX"},
    {id: 3, idequipo: "ferrari", equiponombre: "Scuderia Ferrari", nacionequipo: "Italianos", nombrepiloto: ["Charles Leclerc", "Carlos Sainz Vázquez"], nacionespilotos: "MC ESP"},
    {id: 4, idequipo: "mclaren", equiponombre: "McLarenF1 Team", nacionequipo: "Britanicos", nombrepiloto: ["Lando Norris", "Daniel Ricciardo"], nacionespilotos: "GBr AUS"},
    {id: 5, idequipo: "astonmartin", equiponombre: "Aston Martin Cognizant Formula One Team", nacionequipo: "Britanicos", nombrepiloto: ["Sebastian Vettel", "Lance Stroll"], nacionespilotos: "DEU CAN"},
]

let pilotos = [
    {id: 1, idequipo: "mercedes", nombrepiloto: "Lewis", apellidospiloto: "Hamilton", nacionpiloto: "Reino Unido", titulospiloto: "Siete veces Campeon del Mundo de Formula 1", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/hamilton.jpg.img.1536.high.jpg"},
    {id: 2, idequipo: "mercedes", nombrepiloto: "Valtteri", apellidospiloto: "Bottas", nacionpiloto: "Finlandia", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/bottas.jpg.img.1536.high.jpg"},
    {id: 3, idequipo: "redbull", nombrepiloto: "Max", apellidospiloto: "Verstappen", nacionpiloto: "Paises Bajos", titulospiloto: "Campeon del Mundo de Formula 1", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/verstappen.jpg.img.640.medium.jpg/1677069646195.jpg"},
    {id: 4, idequipo: "redbull", nombrepiloto: "Sergio", apellidospiloto: "Perez Mendoza", nacionpiloto:"Mexico", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/perez.jpg.img.1536.high.jpg"},
    {id: 5, idequipo: "ferrari", nombrepiloto: "Charles", apellidospiloto: "Leclerc", nacionpiloto: "Monaco", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/leclerc.jpg.img.1536.high.jpg"},
    {id: 6, idequipo: "ferrari", nombrepiloto: "Carlos", apellidospiloto: "Sainz Vazquez", nacionpiloto: "España", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/sainz.jpg.img.1536.high.jpg"},
    {id: 7, idequipo: "mclaren", nombrepiloto: "Lando", apellidospiloto: "Norris", nacionpiloto: "Reino Unido", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/norris.jpg.img.1536.high.jpg"},
    {id: 8, idequipo: "mclaren", nombrepiloto: "Daniel", apellidospiloto: "Ricciardo", nacionpilot: "Australia", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/ricciardo.jpg.img.1536.high.jpg"},
    {id: 9, idequipo: "astonmartin", nombrepiloto: "Sebastian", apellidospiloto: "Vettel", nacionpiloto: "Alemania", titulospiloto: "Cuatro veces Campeon del Mundo de Formula 1", imagenpiloto: "https://hips.hearstapps.com/hmg-prod/images/dsc-2917-edit-1-1645185757.jpg"},
    {id: 10, idequipo: "astonmartin", nombrepiloto: "Lance", apellidospiloto: "Stroll", nacionpiloto: "Canada", titulospiloto: "No tiene", imagenpiloto: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/stroll.jpg.img.1536.high.jpg"}
]

const db = require('knex')({
    client:'sqlite3',
    connection: './f1.sqlite'
});

function findItem(where, id){
    for (let i = 0; i < where.length ; i++) {
        if (where[i].id == id){
            return i
        }
    }
    return -1;
}

//////////////////////////////////////////////// API //////////////////////////////////////////////

                  //////////////////////////// EQUIPOS ///////////////////////////////

// MUESTRA TODOS LOS EQUIPOS
app.get('/api/equipos', (req, res) => {
    res.status(200).send(equipos)
});

// ITEMS DETAIL
app.get('/api/equipos/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    let equipo = equipos[findItem(equipos, id)] //usamos findEquipo para no repetir mismo for aqui
    if (!equipo){
        res.status(404).json(' Item ' + id + ' not found')
    }else{
        res.status(200).json(equipo)
    }

});
// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/equipos/update", (req, res)=>{
    //  Indicamos los valores que necesitamos
    let { id, idequipo, equiponombre, nacionequipo, nombrepiloto, nacionespilotos } = req.body;
    let foundIndex = findItem(equipos, id);
    // Valida que esten todos los campos necesarios.
    if (!id || !idequipo || !equiponombre || !nacionequipo || !nombrepiloto || !nacionespilotos) {
        throw new Error('Faltan datos necesarios para la actualización.');
    }
    //Actualizar base de datos
    equipos[foundIndex].idequipo= idequipo
    equipos[foundIndex].equiponombre = equiponombre
    equipos[foundIndex].nacionequipo = nacionequipo
    equipos[foundIndex].nombrepiloto = nombrepiloto
    equipos[foundIndex].nacionespilotos = nacionespilotos
    res.redirect('/equipos')
});
// ELIMINAR UN ITEM DE EQUIPOS POR ID
app.delete('/api/equipos/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    let foundIndex = findItem(equipos, id)
    if (foundIndex == -1){ // si no encuentra
        res.status(404).send('not found')
    }else {
        equipos.splice(foundIndex,1)
        res.status(204).send()
        console.log('Equipo eliminado correctamente')
    }
});
// INSERTAR UN NUEVO ITEM A EQUIPOS
app.post('/api/equipos',(req, res)=>{
    let params = req.body
    params.id = equipos.length +1
    equipos.push(params)
    res.status(201).json(params)
    console.log('Agregado Correctamente')
});
                    //////////////////////////// PILOTOS ///////////////////////////////

// MUESTRA TODOS LOS PILOTOS
app.get('/api/pilotos', (req, res) => {
    res.status(200).send(pilotos)
});
// ITEMS DETAIL
app.get('/api/pilotos/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    let piloto = pilotos[findItem(pilotos, id)] //usamos findEquipo para no repetir mismo for aqui
    if (!piloto){
        res.status(404).json(' Item ' + id + ' not found')
    }else{
        res.status(200).json(piloto)
    }

});
// HACER UPDATE A UN ITEM EN CONCRETO A TRAVES DE ID
app.post("/api/pilotos/update", (req, res)=>{
    //  Indicamos los valores que necesitamos
    let { id, idequipo, nombrepiloto, apellidospiloto, nacionpiloto, titulospiloto, imagenpiloto } = req.body;
    let foundIndex = findItem(pilotos, id);
    // Valida que esten todos los campos necesarios.
    if (!id || !idequipo || !nombrepiloto || !apellidospiloto || !nacionpiloto || !titulospiloto || !imagenpiloto) {
        throw new Error('Faltan datos necesarios para la actualización.');
    }
    //Actualizar base de datos
    pilotos[foundIndex].idequipo= idequipo
    pilotos[foundIndex].nombrepiloto = nombrepiloto
    pilotos[foundIndex].apellidospiloto = apellidospiloto
    pilotos[foundIndex].nacionpiloto = nacionpiloto
    pilotos[foundIndex].titulospiloto = titulospiloto
    pilotos[foundIndex].imagenpiloto = imagenpiloto
    res.redirect('/pilotos')
});
// ELIMINAR UN ITEM DE PILOTOS POR ID
app.delete('/api/pilotos/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    let foundIndex = findItem(pilotos, id)
    if (foundIndex == -1){ // si no encuentra
        res.status(404).send('not found')
    }else {
        pilotos.splice(foundIndex,1)
        res.status(204).send()
        console.log('Piloto eliminado correctamente')
    }
});
// INSERTAR UN NUEVO ITEM A PILOTOS
app.post('/api/pilotos',(req, res)=>{
    let params = req.body
    params.id = pilotos.length +1
    pilotos.push(params)
    res.status(201).json(params)
    console.log('Agregado Correctamente')
});





////////////////////////////////////////// WEB //////////////////////////////////////
            //////////////////////////// PILOTOS ///////////////////////////////

// INDEX
app.get('/', (req, res) => {
    res.render('index',{title:'WEB DE F1'})
});

// Show ALL Items
// app.get('/pilotos', (req, res) => {
//     res.render('pilotos',
//         {
//             title:'PILOTOS',
//             pilotos:pilotos    }
//     )
// })

app.get('/pilotos', (req, res) => {
    res.render('insert_piloto.ejs')
})

// Update quipo
app.post("/pilotos/update", (req, res)=>{
    //  Indicamos los valores que necesitamos
    let { id, idequipo, nombrepiloto, apellidospiloto, nacionpiloto, titulospiloto, imagenpiloto } = req.body;
    let foundIndex = findItem(pilotos, id);
    // Valida que esten todos los campos necesarios.
    if (!id || !idequipo || !nombrepiloto || !apellidospiloto || !nacionpiloto || !titulospiloto || !imagenpiloto) {
        throw new Error('Faltan datos necesarios para la actualización.');
    }
    //Actualizar base de datos
    pilotos[foundIndex].idequipo= idequipo
    pilotos[foundIndex].nombrepiloto = nombrepiloto
    pilotos[foundIndex].apellidospiloto = apellidospiloto
    pilotos[foundIndex].nacionpiloto = nacionpiloto
    pilotos[foundIndex].titulospiloto = titulospiloto
    pilotos[foundIndex].imagenpiloto = imagenpiloto
    res.redirect('/pilotos')
});
// INSERT ITEM GET: show form
app.get('/pilotos/insert', (req,res)=>{
    res.render('insert_piloto',
        {title:'insert piloto'}
    )
});
// INSERT ITEM POST: get params and do your mojo!
// app.post('/pilotos',(req, res)=>{
//     const params = req.body
//     params.id = pilotos.length +1
//     pilotos.push(params)
//     res.redirect('/pilotos')
// });

app.post('/pilotos',async (req, res)=>{
    const params = req.body
    console.log('params',params)
    try {
        const result = await db('pilotos')
        console.log('insertado!', result)
    }catch (e) {
        console.log(e)
        res.status(500).send('error en el servidor')
    }
    res.redirect('/pilotos')
});
// UPDATE ITEM
app.get('/pilotos/update/:id', (req,res)=>{
    const id = req.params.id
    let index =findItem(pilotos, id)
    if (index == -1){
        let msg = 'Error piloto ' + id + ' nofound'
        res.status(404).send({msg})
    }
    let item = pilotos[index];
    let options ={
        title:'update pilotos',
        piloto:item
    }
    res.render('update_piloto',options)
});
        //////////////////////////// EQUIPOS ///////////////////////////////
// Show ALL Items
app.get('/equipos', (req, res) => {
    res.render('equipos',
        {
            title:'EQUIPOS',
            equipos:equipos    }
    )
})
// Update quipo
app.post("/equipos/update", (req, res)=>{
    //  Indicamos los valores que necesitamos
    let { id, idequipo, equiponombre, nacionequipo, nombrepiloto, nacionespilotos } = req.body;
    let foundIndex = findItem(equipos, id);
    // Valida que esten todos los campos necesarios.
    if (!id || !idequipo || !equiponombre || !nacionequipo || !nombrepiloto || !nacionespilotos) {
        throw new Error('Faltan datos necesarios para la actualización.');
    }
    //Actualizar base de datos
    equipos[foundIndex].idequipo= idequipo
    equipos[foundIndex].equiponombre = equiponombre
    equipos[foundIndex].nacionequipo = nacionequipo
    equipos[foundIndex].nombrepiloto = nombrepiloto
    equipos[foundIndex].nacionespilotos = nacionespilotos
    res.redirect('/equipos')
});
// INSERT ITEM GET: show form
app.get('/equipos/insert', (req,res)=>{
    res.render('insert_equipo',
        {title:'insert equipo'}
    )
});
// INSERT ITEM POST: get params and do your mojo!
app.post('/equipos',(req, res)=>{
    const params = req.body
    params.id = equipos.length +1
    equipos.push(params) // DB.insert(...)
    res.redirect('/equipos')
});
// UPDATE ITEM
app.get('/equipos/update/:id', (req,res)=>{
    const id = req.params.id
    console.log('/equipos/update id:',id)
    let index =findItem(equipos, id)
    if (index == -1){
        let msg = 'Error equipo ' + id + ' nofound'
        res.status(404).send({msg})
    }
    let item = equipos[index];
    let options ={
        title:'update equipos',
        item:item
    }
    res.render('update_equipo',options)
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

module.exports = app;
