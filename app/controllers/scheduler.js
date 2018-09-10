module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    var connection = application.config.dbConnection();
    var schedulerDao = new application.app.models.SchedulerDAO(connection);
    
    schedulerDao.listar(function(error, schedulers){
        connection.end();
        if( error ) {
            res.render('scheduler', { validacao : [ {'msg': error }], schedulers : {}, sessao: req.session.usuario  });
            return;
        }
        res.render('scheduler', { validacao : {}, schedulers : schedulers, sessao: req.session.usuario });
    
    });
}

module.exports.editar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var schedulerDao = new application.app.models.SchedulerDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        schedulerDao.listar(function(error, schedulers){
            connection.end();
            res.render('scheduler', { validacao : [ {'msg': 'ID de edição não foi informado.' }], schedulers : schedulers, sessao: req.session.usuario  });
            return;
        });
    }

    schedulerDao.editar( id, function(error, result){
       
        if( error ) {
            schedulerDao.listar(function(error, schedulers){
                connection.end();
                res.render('scheduler', { validacao : [ {'msg': error }], schedulers : schedulers, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('scheduler', { validacao : {}, schedulers : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var schedulerDao = new application.app.models.SchedulerDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('scheduler', { validacao : [ {'msg': 'ID de edição não foi informado.' }], schedulers : {}, sessao: req.session.usuario  });
        return;
    }

    schedulerDao.excluir( id, function(error, result){
        
        if( error ) {

            schedulerDao.listar(function(error, schedulers){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('scheduler', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], schedulers : schedulers, sessao: req.session.usuario  });
                } else {                
                    res.render('scheduler', { validacao : [ {'msg': error }], schedulers : schedulers, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/scheduler");
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
        res.render('scheduler', {validacao: erros,  schedulers: [dadosForms], sessao: req.session.usuario});
        return;
    }
    
    var connection = application.config.dbConnection();
    var schedulerDao = new application.app.models.SchedulerDAO(connection);      
    
    schedulerDao.salvar(dadosForms, function(error, result){
        
        
        if( error ) {
            console.log(error)
            schedulerDao.listar(function(error, schedulers){      
                connection.end();               
                res.render('scheduler', { validacao : error, schedulers : schedulers, sessao: req.session.usuario });
                return;
            });
        }
        connection.end();  
        res.redirect('/scheduler');

    });
     
}