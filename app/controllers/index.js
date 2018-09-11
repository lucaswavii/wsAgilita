var Schedulers = require('../api/Schedulers');

module.exports.index = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
		  res.redirect("/login");
		  return;			
    }
    var connection = application.config.dbConnection();
    var cron = require('node-cron');
 
    var task1 = cron.schedule('* * * * *', function() {
        var scheduler = new Schedulers( application, connection, req, res );
        scheduler.importacaoXls();       
    });
    task1.start();
   
    res.render('index', { validacao : {}, sessao: req.session.usuario  });
    return;	
}

