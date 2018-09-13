module.exports = function Schedulers( application, connection, req, res ) {
    
    var Request = require("request");
    var con = connection;
    var schedulerDao = new application.app.models.SchedulerDAO(con);

    this.importacao = function( tarefa ) {
    
        var params = JSON.parse(tarefa.parametros); 

        if( params.idCliente && params.idAdmin && params.idArquivamento ) {

            var fileClienteDao = new application.app.models.FileClienteDAO(con);      
            var fileAdminDao = new application.app.models.FileAdministradoraDAO(con);
            
            try {
                tarefa.fechamento = new Date();

                schedulerDao.salvar(tarefa, function(error, resultado){

                    fileClienteDao.editar(params.idCliente, function(error, fileClient){
                
                        if( fileClient.length > 0 && fileClient[0].processado == 'N') {
        
                            var tabela = "CLIENTE_TEMP_" + tarefa.id
                    
                            var creat_table  = " CREATE TEMPORARY TABLE " + tabela + " ( "
                            creat_table     += "`administradora` varchar(160) DEFAULT NULL,"
                            creat_table     += "`tipocartao` varchar(160) DEFAULT NULL,"
                            creat_table     += "`parcelamento` varchar(160) DEFAULT NULL,"
                            creat_table     += "`datavenda` varchar(10) DEFAULT NULL,"
                            creat_table     += "`datarecebimento` varchar(10) DEFAULT NULL,"
                            creat_table     += "`valor` decimal(10,2) DEFAULT NULL,"
                            creat_table     += "`bandeira` varchar(160) DEFAULT NULL,"
                            creat_table     += "`parcelas` varchar(30) DEFAULT NULL,"
                            creat_table     += "`lancamento` varchar(60) DEFAULT NULL,"
                            creat_table     += "`cnpj` varchar(60) DEFAULT NULL) "
                            creat_table     += " ENGINE=InnoDB AUTO_INCREMENT=3103 DEFAULT CHARSET=utf8";
                            
                            con.query(creat_table, callback);
        
                            var filePath = `${__dirname}`+  fileClient[0].path;
                            filePath = filePath.replace('api','public');
                            
                            var load_data_sql = 'load data local infile \'' + filePath + '\' ignore into table '+ tabela +' fields terminated by \';\' ignore 1 rows '
                            con.query(load_data_sql, callback);
        
                        }
                    });
        
                    fileAdminDao.editar(params.idAdmin, function(error, fileAdmin){
        
                        if( fileAdmin.length > 0 && fileAdmin[0].processado == 'N') {
                            
                            var filePath = `${__dirname}`+  fileAdmin[0].path;
                            filePath = filePath.replace('api','public');
        
                            var tabela = "ADMIN_TEMP_" + tarefa.id
                    
                            var creat_table  = " CREATE TEMPORARY TABLE " + tabela + " ( "
                            creat_table     += "`administradora` varchar(160) DEFAULT NULL,"
                            creat_table     += "`tipocartao` varchar(160) DEFAULT NULL,"
                            creat_table     += "`parcelamento` varchar(160) DEFAULT NULL,"
                            creat_table     += "`datavenda` varchar(10) DEFAULT NULL,"
                            creat_table     += "`datarecebimento` varchar(10) DEFAULT NULL,"
                            creat_table     += "`valor` decimal(10,2) DEFAULT NULL,"
                            creat_table     += "`bandeira` varchar(160) DEFAULT NULL,"
                            creat_table     += "`parcelas` varchar(30) DEFAULT NULL,"
                            creat_table     += "`lancamento` varchar(60) DEFAULT NULL,"
                            creat_table     += "`cnpj` varchar(60) DEFAULT NULL) "
                            creat_table     += " ENGINE=InnoDB AUTO_INCREMENT=3103 DEFAULT CHARSET=utf8";
                            
                            con.query(creat_table, callback);
        
                            var filePath = `${__dirname}`+  fileAdmin[0].path;
                            filePath = filePath.replace('api','public');
                            
                            var load_data_sql = 'load data local infile \'' + filePath + '\' ignore into table '+ tabela +' fields terminated by \';\' ignore 1 rows '
                            con.query(load_data_sql, callback);                        
                        }        
                    });
                })
            } catch (error) {
                
            }
            
        }
    
    }

    this.importacaoXls = function( tarefa, agenda ) {
        console.log('Processando...');
        var arquivamentoDao = new application.app.models.ArquivamentoDAO(con);      
        var fileClienteDao = new application.app.models.FileClienteDAO(con);      
        var fileAdminDao = new application.app.models.FileAdministradoraDAO(con);
        var layoutClienteDao = new application.app.models.LayoutClienteDAO(con);
        var layoutAdminDao = new application.app.models.LayoutAdministradoraDAO(con);
            
        const { getJsDateFromExcel } = require('excel-date-to-js') 
        const moment = require('moment') 
        
        function excelDateToJSDate(date) {
            let data = getJsDateFromExcel(date)
            return moment(data).utc().format("YYYY/MM/DD")
        }
        var CNPJ = require("cpf_cnpj").CNPJ;

        const fs = require('fs') 
        const xlsx = require('node-xlsx');
       
        var params = JSON.parse(tarefa.parametros); 

        if( params.idCliente && params.idAdmin && params.idArquivamento ) {
            
            fileClienteDao.editar(params.idCliente, function(error, fileClient){
            
                if( fileClient.length > 0 && fileClient[0].processado == 'N') {
                    
                    var filePath = `${__dirname}`+  fileClient[0].path;
                    filePath = filePath.replace('api','public');
                    
                    const plan = xlsx.parse(filePath);
            
                    for (let linha = 0; linha < plan[0].data.length; linha++) {
                        const colunas = plan[0].data[linha];
                        if( linha > 0 && colunas.length > 0) {
                            
                            const colunas = plan[0].data[linha];

                            var dadosFileCliente = {
                                                        administradora: colunas[0],
                                                        tipocartao: colunas[1],
                                                        parcelamento: colunas[2],
                                                        datavenda: excelDateToJSDate(colunas[3]),
                                                        datarecebimento: excelDateToJSDate(colunas[4]),
                                                        valor: colunas[5],
                                                        bandeira:colunas[6],
                                                        parcelas: colunas[7],
                                                        lancamento: colunas[8],
                                                        cnpj:CNPJ.format(colunas[9]),
                                                        observacao: colunas.join(','),
                                                        arquivocliente: fileClient[0].id
                                                    }
                            layoutClienteDao.salvar(dadosFileCliente,function(error, layout){});                                        
                        }
                    }
                    fileClient[0].processado = 'S';
                    fileClienteDao.salvar(fileClient[0], function(error, fileClientResult){
                        if( !error ) {
                            arquivamentoDao.editar(params.idArquivamento, function(error, arquivamentos){
                                arquivamentos[0].status = 2;
                                arquivamentoDao.salvar(arquivamentos[0], function(error, resultado){
                                    schedulerDao.salvar(agenda, function(error, final){});
                                });
                            });
                        }
                    });
                
                }
            });

            fileAdminDao.editar(params.idAdmin, function(error, fileAdmin){
                        
                

                if( fileAdmin.length > 0 && fileAdmin[0].processado == 'N') {
                    
                    var filePath = `${__dirname}`+  fileAdmin[0].path;
                    filePath = filePath.replace('api','public');
                    
                    const plan = xlsx.parse(filePath);
                    for (let linha = 0; linha < plan[0].data.length; linha++) {
                        const colunas = plan[0].data[linha];
                        if( linha > 0 && colunas.length > 0) {
                            
                            const colunas = plan[0].data[linha];

                            var dadosFileAdmin = {
                                                        administradora: colunas[0],
                                                        datavenda:excelDateToJSDate(colunas[1]),
                                                        datarecebimento:excelDateToJSDate(colunas[2]),
                                                        bandeira:colunas[3],
                                                        tipocartao: colunas[4],
                                                        valorbruto:colunas[5],
                                                        valor:colunas[6],
                                                        parcelas: colunas[7],
                                                        desconto: colunas[8],
                                                        valorliquido: colunas[9],
                                                        resumo: colunas[10],
                                                        parcelamento: colunas[11],
                                                        cnpj:CNPJ.format(colunas[12].replace('000','')),
                                                        observacao: colunas.join(','),
                                                        arquivamentoadministradora: fileAdmin[0].id
                                                    }
                            layoutAdminDao.salvar(dadosFileAdmin,function(error, layout){});
                                                        
                        }

                    }

                    fileAdmin[0].processado = 'S';
                    fileAdminDao.salvar(fileAdmin[0], function(error, fileClientResult){
                        if( !error ) {
                            arquivamentoDao.editar(params.idArquivamento, function(error, arquivamentos){
                                arquivamentos[0].status = 3;
                                arquivamentoDao.salvar(arquivamentos[0], function(error, resultado){
                                    schedulerDao.salvar(agenda, function(error, final){});
                                });
                            });
                        }
                    });                           
                }
            });
        }

    }  
    
    this.conciliacaoCartao = function( tarefa, agenda ){
        console.log('Processando...');
        var params = JSON.parse(tarefa.parametros); 

        if( params.idConciliador ) {
            var idConciliador = params.idConciliador
            var arquivamentoDao = new application.app.models.ArquivamentoDAO(con);
            var fileClienteDao = new application.app.models.FileClienteDAO(con);      
            var fileAdminDao = new application.app.models.FileAdministradoraDAO(con);
            var layoutCliente = new application.app.models.LayoutClienteDAO(con);
            var layoutAdmin = new application.app.models.LayoutAdministradoraDAO(con);
            var conciliacaoDao = new application.app.models.ConciliacaoDAO(con);
            
            var pessoaDao = new application.app.models.PessoaDAO(con);
            var administradoraDao = new application.app.models.AdministradoraDAO(con);
            var tipocartaoDao = new application.app.models.TipoCartaoDAO(con);
            var tipoparcelaDao = new application.app.models.TipoParcelaDAO(con);
            var bandeiraDao = new application.app.models.BandeiraDAO(con);
            

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
                                                                                    arquivamentoDao.salvar( arquivamentos[0], function(error, resultadp ){
                                                                                        schedulerDao.salvar(agenda, function(error, final){});
                                                                                    });
                                                                                });
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            } else {

                                                            
                                                                conciliacaoDao.listarCliente( registroCliente.id, function(error, conciliado ){
                                                                    console.log(conciliado) 
                                                                    if( conciliado.length > 0 && ( !conciliado[0].pessoa || !conciliado[0].administradora || !conciliado[0].tipocartao || !conciliado[0].tipoparcela || !conciliado[0].bandeira || !conciliado[0].taxa  )) {
                                                                        var validacao = [];
                                                                                    
                                                                        var pessoa   = pessoas.filter(function(value){ return value.cgccpf == conciliado.cnpj;});                                                            
                                                                        var administradora = administradoras.filter(function(value){ return value.nome == conciliado.administradora_nome;});
                                                                        var tipocartao = tipocartoes.filter(function(value){ return value.nome == registroCliente.tipocartao_nome;});
                                                                        var tipoparcela = tipoparcelas.filter(function(value){ return value.nome == registroCliente.parcelamento;});
                                                                        var bandeira = bandeiras.filter(function(value){ return value.nome == registroCliente.bandeira_nome;});

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

                                                                        conciliacaoDao.salvar(registroCliente,function(error, result ){
                                                                            arquivamentos[0].status = 4;
                                                                            arquivamentoDao.salvar( arquivamentos[0], function(error, resultadp ){
                                                                                schedulerDao.salvar(agenda, function(error, final){});
                                                                            });
                                                                        });
                                                                    }
                                                    
                                                                })                                  
                                                            }
                                                            index++
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

    }
    
}