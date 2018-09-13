var Schedulers = require('../api/Schedulers');

module.exports.index = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
		  res.redirect("/login");
		  return;			
    }
    
    const moment = require('moment') 
    
    var cron = require('node-cron');

    var task1 = cron.schedule('* * * * *', function() {

        var connection = application.config.dbConnection();
        var schedulerDao = new application.app.models.SchedulerDAO(connection);
        schedulerDao.listar(function(error, schedulers){
            
            if( schedulers && schedulers.length > 0 ) {
            
                for (let index = 0; index < schedulers.length; index++) {


                    try {

                        var tarefa = schedulers[index];
                        var params = JSON.parse(tarefa.parametros); 
                        
                        var hoje = new Date();
                        var agenda = { 
                                        data: hoje, 
                                        hora: moment(hoje).utc().format("hh:mm"), 
                                        titulo:'Tarefa Conciliação de Arquivo', 
                                        tipo: 6, 
                                        resultado:"Tarefa : " + tarefa.id + 'Executada com sucesso!' ,
                                        agenda: hoje, 
                                        agendah: moment(hoje).utc().format("hh:mm"), 
                                        parametros: '{}', 
                                        habilitado:'S'
                                    }

                        if( params.idCliente && params.idAdmin && params.idArquivamento ) {
                            console.log("Conciliador...")
                           
                            tarefa.fechamento = new Date();

                            schedulerDao.salvar(tarefa, function(error, schedulers){
                            
                                var con = application.config.dbConnection();

                                var scheduler = new Schedulers( application, con, req, res );
                                //scheduler.importacaoXls( tarefa, agenda );                               
                                scheduler.importacao(tarefa)
                                connection.end();  
                            
                            }); 
                        } else if( params.idConciliador ) {
                            console.log("Conciliação...")
                            var tarefa = schedulers[index];
                            tarefa.fechamento = new Date();

                            schedulerDao.salvar(tarefa, function(error, schedulers){
                            
                                var con = application.config.dbConnection();

                                var scheduler = new Schedulers( application, con, req, res );
                                scheduler.conciliacaoCartao(tarefa,agenda)
                                connection.end();  
                            
                            }); 

                        }        
                    } catch (error) {
                       console.log(error)
                    }
                }
            } 
            
        });
    
    });
    task1.start();
   
    res.render('index', { validacao : {}, sessao: req.session.usuario  });
    return;	
}

