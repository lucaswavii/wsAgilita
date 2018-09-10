module.exports = function(application){
    
    application.get('/schedulerNovo', function(req, res){
        application.app.controllers.scheduler.novo(application, req, res);
    });

    application.get('/schedulerEditar/:_id', function(req, res){
        application.app.controllers.scheduler.editar(application, req, res);
    });

    application.get('/schedulerExcluir/:_id', function(req, res){
        application.app.controllers.scheduler.excluir(application, req, res);
    });

    application.post('/schedulerSalvar', function(req, res){
        application.app.controllers.scheduler.salvar(application, req, res);
    });
}