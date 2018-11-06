module.exports = (app) => {
    const planetas = require('../controllers/planeta.controller.js');

    app.post('/planetas/', planetas.create);

    app.get('/planetas/', planetas.findAll);

    app.get('/planetas/:planetaId', planetas.findOne);

    app.get('/planetas/nome/:nome', planetas.findField);

    //Não usado
    //app.put('/planetas/:planetaId', planetas.update);

    app.delete('/planetas/:planetaId', planetas.delete);
}