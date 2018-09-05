module.exports = function(application){

    application.get('/login', function(req, res){		
        res.render('login');
    });

    application.post('/acessar', function(req, res){		
        application.app.controllers.usuario.login(application, req, res);
    });
    
    application.get('/', function(req, res){
        application.app.controllers.index.index(application, req, res);
    });
  
    application.get('/index', function(req, res){		
        application.app.controllers.index.index(application, req, res);
    });

    application.get('/empresa', function(req, res){		
        application.app.controllers.empresa.index(application, req, res);
    });

    application.get('/pessoa', function(req, res){		
        application.app.controllers.pessoa.index(application, req, res);
    });

    application.get('/classificacao', function(req, res){		
        application.app.controllers.classificacao.index(application, req, res);
    });

    application.get('/usuario', function(req, res){		
        application.app.controllers.usuario.index(application, req, res);
    });

    application.get('/grupo', function(req, res){		
        application.app.controllers.grupo.index(application, req, res);
    });
    
    application.get('/login', function(req, res){		
        //application.app.controllers.index.index(application, req, res);
        res.render('login', {  sessao: {} } );
    });
}  