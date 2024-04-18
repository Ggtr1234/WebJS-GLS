const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
    idequipo: {
        type: String,
        required: true,
        unique: true
    },
    equiponombre: {
        type: String,
        required: true
    },
    nacionequipo: {
        type: String,
        required: true
    },
    nombrepiloto: [{
        type: String,
        required: true,
        ref: 'Piloto'
    }],
    nacionespilotos: {
        type: String,
        required: true
    }
});

const Equipo = mongoose.model('Equipo', equipoSchema);

module.exports = Equipo;
