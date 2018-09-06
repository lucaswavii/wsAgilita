module.exports = function(application){
    
    application.get('/contratoNovo', function(req, res){
        application.app.controllers.contrato.novo(application, req, res);
    });

    application.get('/contratoEditar/:_id', function(req, res){
        application.app.controllers.contrato.editar(application, req, res);
    });

    application.get('/contratoExcluir/:_id', function(req, res){
        application.app.controllers.contrato.excluir(application, req, res);
    });

    application.post('/contratoSalvar', function(req, res){
        application.app.controllers.contrato.salvar(application, req, res);
    });
}