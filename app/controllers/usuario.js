module.exports.index = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var usuarioDao = new application.app.models.UsuarioDAO(connection);
    var grupoDao = new application.app.models.GrupoDAO(connection);
    var empresaDao = new application.app.models.EmpresaDAO(connection);
    var pessoaDao = new application.app.models.PessoaDAO(connection);
    
    
    empresaDao.listar(function(error, empresas){        
    
        grupoDao.listar(function(error, grupos){

            pessoaDao.listar(function(error, pessoas){
        
                usuarioDao.listar(function(error, usuarios){

                    connection.end();
                    if( error ) {
                        res.render('usuario', { validacao : [ {'msg': error }], usuarios : {}, empresas:empresas, grupos:grupos, pessoas:pessoas, sessao: req.session.usuario  });
                        return;
                    }
                    res.render('usuario', { validacao : {}, usuarios : usuarios, empresas:empresas, grupos:grupos, pessoas:pessoas, sessao: req.session.usuario });            
                });
            })
        });
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var usuarioDao = new application.app.models.UsuarioDAO(connection);
    var grupoDao = new application.app.models.GrupoDAO(connection);
    var empresaDao = new application.app.models.EmpresaDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        empresaDao.listar(function(error, empresas){        
    
            grupoDao.listar(function(error, grupos){

                usuarioDao.listar(function(error, usuarios){

                    connection.end();
                    res.render('usuario', { validacao : [ {'msg': 'ID de edição não foi informado.' }], usuarios : usuarios, empresas:empresas, grupos:grupos, sessao: req.session.usuario  });
                    return;
                });
            });
        });
    }

    usuarioDao.editar( id, function(error, result){
       
        if( error ) {
            empresaDao.listar(function(error, empresas){        
    
                grupoDao.listar(function(error, grupos){
    
                    usuarioDao.listar(function(error, usuarios){
    
          
                        connection.end();
                        res.render('usuario', { validacao : [ {'msg': error }], usuarios : usuarios, empresas:empresas, grupos:grupos, sessao: req.session.usuario  });
                        return;
                    });
                });
            });
        }
        connection.end();
        res.redirect('/usuario');
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var usuarioDao = new application.app.models.UsuarioDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('usuario', { validacao : [ {'msg': 'ID de edição não foi informado.' }], usuarios : {}, sessao: req.session.usuario  });
        return;
    }

    usuarioDao.excluir( id, function(error, result){
        
        if( error ) {

            usuarioDao.listar(function(error, usuarios){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('usuario', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], usuarios : usuarios, sessao: req.session.usuario  });
                } else {                
                    res.render('usuario', { validacao : [ {'msg': error }], usuarios : usuarios, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/usuario");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var crypto = require('crypto');

    var dadosForms = req.body;

    console.log(dadosForms)
    
    if( dadosForms.senha ) {
        var senha_criptografada = crypto.createHash("md5").update(dadosForms.senha).digest("hex");
        dadosForms.senha = senha_criptografada;
    }
    
    var connection = application.config.dbConnection();
    var usuarioDao = new application.app.models.UsuarioDAO(connection);       
    
    usuarioDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            
            usuarioDao.listar(function(error, usuarios){      
                connection.end();               
                res.render('usuario', { validacao : error, usuarios : usuarios, empresas: {}, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/usuario');
    });
     
}

module.exports.login = function( application, req, res ){

    
    var crypto = require('crypto');

    var dadosForms = req.body;

    if( dadosForms.senha ) {
        var senha_criptografada = crypto.createHash("md5").update(dadosForms.senha).digest("hex");
        dadosForms.senha = senha_criptografada;
    }

    var connection = application.config.dbConnection();
    var usuarioDao = new application.app.models.UsuarioDAO(connection);       
    var configuracaoDao = new application.app.models.ConfiguracaoDAO(connection);

    usuarioDao.login(dadosForms, function(error, result){
      
        if(result && result.length > 0 ) {
            configuracaoDao.configuracao( result[0].empresaid, function(error, configuracao){
                req.session.usuario = { usuario:result[0],permissao:{}, configuracao: configuracao[0] }                
                connection.end();					
                res.redirect("/index")
                return;
            });
        } else {
            connection.end();	
            req.flash('errorMessage', 'Usuário ou Senha inválido!')				
            res.redirect("/login")
            return;
        }			
    });
    
};