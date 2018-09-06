module.exports = function(application){
    
    application.get('/solucaoNovo', function(req, res){
        application.app.controllers.solucao.novo(application, req, res);
    });

    application.get('/solucaoEditar/:_id', function(req, res){
        application.app.controllers.solucao.editar(application, req, res);
    });

    application.get('/solucaoExcluir/:_id', function(req, res){
        application.app.controllers.solucao.excluir(application, req, res);
    });

    application.post('/solucaoSalvar', function(req, res){
        application.app.controllers.solucao.salvar(application, req, res);
    });
}