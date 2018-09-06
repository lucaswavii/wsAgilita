function ConfiguracaoDAO( connection ){
	this._connection = connection; 
}

ConfiguracaoDAO.prototype.listar = function( callback) {
	this._connection.query('select * from CONFIGURACAO order by id', callback);	
}

ConfiguracaoDAO.prototype.salvar = function( configuracao, callback) {	
	if( !configuracao.id ) {
		this._connection.query('insert into CONFIGURACAO set ?', configuracao, callback);
	} else {
		this._connection.query('update CONFIGURACAO set ? where id = ?', [ configuracao, configuracao.id], callback);	
	}
}

ConfiguracaoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from CONFIGURACAO where id = ?', id, callback);
}

ConfiguracaoDAO.prototype.configuracao = function( empresa, callback) {
	this._connection.query('select * from CONFIGURACAO where empresa = ?', empresa, callback);
}

ConfiguracaoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from CONFIGURACAO where id = ?', id, callback);	
}

module.exports = function(){
	return ConfiguracaoDAO;
};
