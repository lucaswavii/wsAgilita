module.exports = function(application){
    
    application.get('/administradoraNovo', function(req, res){
        application.app.controllers.administradora.novo(application, req, res);
    });

    application.get('/administradoraEditar/:_id', function(req, res){
        application.app.controllers.administradora.editar(application, req, res);
    });

    application.get('/administradoraExcluir/:_id', function(req, res){
        application.app.controllers.administradora.excluir(application, req, res);
    });

    application.post('/administradoraSalvar', function(req, res){
        application.app.controllers.administradora.salvar(application, req, res);
    });
}