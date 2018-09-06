function SolucaoDAO( connection ){
	this._connection = connection; 
}

SolucaoDAO.prototype.listar = function( callback) {
	this._connection.query('select * from SOLUCAO order by id', callback);	
}

SolucaoDAO.prototype.salvar = function( solucao, callback) {	
	if( !solucao.id ) {
		this._connection.query('insert into SOLUCAO set ?', solucao, callback);
	} else {
		this._connection.query('update SOLUCAO set ? where id = ?', [ solucao, solucao.id], callback);	
	}
}

SolucaoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from SOLUCAO where id = ?', id, callback);
}

SolucaoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from SOLUCAO where id = ?', id, callback);	
}

module.exports = function(){
	return SolucaoDAO;
};
