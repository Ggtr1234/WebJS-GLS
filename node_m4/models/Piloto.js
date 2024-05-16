const mongoose = require('mongoose');

const pilotoSchema = new mongoose.Schema({

    equipo: {
        _id: mongoose.Schema.Types.ObjectId,
        idequipo: String,
        equiponombre: String,
        nacionequipo: String,
        nombrepiloto: String,
        nacionespilotos: String
    },
    nombrepiloto: String,
    apellidospiloto: String,
    nacionpiloto: String,
    titulospiloto: String,
    imagenpiloto: String
});

const Piloto = mongoose.model('Piloto', pilotoSchema);

module.exports = Piloto;
