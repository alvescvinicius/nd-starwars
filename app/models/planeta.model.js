const mongoose = require('mongoose');

const PlanetaSchema = mongoose.Schema({
	_id: Number,
    nome: String,
    clima: String,
    terreno: String,
    qtdApFilmes: Number
});

module.exports = mongoose.model('Planeta', PlanetaSchema);