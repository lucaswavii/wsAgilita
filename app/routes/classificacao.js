module.exports = function(application){
    
    application.get('/classificacaoNovo', function(req, res){
        application.app.controllers.classificacao.novo(application, req, res);
    });

    application.get('/classificacaoEditar/:_id', function(req, res){
        application.app.controllers.classificacao.editar(application, req, res);
    });

    application.get('/classificacaoExcluir/:_id', function(req, res){
        application.app.controllers.classificacao.excluir(application, req, res);
    });

    application.post('/classificacaoSalvar', function(req, res){
        application.app.controllers.classificacao.salvar(application, req, res);
    });
}