module.exports = function(application){
    
    application.get('/configuracaoNovo', function(req, res){
        application.app.controllers.configuracao.novo(application, req, res);
    });

    application.get('/configuracaoEditar/:_id', function(req, res){
        application.app.controllers.configuracao.editar(application, req, res);
    });

    application.get('/configuracaoExcluir/:_id', function(req, res){
        application.app.controllers.configuracao.excluir(application, req, res);
    });

    application.post('/configuracaoSalvar', function(req, res){
        application.app.controllers.configuracao.salvar(application, req, res);
    });
}