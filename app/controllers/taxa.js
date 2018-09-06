module.exports.index = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var id = req.params._id;
    
    
    var connection = application.config.dbConnection();
    var taxaDao = new application.app.models.TaxaDAO(connection);
    var contratoDao = new application.app.models.ContratoDAO(connection);
    var pessoaDao = new application.app.models.PessoaDAO(connection);
    var tipoparcelaDao = new application.app.models.TipoParcelaDAO(connection);
    var tipocartaoDao = new application.app.models.TipoCartaoDAO(connection);
    var bandeiraDao = new application.app.models.BandeiraDAO(connection);
    var administradoraDao = new application.app.models.AdministradoraDAO(connection);

    contratoDao.editar(id,function(error, contratos){

        pessoaDao.editar(contratos[0].pessoa,function(error, pessoas){
        
            tipoparcelaDao.listar(function(error, tipoparcelas){
                
                tipocartaoDao.listar(function(error, tipocartoes){
                    
                    bandeiraDao.listar(function(error, bandeiras){
                        
                        administradoraDao.listar(function(error, administradoras){
            
                            taxaDao.listar(function(error, taxas){
        
                                connection.end();
                                if( error ) {
                                    res.render('taxa', { validacao : [ {'msg': error }], idContrato:id, contratos:{}, taxas : {}, pessoas:pessoas, tipoparcelas:tipoparcelas, tipocartoes:tipocartoes, bandeiras:bandeiras, administradoras:administradoras, sessao: req.session.usuario  });
                                    return;
                                }
                                res.render('taxa', { validacao : {}, idContrato:id, contratos:contratos, taxas:taxas,pessoas:pessoas, tipoparcelas:tipoparcelas, tipocartoes:tipocartoes, bandeiras:bandeiras, administradoras:administradoras, sessao: req.session.usuario });

                            });
                        });
                    });
                });
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
    var taxaDao = new application.app.models.TaxaDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        taxaDao.listar(function(error, taxas){
            connection.end();
            res.render('taxa', { validacao : [ {'msg': 'ID de edição não foi informado.' }], taxas : taxas, sessao: req.session.usuario  });
            return;
        });
    }

    taxaDao.editar( id, function(error, result){
       
        if( error ) {
            taxaDao.listar(function(error, taxas){
                connection.end();
                res.render('taxa', { validacao : [ {'msg': error }], taxas : taxas, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('taxa', { validacao : {}, taxas : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var taxaDao = new application.app.models.TaxaDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('taxa', { validacao : [ {'msg': 'ID de edição não foi informado.' }], taxas : {}, sessao: req.session.usuario  });
        return;
    }

    taxaDao.excluir( id, function(error, result){
        
        if( error ) {

            taxaDao.listar(function(error, taxas){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('taxa', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], taxas : taxas, sessao: req.session.usuario  });
                } else {                
                    res.render('taxa', { validacao : [ {'msg': error }], taxas : taxas, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/taxa");
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
        res.render('taxa', {validacao: erros,  taxas: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var taxaDao = new application.app.models.TaxaDAO(connection);      
    
    taxaDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            taxaDao.listar(function(error, taxas){      
                connection.end();               
                res.render('taxa', { validacao : error, taxas : taxas, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/taxa');

    });
     
}