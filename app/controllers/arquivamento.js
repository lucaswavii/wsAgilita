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
    var fileClienteDao = new application.app.models.FileClienteDAO(connection);      
    var fileAdminDao = new application.app.models.FileAdministradoraDAO(connection);
    
    var idConciliador = req.params._id;
    
    if( !idConciliador ) {
        res.render('arquivamento', { validacao : [ {'msg': 'ID de edição não foi informado.' }], arquivamentos : {}, sessao: req.session.usuario  });
        return;
    }
    arquivamentoDao.editar( idConciliador, function(error, arquivamentos ){
        var idContrato = arquivamentos[0].conciliador
        arquivamentoDao.excluir( idConciliador, function(error, result){
            console.log(error)
            connection.end();
            res.redirect('/arquivamento/' + idContrato );
        });    
    });
}

module.exports.conciliar = function( application, req, res ){

    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    var connection = application.config.dbConnection();
    var arquivamentoDao = new application.app.models.ArquivamentoDAO(connection);
    var fileClienteDao = new application.app.models.FileClienteDAO(connection);      
    var fileAdminDao = new application.app.models.FileAdministradoraDAO(connection);
    var layoutCliente = new application.app.models.LayoutClienteDAO(connection);
    var layoutAdmin = new application.app.models.LayoutAdministradoraDAO(connection);
    var conciliacaoDao = new application.app.models.ConciliacaoDAO(connection)
    
    var idConciliador = req.params._id;

    var filter = require('filter-object');

   

    arquivamentoDao.editar( idConciliador, function(error, arquivamentos ){
       
        if( arquivamentos.length > 0 ) {
            
            fileClienteDao.abre( arquivamentos[0].id, function(error, fileCliente ){
               
                fileAdminDao.abre( arquivamentos[0].id, function(error, fileAdmin ){
                    
                    layoutCliente.listar( fileCliente[0].id , function(error, layoutClientes ){
                       
                        for (let index = 0; index < layoutClientes.length; index++) {
                            const element = layoutClientes[index];
                            
                            layoutAdmin.buscar( fileAdmin[0], element , function(error, conciliacao ){
                                for (let i = 0; i < conciliacao.length; i++) {
                                    const registroAdm = conciliacao[i];
                                    var registro = { 
                                                        status: 1, 
                                                        cnpj:element.cnpj,
                                                        administradora_nome: element.administradora,
                                                        tipocartao_nome: element.tipocartao,
                                                        tipoparcela_nome: element.tipoparcela,
                                                        datavenda: element.datavenda,
                                                        datarecebimento:element.datarecebimento,
                                                        valor: element.valor,
                                                        desconto: registroAdm.desconto,
                                                        valorbruto:registroAdm.valorbruto,
                                                        valorliquido: registroAdm.valorliquido,
                                                        bandeira_nome: element.bandeira,
                                                        parcelas:element.parcelas,
                                                        cliente: element.id,
                                                        admin: registroAdm.id
                                                    }
                                    console.log(registro)
                                }
                            });
                        } 
                        
                        //connection.end();
                        //res.redirect('/arquivamento/' + idConciliador );

                        
                    }); 
                });
            });
        }    

    });

}

module.exports.salvar = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
        res.redirect("/login");
        return;			
    }
    
    const moment = require('moment') 

    var dadosForms = req.body;

    var idConciliador = req.params._id;
    
    var connection = application.config.dbConnection();
    var arquivamentoDao = new application.app.models.ArquivamentoDAO(connection);      
    var fileClienteDao = new application.app.models.FileClienteDAO(connection);      
    var fileAdminDao = new application.app.models.FileAdministradoraDAO(connection);
    var schedulerDao = new application.app.models.SchedulerDAO(connection);


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
        
        if( result && result.insertId ) {

            arqCliente.arquivamento = result.insertId
            arqAdmin.arquivamento   = result.insertId
            var hoje = new Date();
            var agenda = { 
                            data: hoje, 
                            hora: moment(hoje).utc().format("hh:mm"), 
                            titulo:'Tarefa Importação de Arquivo', 
                            tipo: 6, 
                            agenda: hoje, 
                            agendah: moment(hoje).utc().format("hh:mm"), 
                            parametros: null, 
                            habilitado:'S'
                        }
                        
            fileClienteDao.salvar(arqCliente, function(error, arquivoCliente){
                
              
                fileAdminDao.salvar(arqAdmin, function(error, arquivoAdmin){

                    agenda.parametros = '{ "idArquivamento":'+ arqCliente.arquivamento + ', "idCliente":' + arquivoCliente.insertId + ' ,"idAdmin":' + arquivoAdmin.insertId +'}'                    
                    
                    schedulerDao.salvar(agenda, function(error, agendas){                       
                        connection.end();
                        res.redirect('/arquivamento/' + idConciliador );
                    })

                    
                });
            });
        } else {
            connection.end();
            res.redirect('/arquivamento/' + idConciliador );
    
        }

    });
     
}