module.exports = function(application){
    
    application.get('/arquivamento/:_id', function(req, res){
        application.app.controllers.arquivamento.index(application, req, res);
    });

    application.post('/arquivamentoSalvar/:_id', function(req, res){
        application.app.controllers.arquivamento.salvar(application, req, res);
    });

    
}
