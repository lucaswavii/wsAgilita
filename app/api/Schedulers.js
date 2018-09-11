module.exports = function Schedulers( application, connection, req, res ) {
    
    var Request = require("request");
    var con = connection;

    var schedulerDao = new application.app.models.SchedulerDAO(con);
    var arquivamentoDao = new application.app.models.ArquivamentoDAO(con);      
    var fileClienteDao = new application.app.models.FileClienteDAO(con);      
    var fileAdminDao = new application.app.models.FileAdministradoraDAO(con);
    var layoutClienteDao = new application.app.models.LayoutClienteDAO(con);
    var layoutAdminDao = new application.app.models.LayoutAdministradoraDAO(con);

        
    this.importacaoXlsCliente = function() {
        console.log('Processando...');
        
        const { getJsDateFromExcel } = require('excel-date-to-js') 
        const moment = require('moment') 
        
        function excelDateToJSDate(date) {
            let data = getJsDateFromExcel(date)
            return moment(data).utc().format("YYYY/MM/DD")
        }

        const fs = require('fs') 
        const xlsx = require('node-xlsx');

        
        schedulerDao.listar(function(error, schedulers){
            
            if( schedulers && schedulers.length > 0 ) { 
            
                for (let index = 0; index < schedulers.length; index++) {

                    const tarefa = schedulers[index];
                    var params = JSON.parse(tarefa.parametros);
                    
                    fileClienteDao.editar(params.idCliente, function(error, fileClient){
                        console.log(fileClient)
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
                                                                observacao: "Cnpj:" + colunas[9],
                                                                arquivocliente: fileClient[0].id
                                                            }
                                    layoutClienteDao.salvar(dadosFileCliente,function(error, layout){});
                                    
                                }

                            }

                            fileClient[0].processado = 'S';

                            fileClienteDao.salvar(fileClient[0], function(error, fileClientResult){});
                    
                        }
                            

                    });

                    


                }
            }            
        });
    }

    this.importacaoXlsAdmin = function() {

        console.log('Processando...');
        
        const { getJsDateFromExcel } = require('excel-date-to-js') 
        const moment = require('moment') 
        
        function excelDateToJSDate(date) {
            let data = getJsDateFromExcel(date)
            return moment(data).utc().format("YYYY/MM/DD")
        }

        const fs = require('fs') 
        const xlsx = require('node-xlsx');

        
        schedulerDao.listar(function(error, schedulers){
            
            if( schedulers && schedulers.length > 0 ) { 
            
                for (let index = 0; index < schedulers.length; index++) {

                    const tarefa = schedulers[index];
                    var params = JSON.parse(tarefa.parametros);
                    
                    fileAdminDao.editar(params.idAdmin, function(error, fileAdmin){
                        console.log(fileAdmin)
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
                                                                observacao: "Cnpj:" + colunas[12],
                                                                arquivamentoadministradora: fileAdmin[0].id
                                                            }
                                    layoutAdminDao.salvar(dadosFileAdmin,function(error, layout){});
                                    
                                }

                            }

                            fileAdmin[0].processado = 'S';

                            fileAdminDao.salvar(fileAdmin[0], function(error, fileClientResult){});
                    
                        }
                            

                    });

                    


                }
            }            
        });
    }
}