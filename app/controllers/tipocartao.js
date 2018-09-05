module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var tipocartaoDao = new application.app.models.TipoCartaoDAO(connection);
    
    tipocartaoDao.listar(function(error, tipocartoes){
        connection.end();
        if( error ) {
            res.render('tipocartao', { validacao : [ {'msg': error }], tipocartoes : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('tipocartao', { validacao : {}, tipocartoes : tipocartoes, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var tipocartaoDao = new application.app.models.TipoCartaoDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        tipocartaoDao.listar(function(error, tipocartoes){
            connection.end();
            res.render('tipocartao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], tipocartoes : tipocartoes, sessao: req.session.usuario  });
            return;
        });
    }

    tipocartaoDao.editar( id, function(error, result){
       
        if( error ) {
            tipocartaoDao.listar(function(error, tipocartoes){
                connection.end();
                res.render('tipocartao', { validacao : [ {'msg': error }], tipocartoes : tipocartoes, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('tipocartao', { validacao : {}, tipocartoes : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var tipocartaoDao = new application.app.models.TipoCartaoDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('tipocartao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], tipocartoes : {}, sessao: req.session.usuario  });
        return;
    }

    tipocartaoDao.excluir( id, function(error, result){
        
        if( error ) {

            tipocartaoDao.listar(function(error, tipocartoes){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('tipocartao', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], tipocartoes : tipocartoes, sessao: req.session.usuario  });
                } else {                
                    res.render('tipocartao', { validacao : [ {'msg': error }], tipocartoes : tipocartoes, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/tipocartao");
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
        res.render('tipocartao', {validacao: erros,  tipocartoes: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var tipocartaoDao = new application.app.models.TipoCartaoDAO(connection);      
    
    tipocartaoDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            tipocartaoDao.listar(function(error, tipocartoes){      
                connection.end();               
                res.render('tipocartao', { validacao : error, tipocartoes : tipocartoes, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/tipocartao');

    });
     
}