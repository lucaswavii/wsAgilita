module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var contratoDao = new application.app.models.ContratoDAO(connection);
    var pessoaDao = new application.app.models.PessoaDAO(connection);

    contratoDao.listar(function(error, contratos){

        pessoaDao.listar(function(error, pessoas){
 
            connection.end();
            if( error ) {
                res.render('contrato', { validacao : [ {'msg': error }], contratos : {}, pessoas:pessoas, sessao: req.session.usuario  });
                return;
            }
            res.render('contrato', { validacao : {}, contratos : contratos, pessoas:pessoas, sessao: req.session.usuario });
        });
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var contratoDao = new application.app.models.ContratoDAO(connection);
    var pessoaDao = new application.app.models.PessoaDAO(connection);

    var id = req.params._id;

    if( !id ) {
        contratoDao.listar(function(error, contratos){
            
            pessoaDao.listar(function(error, pessoas){
                connection.end();
                res.render('contrato', { validacao : [ {'msg': 'ID de edição não foi informado.' }], contratos : contratos, pessoas:pessoas, sessao: req.session.usuario  });
                return;
            });
        });
    }

    contratoDao.editar( id, function(error, result){

        pessoaDao.listar(function(error, pessoas){
        
            if( error ) {
                contratoDao.listar(function(error, contratos){
                    connection.end();
                    res.render('contrato', { validacao : [ {'msg': error }], contratos : contratos, pessoas:pessoas, sessao: req.session.usuario  });
                    return;
                });
            }
            connection.end();
            res.render('contrato', { validacao : {}, contratos : result, pessoas:pessoas, sessao: req.session.usuario });
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
    var contratoDao = new application.app.models.ContratoDAO(connection);
    var pessoaDao = new application.app.models.PessoaDAO(connection);

    var id = req.params._id;
    
    if( !id ) {
        res.render('contrato', { validacao : [ {'msg': 'ID de edição não foi informado.' }], contratos : {}, pessoas:{}, sessao: req.session.usuario  });
        return;
    }

    contratoDao.excluir( id, function(error, result){
        
        if( error ) {

            contratoDao.listar(function(error, contratos){ 

                pessoaDao.listar(function(error, pessoas){
                
                    if(error.errno != undefined && error.errno == 1451) { 
                        connection.end();
                        res.render('contrato', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], contratos : contratos, pessoas:pessoas, sessao: req.session.usuario  });
                    } else {                
                        res.render('contrato', { validacao : [ {'msg': error }], contratos : contratos, pessoas:pessoas, sessao: req.session.usuario   });
                        return;
                    }
                });
            });
        }
        connection.end();
        res.redirect("/contrato");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var dadosForms = req.body;
           
    var connection = application.config.dbConnection();
    var contratoDao = new application.app.models.ContratoDAO(connection);      
    var pessoaDao = new application.app.models.PessoaDAO(connection);

    contratoDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            contratoDao.listar(function(error, contratos){  
                
                pessoaDao.listar(function(error, pessoas){ 
                    connection.end();               
                    res.render('contrato', { validacao : error, contratos : {}, pessoas:pessoas, sessao: req.session.usuario });
                    return;
                })
            });
        }
        connection.end();  
        res.redirect('/contrato');

    });
     
}