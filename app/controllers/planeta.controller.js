const Planeta = require('../models/planeta.model.js');
const Counter = require('../models/counter.model.js');

var request = require("request");

/************************************************************/
/* Retorna conteudo de um 'response'                        */
/************************************************************/
async function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

/************************************************************/
/* Retorna 'links' para os filmes do planeta inserido       */
/************************************************************/
async function urlFilmes(conteudo,busca){
    let links = [];
    JSON.parse(conteudo, function(k, v) {
        let filme = v + ""; 
        if(filme.includes(busca)){
            links.push(v);
        }
    });
  return new Promise(function (resolve, reject) {
    resolve(links);
  });
}

/************************************************************/
/* Cria sequencia planetaId caso não exista                 */
/************************************************************/
async function createSequence(){
    Counter.findById({"_id":"planetaId"})
        .then(counter => {
            if(counter === null || counter === "null"){
                // --- NEW COUNTER
                const counter = new Counter({
                    _id: "planetaId",
                    seq: "1"
                });
               // --- SAVE COUNTER
                counter.save()
                .then(data => {
                    console.log("");
                    console.log("createSequence() - Gravando sequence: " + data);
                }).catch(err => {
                    console.log("");
                    console.log("createSequence() - Erro ao gravar: " + err);
                });
            }
        }).catch(err => {
             console.log("");
             console.log("createSequence() - Gravando sequence: " + err);
        });
}
//------------------------------------------------------------------------------------
// ADICIONAR UM PLANETA
//------------------------------------------------------------------------------------
exports.create = (req, res) => {

    var nome = req.body.nome;

    async function gravaPlaneta(nome) {

        //-----------------------------------------------------------------------------
        // SEQ: planetaId
        //-----------------------------------------------------------------------------
        await createSequence();

        //-----------------------------------------------------------------------------
        // QTD FILMES
        //-----------------------------------------------------------------------------
        var url = "https://swapi.co/api/planets/?search="+nome;

        let body = await doRequest(url);

        let JSONbody = JSON.parse(body).results;

        let xUrl = await urlFilmes(body,"films");

        let xQtdFilmes = xUrl.length;
        //-----------------------------------------------------------------------------

        // COUNTER: planetaId
        Counter.findById({"_id":"planetaId"})
            .then(counter => {

                valor = counter.seq++;

                // --- NEW PLANETA 
                const planeta = new Planeta({
                    _id: valor,
                    nome: req.body.nome, 
                    clima: req.body.clima, 
                    terreno: req.body.terreno,
                    qtdApFilmes: xQtdFilmes,
                });

                // --- SAVE PLANETA 
                planeta.save()
                .then(data => {
                    res.send(data);
                    console.log("");
                    console.log("gravaPlaneta() - Gravando planeta: " + data);
                }).catch(err => {
                    console.log("");
                    console.log("gravaPlaneta() - Erro ao gravar: " + err);
                });

                // --- SAVE COUNTER
                counter.save()
                .then(data => {
                    console.log("");
                    console.log("gravaPlaneta() - Atualiza sequence: " + data);
                }).catch(err => {
                    console.log("");
                    console.log("gravaPlaneta() - Erro ao gravar: " + err);
                });

        }).catch(err => {
            console.log("gravaPlaneta() - Erro ao gravar: " + err);
        });

}

gravaPlaneta(nome);

};

//------------------------------------------------------------------------------------
// LISTAR PLANETAS
//------------------------------------------------------------------------------------
exports.findAll = (req, res) => {

    Planeta.find()
    .then(planetas => {
        res.send(planetas);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Ocorreu algum erro ao consultar os dados."
        });
    });

};

//------------------------------------------------------------------------------------
// BUSCAR POR ID
//------------------------------------------------------------------------------------
exports.findOne = (req, res) => {

    Planeta.findById(req.params.planetaId)
    .then(planeta => {
        if(!planeta) {
            return res.status(404).send({
                message: "Não existe planeta com este ID: " + req.params.planetaId
            });            
        }
        res.send(planeta);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Não existe planeta com este ID: " + req.params.planetaId
            });                
        }
        return res.status(500).send({
            message: "Não existe planeta com este ID: " + req.params.planetaId
        });
    });
};

//------------------------------------------------------------------------------------
// BUSCAR POR NOME
//------------------------------------------------------------------------------------
exports.findField = (req, res) => {
    Planeta.find({nome:req.params.nome})
    .then(planeta => {
        if(!planeta) {
            return res.status(404).send({
                message: "Não existe planeta com este nome: " + req.params.nome
            });            
        }
        res.send(planeta);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Não existe planeta com este nome: " + req.params.nome
            });                
        }
        return res.status(500).send({
            message: "Não existe planeta com este nome: " + req.params.nome
        });
    });
};

//------------------------------------------------------------------------------------
// ALTERAR - Não usado
//------------------------------------------------------------------------------------
exports.update = (req, res) => {

    Planeta.findByIdAndUpdate(req.params.planetaId, {
        _id: req.body._id,
        nome: req.body.nome,
        clima: req.body.clima,
        terreno: req.body.terreno,
        qtdApFilmes: req.body.qtdApFilmes
    }, {new: true})
    .then(planeta => {
        if(!planeta) {
            return res.status(404).send({
                message: "Não existe planeta com este ID: " + req.params.planetaId
            });
        }
        res.send(planeta);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Não existe planeta com este ID: " + req.params.planetaId
            });                
        }
        return res.status(500).send({
            message: "Erro ao atualizar planeta com este ID: " + req.params.planetaId
        });
    });
};

//------------------------------------------------------------------------------------
// REMOVER PLANETAS
//------------------------------------------------------------------------------------
exports.delete = (req, res) => {

	Planeta.findByIdAndRemove(req.params.planetaId)
    .then(planeta => {
        if(!planeta) {
            return res.status(404).send({
                message: "Não existe planeta com este ID: " + req.params.planetaId
            });
        }

        res.send({message: ("Planeta deletado: " + planeta.nome)});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Não existe planeta com este ID: " + req.params.planetaId
            });                
        }
        return res.status(500).send({
            message: "Não foi possível deletar o planeta com este ID: " + req.params.planetaId
        });
    });
};