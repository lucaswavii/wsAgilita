module.exports = function(application){
    
    application.get('/relatorioConciliado/:_id', function(req, res){
        application.app.controllers.relatorioConciliado.index(application, req, res);
    }); 
    
   
}