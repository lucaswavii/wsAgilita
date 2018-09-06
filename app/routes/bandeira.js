module.exports = function(application){
    
    application.get('/bandeiraNovo', function(req, res){
        application.app.controllers.bandeira.novo(application, req, res);
    });

    application.get('/bandeiraEditar/:_id', function(req, res){
        application.app.controllers.bandeira.editar(application, req, res);
    });

    application.get('/bandeiraExcluir/:_id', function(req, res){
        application.app.controllers.bandeira.excluir(application, req, res);
    });

    application.post('/bandeiraSalvar', function(req, res){
        application.app.controllers.bandeira.salvar(application, req, res);
    });
}