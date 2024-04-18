const mongoose = require('mongoose');

const pilotoSchema = new mongoose.Schema({
    idequipo: {
        type: String,
        required: true,
        ref: 'Equipo'
    },
    nombrepiloto: {
        type: String,
        required: true
    },
    apellidospiloto: {
        type: String,
        required: true
    },
    nacionpiloto: {
        idnacion: {
            type: String,
            required: true
        },
        "#text": {
            type: String,
            required: true
        }
    },
    titulospiloto: {
        type: String,
        required: true
    },
    imagenpiloto: {
        type: String,
        required: true
    }
});

const Piloto = mongoose.model('Piloto', pilotoSchema);

module.exports = Piloto;
