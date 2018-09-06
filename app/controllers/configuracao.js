module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var configuracaoDao = new application.app.models.ConfiguracaoDAO(connection);
    var empresaDao = new application.app.models.EmpresaDAO(connection); 
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);

    configuracaoDao.listar(function(error, configuracoes){
        
        empresaDao.listar(function(error, empresas){

            classificacaoDao.listar(function(error, classificacoes){

                connection.end();
                if( error ) {
                    res.render('configuracao', { validacao : [ {'msg': error }], configuracoes : {}, empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario  });
                    return;
                }
                res.render('configuracao', { validacao : {}, configuracoes : configuracoes, empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario });
            });
        });
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var configuracaoDao = new application.app.models.ConfiguracaoDAO(connection);
    var empresaDao = new application.app.models.EmpresaDAO(connection); 
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);

    var id = req.params._id;

    if( !id ) {
        configuracaoDao.listar(function(error, configuracoes){
            
            empresaDao.listar(function(error, empresas){

                classificacaoDao.listar(function(error, classificacoes){

                    connection.end();
                    res.render('configuracao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], configuracoes : configuracoes, empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario  });
                    return;
                });
            });
        });
    }

    configuracaoDao.editar( id, function(error, result){
       
        if( error ) {
            configuracaoDao.listar(function(error, configuracoes){
                
                empresaDao.listar(function(error, empresas){

                    classificacaoDao.listar(function(error, classificacoes){
                        
                        connection.end();
                        res.render('configuracao', { validacao : [ {'msg': error }], configuracoes : configuracoes, empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario  });
                        return;
                    });
                });
            });
        }
        connection.end();
        res.render('configuracao', { validacao : {}, configuracoes : result, empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var configuracaoDao = new application.app.models.ConfiguracaoDAO(connection);
    var empresaDao = new application.app.models.EmpresaDAO(connection); 
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        empresaDao.listar(function(error, empresas){

            classificacaoDao.listar(function(error, classificacoes){

                res.render('configuracao', { validacao : [ {'msg': 'ID de edição não foi informado.' }], configuracoes : {},  empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario  });
                return;
            });
        });
    }

    configuracaoDao.excluir( id, function(error, result){
        
        if( error ) {

            configuracaoDao.listar(function(error, configuracoes){ 

                empresaDao.listar(function(error, empresas){

                    classificacaoDao.listar(function(error, classificacoes){
        

                        if(error.errno != undefined && error.errno == 1451) { 
                            connection.end();
                            res.render('configuracao', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], configuracoes : configuracoes, empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario  });
                        } else {                
                            res.render('configuracao', { validacao : [ {'msg': error }], configuracoes : configuracoes, empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario   });
                            return;
                        }
                    });
                });
            });
        }
        connection.end();
        res.redirect("/configuracao");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var dadosForms = req.body;
       
    var connection = application.config.dbConnection();
    var configuracaoDao = new application.app.models.ConfiguracaoDAO(connection);      
    var empresaDao = new application.app.models.EmpresaDAO(connection); 
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);

    configuracaoDao.salvar(dadosForms, function(error, result){
        
        
        
        if( error ) {
            console.log(error)
            configuracaoDao.listar(function(error, configuracoes){  
                empresaDao.listar(function(error, empresas){

                    classificacaoDao.listar(function(error, classificacoes){    
                        connection.end();               
                        res.render('configuracao', { validacao : error, configuracoes : configuracoes,  empresas:empresas, classificacoes:classificacoes, sessao: req.session.usuario });
                        return;
                    });
                });

            });
        }
        connection.end();  
        res.redirect('/configuracao');

    });
     
}