module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var tipoparcelaDao = new application.app.models.TipoParcelaDAO(connection);
    
    tipoparcelaDao.listar(function(error, tipoparcelas){
        connection.end();
        if( error ) {
            res.render('tipoparcela', { validacao : [ {'msg': error }], tipoparcelas : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('tipoparcela', { validacao : {}, tipoparcelas : tipoparcelas, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var tipoparcelaDao = new application.app.models.TipoParcelaDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        tipoparcelaDao.listar(function(error, tipoparcelas){
            connection.end();
            res.render('tipoparcela', { validacao : [ {'msg': 'ID de edição não foi informado.' }], tipoparcelas : tipoparcelas, sessao: req.session.usuario  });
            return;
        });
    }

    tipoparcelaDao.editar( id, function(error, result){
       
        if( error ) {
            tipoparcelaDao.listar(function(error, tipoparcelas){
                connection.end();
                res.render('tipoparcela', { validacao : [ {'msg': error }], tipoparcelas : tipoparcelas, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('tipoparcela', { validacao : {}, tipoparcelas : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var tipoparcelaDao = new application.app.models.TipoParcelaDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('tipoparcela', { validacao : [ {'msg': 'ID de edição não foi informado.' }], tipoparcelas : {}, sessao: req.session.usuario  });
        return;
    }

    tipoparcelaDao.excluir( id, function(error, result){
        
        if( error ) {

            tipoparcelaDao.listar(function(error, tipoparcelas){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('tipoparcela', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], tipoparcelas : tipoparcelas, sessao: req.session.usuario  });
                } else {                
                    res.render('tipoparcela', { validacao : [ {'msg': error }], tipoparcelas : tipoparcelas, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/tipoparcela");
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
        res.render('tipoparcela', {validacao: erros,  tipoparcelas: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var tipoparcelaDao = new application.app.models.TipoParcelaDAO(connection);      
    
    tipoparcelaDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            tipoparcelaDao.listar(function(error, tipoparcelas){      
                connection.end();               
                res.render('tipoparcela', { validacao : error, tipoparcelas : tipoparcelas, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/tipoparcela');

    });
     
}