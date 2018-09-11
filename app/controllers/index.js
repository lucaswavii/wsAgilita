var Schedulers = require('../api/Schedulers');

module.exports.index = function( application, req, res ){
    
    if( req.session.usuario == undefined ) {
		  res.redirect("/login");
		  return;			
    }
    var connection = application.config.dbConnection();
    var cron = require('node-cron');
 
    var task = cron.schedule('* * * * *', function() {
        var scheduler = new Schedulers( application, connection, req, res );
        scheduler.importacaoXlsCliente();
        scheduler.importacaoXlsAdmin();
    });

    res.render('index', { validacao : {}, sessao: req.session.usuario  });
    return;	
}

