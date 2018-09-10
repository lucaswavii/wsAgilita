module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var conciliadorDao = new application.app.models.ConciliadorDAO(connection);
    var contratoDao = new application.app.models.ContratoDAO(connection);
    var pessoaDao = new application.app.models.PessoaDAO(connection);
    
    conciliadorDao.listar(function(error, conciliadores){

        contratoDao.listar(function(error, contratos){
           
            pessoaDao.listar(function(error, pessoas){
        
                connection.end();
                if( error ) {
                    res.render('conciliador', { validacao : [ {'msg': error }], conciliadores : {}, contratos:contratos, pessoas:pessoas, sessao: req.session.usuario  });
                    return;
                }
                res.render('conciliador', { validacao : {}, conciliadores:conciliadores, contratos:contratos, pessoas:pessoas, sessao: req.session.usuario });
            })
        });
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var conciliadorDao = new application.app.models.ConciliadorDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        conciliadorDao.listar(function(error, conciliadores){
            connection.end();
            res.render('conciliador', { validacao : [ {'msg': 'ID de edição não foi informado.' }], conciliadores : conciliadores, sessao: req.session.usuario  });
            return;
        });
    }

    conciliadorDao.editar( id, function(error, result){
       
        if( error ) {
            conciliadorDao.listar(function(error, conciliadores){
                connection.end();
                res.render('conciliador', { validacao : [ {'msg': error }], conciliadores : conciliadores, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('conciliador', { validacao : {}, conciliadores : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var conciliadorDao = new application.app.models.ConciliadorDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('conciliador', { validacao : [ {'msg': 'ID de edição não foi informado.' }], conciliadores : {}, sessao: req.session.usuario  });
        return;
    }

    conciliadorDao.excluir( id, function(error, result){
        
        if( error ) {

            conciliadorDao.listar(function(error, conciliadores){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('conciliador', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], conciliadores : conciliadores, sessao: req.session.usuario  });
                } else {                
                    res.render('conciliador', { validacao : [ {'msg': error }], conciliadores : conciliadores, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/conciliador");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var dadosForms = req.body;
    
    var connection = application.config.dbConnection();
    var conciliadorDao = new application.app.models.ConciliadorDAO(connection);      
    
    conciliadorDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            
            conciliadorDao.listar(function(error, conciliadores){      
                connection.end();               
                res.render('conciliador', { validacao : error, conciliadores : conciliadores, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/conciliador');

    });
     
}