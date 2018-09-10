module.exports.index = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var idConciliador = req.params._id;
    
    var connection = application.config.dbConnection();
    var arquivamentoDao = new application.app.models.ArquivamentoDAO(connection);
    var tipoDao = new application.app.models.TipoDAO(connection);
    var administradoraDao = new application.app.models.AdministradoraDAO(connection);

    arquivamentoDao.listar(function(error, arquivamentos){
        
        tipoDao.listar(function(error, tipos){
            
            administradoraDao.listar(function(error, administradoras){
            
                connection.end();
                if( error ) {
                    res.render('arquivamento', { validacao : [ {'msg': error }], idConciliador:idConciliador,  arquivamentos : {}, tipos:tipos, administradoras:administradoras, sessao: req.session.usuario  });
                    return;
                }
                res.render('arquivamento', { validacao : {}, idConciliador:idConciliador, arquivamentos:arquivamentos, tipos:tipos, administradoras:administradoras, sessao: req.session.usuario });
            });
        });
    });
}

module.exports.editar = function( application, req, res ){
    
    var connection = application.config.dbConnection();
    var arquivamentoDao = new application.app.models.ArquivamentoDAO(connection);
    
    var id = req.params._id;

    if( !id ) {
        arquivamentoDao.listar(function(error, arquivamentos){
            connection.end();
            res.render('arquivamento', { validacao : [ {'msg': 'ID de edição não foi informado.' }], arquivamentos : arquivamentos, sessao: req.session.usuario  });
            return;
        });
    }

    arquivamentoDao.editar( id, function(error, result){
       
        if( error ) {
            arquivamentoDao.listar(function(error, arquivamentos){
                connection.end();
                res.render('arquivamento', { validacao : [ {'msg': error }], arquivamentos : arquivamentos, sessao: req.session.usuario  });
                return;
            });
        }
        connection.end();
        res.render('arquivamento', { validacao : {}, arquivamentos : result, sessao: req.session.usuario });
        return;
    });
}

module.exports.excluir = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }

    var connection = application.config.dbConnection();
    var arquivamentoDao = new application.app.models.ArquivamentoDAO(connection);
    
    var id = req.params._id;
    
    if( !id ) {
        res.render('arquivamento', { validacao : [ {'msg': 'ID de edição não foi informado.' }], arquivamentos : {}, sessao: req.session.usuario  });
        return;
    }

    arquivamentoDao.excluir( id, function(error, result){
        
        if( error ) {

            arquivamentoDao.listar(function(error, arquivamentos){ 

                if(error.errno != undefined && error.errno == 1451) { 
                    connection.end();
                    res.render('arquivamento', { validacao : [ {'msg': "Não se pode excluir dados com vínculos em outras tabelas." }], arquivamentos : arquivamentos, sessao: req.session.usuario  });
                } else {                
                    res.render('arquivamento', { validacao : [ {'msg': error }], arquivamentos : arquivamentos, sessao: req.session.usuario   });
                    return;
                }
            });
        }
        connection.end();
        res.redirect("/arquivamento");
    });
}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    var dadosForms = req.body;

    var idConciliador = req.params._id;
    
    var connection = application.config.dbConnection();
    var arquivamentoDao = new application.app.models.ArquivamentoDAO(connection);      
    var fileClienteDao = new application.app.models.FileClienteDAO(connection);      
    var fileAdminDao = new application.app.models.FileAdministradoraDAO(connection);


    var dadosArquivamento = { 
                                data: dadosForms.data, 
                                hora: dadosForms.hora, 
                                status: dadosForms.status, 
                                conciliador: idConciliador, 
                                tipo:dadosForms.tipo, 
                                administradora: dadosForms.administradora, 
                                inicio: dadosForms.inicio, 
                                fim: dadosForms.fim 
                            };
    var arqCliente        = { path: null, processado: 'N', arquivamento: null };
    var arqAdmin          = { path: null, processado: 'N', arquivamento: null };
    
    var pathCliente = !dadosForms.pathCliente ? '' : dadosForms.pathCliente;
    if ( req.files.fileCliente ) {
        let sampleFileCliente = req.files.fileCliente;
        pathCliente = '/files/' + sampleFileCliente.name;
        sampleFileCliente.mv('app/public/files/' + sampleFileCliente.name , function(err) {
            //    if (err)
          //      console.log(err)
                
        //        return res.status(500).send(err);
        });
    }
   
    
    var pathAdmin = !dadosForms.pathAdmin ? '' : dadosForms.pathAdmin;

    if ( req.files.fileAdmin ) {
        let sampleFileAdmin = req.files.fileAdmin;
        pathAdmin = '/files/' + sampleFileAdmin.name;
        
        sampleFileAdmin.mv('app/public/files/' + sampleFileAdmin.name , function(err) {
            //if (err)
            //    return res.status(500).send(err);
        });
    }
   
    arqCliente.path = pathCliente;
    arqAdmin.path = pathAdmin;
   
    
    arquivamentoDao.salvar(dadosArquivamento, function(error, result){
        arqCliente.arquivamento = result.insertId
        arqAdmin.arquivamento   = result.insertId
        
        fileClienteDao.salvar(arqCliente, function(error, arquivoCliente){
            
            fileAdminDao.salvar(arqAdmin, function(error, arquivoAdmin){

                var schedule = require('node-schedule');
 
                var j = schedule.scheduleJob('0 1 * * *', function(){
                    console.log('The answer to life, the universe, and everything!');
                });
                
                connection.end();
                res.redirect('/arquivamento/' + idConciliador );
            });
        });
    });
     
}