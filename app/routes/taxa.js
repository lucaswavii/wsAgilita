module.exports = function(application){
    
    application.get('/taxa/:_id', function(req, res){
        application.app.controllers.taxa.index(application, req, res);
    });

    application.get('/taxaNovo', function(req, res){
        application.app.controllers.taxa.novo(application, req, res);
    });

    application.get('/taxaEditar/:_id', function(req, res){
        application.app.controllers.taxa.editar(application, req, res);
    });

    application.get('/taxaExcluir/:_id', function(req, res){
        application.app.controllers.taxa.excluir(application, req, res);
    });

    application.post('/taxaSalvar', function(req, res){
        application.app.controllers.taxa.salvar(application, req, res);
    });
}