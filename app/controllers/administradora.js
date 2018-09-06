module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var administradoraDao = new application.app.models.AdministradoraDAO(connection);
    
    administradoraDao.listar(function(error, administradoras){
        connection.end();
        if( error ) {
            res.render('administradora', { validacao : [ {'msg': error }], administradoras : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('administradora', { validacao : {}, administradoras : administradoras, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var administradoraDao = new application.app.models.AdministradoraDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        administradoraDao.listar(function(error, administradoras){
            connection.end();
            res.render('administradora', { validacao : [ {'msg': 'ID de edição não foi informado.' }], administradoras : administradoras, sessao: req.session.usuario  });
            return;
        });
    }

    administradoraDao.editar( id, function(error, result){
       
        if( error ) {
            administradoraDao.listar(function(error, administradoras){
                connection.end();
                res.render('administradora', { validacao : [ {'msg': error }], administradoras : administradoras, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('administradora', { validacao : {}, administradoras : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var administradoraDao = new application.app.models.AdministradoraDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('administradora', { validacao : [ {'msg': 'ID de edição não foi informado.' }], administradoras : {}, sessao: req.session.usuario  });
        return;
    }

    administradoraDao.excluir( id, function(error, result){
        
        if( error ) {

            administradoraDao.listar(function(error, administradoras){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('administradora', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], administradoras : administradoras, sessao: req.session.usuario  });
                } else {                
                    res.render('administradora', { validacao : [ {'msg': error }], administradoras : administradoras, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/administradora");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var dadosForms = req.body;

    req.assert('nome', 'Nome é obrigatório!').notEmpty();       

    var erros = req.validationErrors();

    if(erros){
        res.render('administradora', {validacao: erros,  administradoras: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var administradoraDao = new application.app.models.AdministradoraDAO(connection);      
    
    administradoraDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            administradoraDao.listar(function(error, administradoras){      
                connection.end();               
                res.render('administradora', { validacao : error, administradoras : administradoras, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/administradora');

    });
     
}