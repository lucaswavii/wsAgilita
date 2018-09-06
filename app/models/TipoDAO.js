function TipoDAO( connection ){
	this._connection = connection; 
}

TipoDAO.prototype.listar = function( callback) {
	this._connection.query('select * from TIPO order by id', callback);	
}

TipoDAO.prototype.salvar = function( tipo, callback) {	
	if( !tipo.id ) {
		this._connection.query('insert into TIPO set ?', tipo, callback);
	} else {
		this._connection.query('update TIPO set ? where id = ?', [ tipo, tipo.id], callback);	
	}
}

TipoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from TIPO where id = ?', id, callback);
}

TipoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from TIPO where id = ?', id, callback);	
}

module.exports = function(){
	return TipoDAO;
};
