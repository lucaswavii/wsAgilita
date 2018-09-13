module.exports.index = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var idConciliador = req.params._id;
    
    var connection = application.config.dbConnection();
    var conciliacaoDao = new application.app.models.ConciliacaoRelatorioDAO(connection);
    conciliacaoDao.listar(idConciliador,function(error, resultado){
        connection.end();
        res.render('relatorioConciliado', { validacao : {}, resultado:resultado, sessao: req.session.usuario })   
    });
}