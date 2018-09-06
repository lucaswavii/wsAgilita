module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var tipoDao = new application.app.models.TipoDAO(connection);
    
    tipoDao.listar(function(error, tipos){
        connection.end();
        if( error ) {
            res.render('tipo', { validacao : [ {'msg': error }], tipos : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('tipo', { validacao : {}, tipos : tipos, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var tipoDao = new application.app.models.TipoDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        tipoDao.listar(function(error, tipos){
            connection.end();
            res.render('tipo', { validacao : [ {'msg': 'ID de edição não foi informado.' }], tipos : tipos, sessao: req.session.usuario  });
            return;
        });
    }

    tipoDao.editar( id, function(error, result){
       
        if( error ) {
            tipoDao.listar(function(error, tipos){
                connection.end();
                res.render('tipo', { validacao : [ {'msg': error }], tipos : tipos, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('tipo', { validacao : {}, tipos : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var tipoDao = new application.app.models.TipoDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('tipo', { validacao : [ {'msg': 'ID de edição não foi informado.' }], tipos : {}, sessao: req.session.usuario  });
        return;
    }

    tipoDao.excluir( id, function(error, result){
        
        if( error ) {

            tipoDao.listar(function(error, tipos){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('tipo', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], tipos : tipos, sessao: req.session.usuario  });
                } else {                
                    res.render('tipo', { validacao : [ {'msg': error }], tipos : tipos, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/tipo");
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
        res.render('tipo', {validacao: erros,  tipos: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var tipoDao = new application.app.models.TipoDAO(connection);      
    
    tipoDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            tipoDao.listar(function(error, tipos){      
                connection.end();               
                res.render('tipo', { validacao : error, tipos : tipos, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/tipo');

    });
     
}