module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var empresaDao = new application.app.models.EmpresaDAO(connection);
    
    empresaDao.listar(function(error, empresas){
        connection.end();
        if( error ) {
            res.render('empresa', { validacao : [ {'msg': error }], empresas : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('empresa', { validacao : {}, empresas : empresas, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var empresaDao = new application.app.models.EmpresaDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        empresaDao.listar(function(error, empresas){
            connection.end();
            res.render('empresa', { validacao : [ {'msg': 'ID de edição não foi informado.' }], empresas : empresas, sessao: req.session.usuario  });
            return;
        });
    }

    empresaDao.editar( id, function(error, result){
       
        if( error ) {
            empresaDao.listar(function(error, empresas){
                connection.end();
                res.render('empresa', { validacao : [ {'msg': error }], empresas : empresas, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('empresa', { validacao : {}, empresas : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var empresaDao = new application.app.models.EmpresaDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('empresa', { validacao : [ {'msg': 'ID de edição não foi informado.' }], empresas : {}, sessao: req.session.usuario  });
        return;
    }

    empresaDao.excluir( id, function(error, result){
        
        if( error ) {

            empresaDao.listar(function(error, empresas){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('empresa', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], empresas : empresas, sessao: req.session.usuario  });
                } else {                
                    res.render('empresa', { validacao : [ {'msg': error }], empresas : empresas, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/empresa");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var dadosForms = req.body;
    
    var pathImagem = !dadosForms.pathImagem ? '/images/noImagem.png' : dadosForms.pathImagem;

    if ( req.files.imageFile ) {
        let sampleFile = req.files.imageFile;
        pathImagem = '/images/' + sampleFile.name;
        sampleFile.mv('app/public/images/' + sampleFile.name , function(err) {
            if (err)
              return res.status(500).send(err);
        });
    }
   
    dadosForms.pathImagem = pathImagem;
   
    var connection = application.config.dbConnection();
    var empresaDao = new application.app.models.EmpresaDAO(connection);      
    
    empresaDao.salvar(dadosForms, function(error, result){
        
        console.log(error)
        if( error ) {
            
            empresaDao.listar(function(error, empresas){      
                connection.end();               
                res.render('empresa', { validacao : error, empresas : empresas, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/empresa');

    });
     
}