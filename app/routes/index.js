module.exports = function(application){

    application.get('/login', function(req, res){		
        res.render('login');
    });

    application.get('/logout', function(req, res){		
        application.app.controllers.usuario.logout(application, req, res);
    });

    application.post('/acessar', function(req, res){		
        application.app.controllers.usuario.login(application, req, res);
    });

    application.post('/esqueci', function(req, res){		
        application.app.controllers.usuario.esqueci(application, req, res);
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

    application.get('/tipocartao', function(req, res){		
        application.app.controllers.tipocartao.index(application, req, res);
    });

    application.get('/tipoparcela', function(req, res){		
        application.app.controllers.tipoparcela.index(application, req, res);
    });

    application.get('/bandeira', function(req, res){		
        application.app.controllers.bandeira.index(application, req, res);
    });

    application.get('/administradora', function(req, res){		
        application.app.controllers.administradora.index(application, req, res);
    });

    application.get('/tipo', function(req, res){		
        application.app.controllers.tipo.index(application, req, res);
    });

    application.get('/solucao', function(req, res){		
        application.app.controllers.solucao.index(application, req, res);
    });

    application.get('/scheduler', function(req, res){		
        application.app.controllers.scheduler.index(application, req, res);
    });

    application.get('/contrato', function(req, res){		
        application.app.controllers.contrato.index(application, req, res);
    });

    application.get('/conciliador', function(req, res){		
        application.app.controllers.conciliador.index(application, req, res);
    });

    application.get('/configuracao', function(req, res){		
        application.app.controllers.configuracao.index(application, req, res);
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