module.exports = function Schedulers( connection, req, res ) {
    
    var Request = require("request");
    var con = connection;

   

    this.importacaoXlsCliente = function( application ) {
            
        var schedulerDao = new application.app.models.SchedulerDAO(connection);
        var arquivamentoDao = new application.app.models.ArquivamentoDAO(connection);      
        var fileClienteDao = new application.app.models.FileClienteDAO(connection);      
        var fileAdminDao = new application.app.models.FileAdministradoraDAO(connection);
        var layoutClienteDao = new application.app.models.LayoutClienteDAO(connection);
        var layoutAdminDao = new application.app.models.LayoutAdministradoraDAO(connection);

        const { getJsDateFromExcel } = require('excel-date-to-js') 

        //Modulo para trabalhar com datas
        const moment = require('moment') 
        
        function excelDateToJSDate(date) {
            let data = getJsDateFromExcel(date)
            return moment(data).utc().format("YYYY/MM/DD")
        }

        schedulerDao.listar(function(error, schedulers){
            
        });
        
        schedulerDao.listar(function(error, schedulers){
             
            for (let index = 0; index < schedulers.length; index++) {
                const tarefa = schedulers[index];

                tarefa.fechamento = new Date();
                var params = JSON.parse(tarefa.parametros);
                fileClienteDao.editar(params.idCliente, function(error, fileClient){
                    const fs = require('fs') 
                    const xlsx = require('node-xlsx');

                    var filePath = `${__dirname}`+  fileClient[0].path;
                    filePath = filePath.replace('api','public')

                    const plan = xlsx.parse(filePath);
             
                    for (let linha = 0; linha < plan[0].data.length; linha++) {
                        if( linha > 1 ) {
                            const colunas = plan[0].data[linha];
                        
                            if( colunas.length == 10 ) {
                                console.log(colunas)
                                

                                var dados = {
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
                                    arquivocliente: params.idArquivamento
                                }
                                layoutClienteDao.salvar(dados, function(error, result ){});
                            // console.log(colunas)
                                

                            }
                        }
                    }

                });

                schedulerDao.salvar(tarefa, function(error, resultado){});
            }   
            
            connection.end();
        
        });    
    }
}