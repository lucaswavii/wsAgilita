var Schedulers = require('../api/Schedulers');

module.exports.index = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
		  res.redirect("/login");
		  return;			
    }
    
    var cron = require('node-cron');

    var task1 = cron.schedule('* * * * *', function() {

        var connection = application.config.dbConnection();
        var schedulerDao = new application.app.models.SchedulerDAO(connection);
        schedulerDao.listar(function(error, schedulers){
            
            if( schedulers && schedulers.length > 0 ) {
            
                for (let index = 0; index < schedulers.length; index++) {
                    try {

                        var tarefa = schedulers[index];
                        tarefa.fechamento = new Date();

                        schedulerDao.salvar(tarefa, function(error, schedulers){
                           
                            var con = application.config.dbConnection();

                            var scheduler = new Schedulers( application, con, req, res );
                            scheduler.importacaoXls( tarefa );
                            connection.end();  
                           
                        }); 
                            
                    } catch (error) {
                        con.end()
                    }
                }
            } 
            
        });
    
    });
    task1.start();
   
    res.render('index', { validacao : {}, sessao: req.session.usuario  });
    return;	
}

