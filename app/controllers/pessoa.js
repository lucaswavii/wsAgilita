module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var pessoaDao = new application.app.models.PessoaDAO(connection);
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);

    pessoaDao.listar(function(error, pessoas){

        classificacaoDao.listar(function(error, classificacoes){

            connection.end();
            if( error ) {
                res.render('pessoa', { validacao : [ {'msg': error }], pessoas : {}, classificacoes:{}, sessao: req.session.usuario  });
                return;
            }
            res.render('pessoa', { validacao : {}, pessoas : pessoas, classificacoes:classificacoes, sessao: req.session.usuario });
        });
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var pessoaDao = new application.app.models.PessoaDAO(connection);
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);

    var id = req.params._id;

    if( !id ) {
        
        pessoaDao.listar(function(error, pessoas){

            classificacaoDao.listar(function(error, classificacoes){
            
                connection.end();
                res.render('pessoa', { validacao : [ {'msg': 'ID de edição não foi informado.' }], pessoas : pessoas, classificacoes:classificacoes, sessao: req.session.usuario  });
                return;
            });
        });
    }

    pessoaDao.editar( id, function(error, result){
       
        if( error ) {
            pessoaDao.listar(function(error, pessoas){
                classificacaoDao.listar(function(error, classificacoes){
                    connection.end();
                    res.render('pessoa', { validacao : [ {'msg': error }], pessoas : pessoas, classificacoes:classificacoes, sessao: req.session.usuario  });
                    return;
                });
            });
        }
        
        classificacaoDao.listar(function(error, classificacoes){
            connection.end();
            res.render('pessoa', { validacao : {}, pessoas : result, classificacoes:classificacoes, sessao: req.session.usuario });
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
    var pessoaDao = new application.app.models.PessoaDAO(connection);
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);

    var id = req.params._id;
    
    if( !id ) {
        classificacaoDao.listar(function(error, classificacoes){
            res.render('pessoa', { validacao : [ {'msg': 'ID de edição não foi informado.' }], pessoas : {}, classificacoes:classificacoes, sessao: req.session.usuario  });
            return;
        });
    }

    pessoaDao.excluir( id, function(error, result){
        
        if( error ) {

            pessoaDao.listar(function(error, pessoas){ 
                classificacaoDao.listar(function(error, classificacoes){
                    if(error.errno != undefined && error.errno == 1451) { 
                        connection.end();
                        res.render('pessoa', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], pessoas : pessoas, classificacoes:classificacoes, sessao: req.session.usuario  });
                    } else {                
                        res.render('pessoa', { validacao : [ {'msg': error }], pessoas : pessoas, classificacoes:classificacoes, sessao: req.session.usuario   });
                        return;
                    }
                });
            });
        }
        connection.end();
        res.redirect("/pessoa");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var pessoaDao = new application.app.models.PessoaDAO(connection);      
    var classificacaoDao = new application.app.models.ClassificacaoDAO(connection);
        
    var dadosForms = req.body;

    req.assert('nome', 'Nome é obrigatório!').notEmpty();       

    var erros = req.validationErrors();

    if(erros){
        classificacaoDao.listar(function(error, classificacoes){
            res.render('pessoa', {validacao: erros,  pessoas: [dadosForms], classificacoes:classificacoes, sessao: req.session.usuario});
            return;
        });
    }
    
    
    pessoaDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            pessoaDao.listar(function(error, pessoas){      
                classificacaoDao.listar(function(error, classificacoes){
                    connection.end();               
                    res.render('pessoa', { validacao : error, pessoas : pessoas, classificacoes:classificacoes, sessao: req.session.usuario });
                    return;
                });
            });
        }
        connection.end();  
        res.redirect('/pessoa');

    });
     
}