module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var solucaoDao = new application.app.models.SolucaoDAO(connection);
    var tipoDao = new application.app.models.TipoDAO(connection);

    solucaoDao.listar(function(error, solucoes){

        tipoDao.listar(function(error, tipos){

            connection.end();
            if( error ) {
                res.render('solucao', { validacao : [ {'msg': error }], solucoes : {}, tipos:{}, sessao: req.session.usuario  });
                return;
            }
            res.render('solucao', { validacao : {}, solucoes : solucoes, tipos:tipos, sessao: req.session.usuario });
        });
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var solucaoDao = new application.app.models.SolucaoDAO(connection);
    var tipoDao = new application.app.models.TipoDAO(connection);

    var id = req.params._id;

    if( !id ) {
        
        solucaoDao.listar(function(error, solucoes){

            tipoDao.listar(function(error, tipos){
            
                connection.end();
                res.render('solucao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], solucoes : solucoes, tipos:tipos, sessao: req.session.usuario  });
                return;
            });
        });
    }

    solucaoDao.editar( id, function(error, result){
       
        if( error ) {
            solucaoDao.listar(function(error, solucoes){
                tipoDao.listar(function(error, tipos){
                    connection.end();
                    res.render('solucao', { validacao : [ {'msg': error }], solucoes : solucoes, tipos:tipos, sessao: req.session.usuario  });
                    return;
                });
            });
        }
        
        tipoDao.listar(function(error, tipos){
            connection.end();
            res.render('solucao', { validacao : {}, solucoes : result, tipos:tipos, sessao: req.session.usuario });
            return;
        });
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var solucaoDao = new application.app.models.SolucaoDAO(connection);
    var tipoDao = new application.app.models.TipoDAO(connection);

    var id = req.params._id;
    
    if( !id ) {
        tipoDao.listar(function(error, tipos){
            res.render('solucao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], solucoes : {}, tipos:tipos, sessao: req.session.usuario  });
            return;
        });
    }

    solucaoDao.excluir( id, function(error, result){
        
        if( error ) {

            solucaoDao.listar(function(error, solucoes){ 
                tipoDao.listar(function(error, tipos){
                    if(error.errno != undefined && error.errno == 1451) { 
                        connection.end();
                        res.render('solucao', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], solucoes : solucoes, tipos:tipos, sessao: req.session.usuario  });
                    } else {                
                        res.render('solucao', { validacao : [ {'msg': error }], solucoes : solucoes, tipos:tipos, sessao: req.session.usuario   });
                        return;
                    }
                });
            });
        }
        connection.end();
        res.redirect("/solucao");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var solucaoDao = new application.app.models.SolucaoDAO(connection);      
    var tipoDao = new application.app.models.TipoDAO(connection);
        
    var dadosForms = req.body;

    req.assert('nome', 'Nome é obrigatório!').notEmpty();       

    var erros = req.validationErrors();

    if(erros){
        tipoDao.listar(function(error, tipos){
            res.render('solucao', {validacao: erros,  solucoes: [dadosForms], tipos:tipos, sessao: req.session.usuario});
            return;
        });
    }
    
    
    solucaoDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            solucaoDao.listar(function(error, solucoes){      
                tipoDao.listar(function(error, tipos){
                    connection.end();               
                    res.render('solucao', { validacao : error, solucoes : solucoes, tipos:tipos, sessao: req.session.usuario });
                    return;
                });
            });
        }
        connection.end();  
        res.redirect('/solucao');

    });
     
}