module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var bandeiraDao = new application.app.models.BandeiraDAO(connection);
    
    bandeiraDao.listar(function(error, bandeiras){
        connection.end();
        if( error ) {
            res.render('bandeira', { validacao : [ {'msg': error }], bandeiras : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('bandeira', { validacao : {}, bandeiras : bandeiras, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var bandeiraDao = new application.app.models.BandeiraDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        bandeiraDao.listar(function(error, bandeiras){
            connection.end();
            res.render('bandeira', { validacao : [ {'msg': 'ID de edição não foi informado.' }], bandeiras : bandeiras, sessao: req.session.usuario  });
            return;
        });
    }

    bandeiraDao.editar( id, function(error, result){
       
        if( error ) {
            bandeiraDao.listar(function(error, bandeiras){
                connection.end();
                res.render('bandeira', { validacao : [ {'msg': error }], bandeiras : bandeiras, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('bandeira', { validacao : {}, bandeiras : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var bandeiraDao = new application.app.models.BandeiraDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('bandeira', { validacao : [ {'msg': 'ID de edição não foi informado.' }], bandeiras : {}, sessao: req.session.usuario  });
        return;
    }

    bandeiraDao.excluir( id, function(error, result){
        
        if( error ) {

            bandeiraDao.listar(function(error, bandeiras){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('bandeira', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], bandeiras : bandeiras, sessao: req.session.usuario  });
                } else {                
                    res.render('bandeira', { validacao : [ {'msg': error }], bandeiras : bandeiras, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/bandeira");
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
        res.render('bandeira', {validacao: erros,  bandeiras: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var bandeiraDao = new application.app.models.BandeiraDAO(connection);      
    
    bandeiraDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            
            bandeiraDao.listar(function(error, bandeiras){      
                connection.end();               
                res.render('bandeira', { validacao : error, bandeiras : bandeiras, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/bandeira');

    });
     
}