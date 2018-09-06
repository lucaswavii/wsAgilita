module.exports = function(application){
    
    application.get('/tipoNovo', function(req, res){
        application.app.controllers.tipo.novo(application, req, res);
    });

    application.get('/tipoEditar/:_id', function(req, res){
        application.app.controllers.tipo.editar(application, req, res);
    });

    application.get('/tipoExcluir/:_id', function(req, res){
        application.app.controllers.tipo.excluir(application, req, res);
    });

    application.post('/tipoSalvar', function(req, res){
        application.app.controllers.tipo.salvar(application, req, res);
    });
}