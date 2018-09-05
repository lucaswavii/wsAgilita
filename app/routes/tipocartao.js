module.exports = function(application){
    
    application.get('/tipocartaoNovo', function(req, res){
        application.app.controllers.tipocartao.novo(application, req, res);
    });

    application.get('/tipocartaoEditar/:_id', function(req, res){
        application.app.controllers.tipocartao.editar(application, req, res);
    });

    application.get('/tipocartaoExcluir/:_id', function(req, res){
        application.app.controllers.tipocartao.excluir(application, req, res);
    });

    application.post('/tipocartaoSalvar', function(req, res){
        application.app.controllers.tipocartao.salvar(application, req, res);
    });
}