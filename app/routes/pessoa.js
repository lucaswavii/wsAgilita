module.exports = function(application){
    
    application.get('/pessoaNovo', function(req, res){
        application.app.controllers.pessoa.novo(application, req, res);
    });

    application.get('/pessoaEditar/:_id', function(req, res){
        application.app.controllers.pessoa.editar(application, req, res);
    });

    application.get('/pessoaExcluir/:_id', function(req, res){
        application.app.controllers.pessoa.excluir(application, req, res);
    });

    application.post('/pessoaSalvar', function(req, res){
        application.app.controllers.pessoa.salvar(application, req, res);
    });
}