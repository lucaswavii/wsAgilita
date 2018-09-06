module.exports = function(application){
    
    application.get('/tipoparcelaNovo', function(req, res){
        application.app.controllers.tipoparcela.novo(application, req, res);
    });

    application.get('/tipoparcelaEditar/:_id', function(req, res){
        application.app.controllers.tipoparcela.editar(application, req, res);
    });

    application.get('/tipoparcelaExcluir/:_id', function(req, res){
        application.app.controllers.tipoparcela.excluir(application, req, res);
    });

    application.post('/tipoparcelaSalvar', function(req, res){
        application.app.controllers.tipoparcela.salvar(application, req, res);
    });
}