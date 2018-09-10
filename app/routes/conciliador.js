module.exports = function(application){
    
    application.get('/conciliadorNovo', function(req, res){
        application.app.controllers.conciliador.novo(application, req, res);
    });

    application.get('/conciliadorEditar/:_id', function(req, res){
        application.app.controllers.conciliador.editar(application, req, res);
    });

    application.get('/conciliadorExcluir/:_id', function(req, res){
        application.app.controllers.conciliador.excluir(application, req, res);
    });

    application.post('/conciliadorSalvar', function(req, res){
        application.app.controllers.conciliador.salvar(application, req, res);
    });
}