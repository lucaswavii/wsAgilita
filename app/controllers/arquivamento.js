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
    var conciliacaoDao = new application.app.models.ConciliacaoDAO(connection);
    
    var pessoaDao = new application.app.models.PessoaDAO(connection);
    var administradoraDao = new application.app.models.AdministradoraDAO(connection);
    var tipocartaoDao = new application.app.models.TipoCartaoDAO(connection);
    var tipoparcelaDao = new application.app.models.TipoParcelaDAO(connection);
    var bandeiraDao = new application.app.models.BandeiraDAO(connection);
    

    var idConciliador = req.params._id;

    var objAdmin = new Object();
    var objCliente = new Object();

    var filter = require('filter-object');

    arquivamentoDao.editar( idConciliador, function(error, arquivamentos ){
       
        if( arquivamentos.length > 0 ) {

            arquivamentoDao.taxas( arquivamentos[0].id, function(error, taxas ){

                pessoaDao.listar(function(error, pessoas ){
                    
                    administradoraDao.listar(function(error, administradoras ){
                        
                        tipocartaoDao.listar(function(error, tipocartoes){
                            
                            tipoparcelaDao.listar(function(error, tipoparcelas){
                                
                                bandeiraDao.listar(function(error, bandeiras){

                                    fileClienteDao.abre( arquivamentos[0].id, function(error, fileCliente ){
                
                                        fileAdminDao.abre( arquivamentos[0].id, function(error, fileAdmin ){
                                            
                                            layoutCliente.listar( fileCliente[0].id , function(error, layoutClientes ){
                                               
                                                let index = 0
                                               
                                                while (index < layoutClientes.length) {
                                                    
                                                    const registroCliente = layoutClientes[index];
                                                    
                                                    if( !registroCliente.processado ) {
                                                         
                                                        layoutAdmin.buscar( fileAdmin[0], registroCliente , function(error, conciliacao ){
                                                            
                                                            if( conciliacao && conciliacao.length > 0 ) {
                                                                
                                                                for (let i = 0; i < conciliacao.length; i++) {
                                                                    
                                                                    const registroAdm = conciliacao[i];

                                                                    var valor1 = registroAdm.valor.toFixed(2).split('.'); // 19,98
                                                                    var valor2 = registroCliente.valor.toFixed(2).split('.');     // 19,99
                                                                    
                                                                    if( ( ( registroAdm.valor + registroCliente.valor )/100 ) == 0 || 
                                                                        parseInt(valor1[0]) == parseInt(valor2[0]) && 
                                                                        (  parseInt(valor1[1]) % parseInt(valor2[1]) <= 2 || parseInt(valor2[1]) % parseInt(valor1[1]) <= 2 ) && 
                                                                        !objAdmin[ registroAdm.id ] && !objCliente[ registroCliente.id ] ) {                                                                    
                                                                            
                                                                        var validacao = [];
                                                                        
                                                                        var pessoa   = pessoas.filter(function(value){ return value.cgccpf == registroCliente.cnpj;});                                                            
                                                                        var administradora = administradoras.filter(function(value){ return value.nome == registroCliente.administradora;});
                                                                        var tipocartao = tipocartoes.filter(function(value){ return value.nome == registroCliente.tipocartao;});
                                                                        var tipoparcela = tipoparcelas.filter(function(value){ return value.nome == registroCliente.parcelamento;});
                                                                        var bandeira = bandeiras.filter(function(value){ return value.nome == registroCliente.bandeira;});

                                                                        if( administradora.length == 0 ) {
                                                                            validacao.push("A administradora não cadastrada: " + registroCliente.administradora );
                                                                        }

                                                                        if( tipocartao.length == 0  ) {
                                                                            validacao.push("O tipo cartão não cadastrada: " + registroCliente.tipocartao );
                                                                        }

                                                                        if( tipoparcela.length == 0 ) {
                                                                            validacao.push("O tipo parcelamento não cadastrada: " + registroCliente.parcelamento );
                                                                        }

                                                                        if(bandeira.length == 0 ) {
                                                                            validacao.push("A bandeira não cadastrada: " + registroCliente.bandeira );
                                                                        }
                                                                        var taxa = [];
                                                                        if( validacao.length == 0 ) {
                                                                            taxa = taxas.filter(function(value){ 
                                                                                return value.administradora == administradora[0].id &&
                                                                                    value.tipocartao     == tipocartao[0].id &&
                                                                                    value.tipoparcela    == tipoparcela[0].id &&
                                                                                    value.bandeira       == bandeira[0].id &&
                                                                                    value.inicio         >= registroCliente.datavenda &&
                                                                                    value.fim            <= registroCliente.datavenda;
                                                                            });
                                                                        }

                                                                        if( taxa.length == 0 ) {
                                                                            validacao.push("A taxa não encontrada.")
                                                                        }

                                                                        if( pessoa.length == 0 ) {
                                                                            validacao.push("A pessoa " + registroCliente.cnpj + " não encontrada.")
                                                                        }
                                                    
                                                                        var registro = 
                                                                            { 
                                                                                status: 1, 
                                                                                cnpj:registroCliente.cnpj,
                                                                                pessoa: pessoa && pessoa.length > 0 ? pessoa[0].id : null,
                                                                                administradora_nome: registroCliente.administradora,
                                                                                administradora: administradora && administradora.length > 0 ? administradora[0].id : null,
                                                                                tipocartao_nome: registroCliente.tipocartao,
                                                                                tipocartao:  tipocartao && tipocartao.length > 0 ? tipocartao[0].id : null,
                                                                                parcelamento: registroCliente.parcelamento,
                                                                                tipoparcela:tipoparcela.length > 0 ? tipoparcela[0].id : null,
                                                                                datavenda: registroCliente.datavenda,
                                                                                datarecebimento:registroCliente.datarecebimento,
                                                                                valor: registroCliente.valor,
                                                                                desconto: registroAdm.desconto,
                                                                                valorbruto:registroAdm.valorbruto,
                                                                                valorliquido: registroAdm.valorliquido,
                                                                                bandeira_nome: registroCliente.bandeira,
                                                                                bandeira: bandeira && bandeira.length > 0 ? bandeira[0].id : null,
                                                                                parcelas:registroCliente.parcelas,
                                                                                resumo:registroAdm.resumo,
                                                                                lancamento: registroCliente.lancamento,
                                                                                taxa: taxa.length > 0 ? taxa[0].id : null,
                                                                                observacao: validacao.length > 0 ? validacao.join(" - ") : null,
                                                                                cliente: registroCliente.id,
                                                                                admin: registroAdm.id
                                                                            }
                                                                        console.log(registro)
                                                                        objAdmin[ registroAdm.id ] = true;
                                                                        objCliente[ registroCliente.id   ] = true; 
                                                                        
                                                                        console.log(registroCliente.id + " - " + i)
                                                                        
                                                                        registroAdm.processado = 'S';
                                                                        registroCliente.processado = 'S';

                                                                        layoutCliente.salvar( registroCliente, function(eror, result){});
                                                                        layoutAdmin.salvar(registroAdm, function(eror, result){});
                                                                        
                                                                        conciliacaoDao.salvar(registro,function(error, result ){
                                                                            console.log(error)
                                                                            arquivamentos[0].status = 4;
                                                                            arquivamentoDao.salvar( arquivamentos[0], function(error, resultadp ){});
                                                                        });
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        conciliacaoDao.listar( layoutCliente.id, function(error, conciliado ){
                                                            console.log(conciliado)
                                                        })                                  
                                                    }
                                                    index++
                                                } 
                                                if( index >= layoutClientes.length ) {
                                                    res.redirect('/arquivamento/' + idConciliador );
                                                }                        
                                            }); 
                                        });
                                    });
                                });
                            });
                        });
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