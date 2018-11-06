const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//-----------------------------------------------------------------------
// Configura MongoDB
//-----------------------------------------------------------------------
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function imprime(cabecalho,conteudo){
    console.log("");
	console.log(cabecalho);
	console.log("  " + conteudo);
    console.log("");
}

//-----------------------------------------------------------------------
// Conecta MongoDB
//-----------------------------------------------------------------------
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    imprime(" MongoDB ", " Conexão concluída com sucesso ! ");  
}).catch(err => {
    console.log('Erro ao conectar com MongoDB. Saindo...', err);
    process.exit();
});

//-----------------------------------------------------------------------
// Rota Default
//-----------------------------------------------------------------------
app.get('/', (req, res) => {
    res.json({"message": "Come to the dark side."});
});

//-----------------------------------------------------------------------
// Rotas POST GET DELETE
//-----------------------------------------------------------------------
require('./app/routes/planeta.routes.js')(app);

//-----------------------------------------------------------------------
// Inicia Servidor
//-----------------------------------------------------------------------
var port = 3000;
app.listen(port, () => {
	imprime(" Node ", " Servidor iniciado. API dísponivel em: http://localhost:" + port + "/planetas");  
});