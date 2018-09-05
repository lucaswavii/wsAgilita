module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);
    
    classificacaoDao.listar(function(error, classificacoes){
        connection.end();
        if( error ) {
            res.render('classificacao', { validacao : [ {'msg': error }], classificacoes : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('classificacao', { validacao : {}, classificacoes : classificacoes, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    var connection = application.config.dbConnection();
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        classificacaoDao.listar(function(error, classificacoes){
            connection.end();
            res.render('classificacao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], classificacoes : classificacoes, sessao: req.session.usuario  });
            return;
        });
    }

    classificacaoDao.editar( id, function(error, result){
       
        if( error ) {
            classificacaoDao.listar(function(error, classificacoes){
                connection.end();
                res.render('classificacao', { validacao : [ {'msg': error }], classificacoes : classificacoes, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('classificacao', { validacao : {}, classificacoes : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('classificacao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], classificacoes : {}, sessao: req.session.usuario  });
        return;
    }

    classificacaoDao.excluir( id, function(error, result){
        
        if( error ) {

            classificacaoDao.listar(function(error, classificacoes){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('classificacao', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], classificacoes : classificacoes, sessao: req.session.usuario  });
                } else {                
                    res.render('classificacao', { validacao : [ {'msg': error }], classificacoes : classificacoes, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/classificacao");
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
        res.render('classificacao', {validacao: erros,  classificacoes: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);      
    
    classificacaoDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            classificacaoDao.listar(function(error, classificacoes){      
                connection.end();               
                res.render('classificacao', { validacao : error, classificacoes : classificacoes, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/classificacao');

    });
     
}