module.exports = function(application){
    
    application.get('/arquivamento/:_id', function(req, res){
        application.app.controllers.arquivamento.index(application, req, res);
    });

    application.post('/arquivamentoSalvar/:_id', function(req, res){
        application.app.controllers.arquivamento.salvar(application, req, res);
    });
    application.get('/arquivamentoExcluir/:_id', function(req, res){
        application.app.controllers.arquivamento.excluir(application, req, res);
    });

    application.get('/conciliar/:_id', function(req, res){
        application.app.controllers.arquivamento.conciliar(application, req, res);
    });
        
}
