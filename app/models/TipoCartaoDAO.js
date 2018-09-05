function TipoCartaoDAO( connection ){
	this._connection = connection; 
}

TipoCartaoDAO.prototype.listar = function( callback) {
	this._connection.query('select * from TIPOCARTAO order by id', callback);	
}

TipoCartaoDAO.prototype.salvar = function( tipocartao, callback) {	
	if( !tipocartao.id ) {
		this._connection.query('insert into TIPOCARTAO set ?', tipocartao, callback);
	} else {
		this._connection.query('update TIPOCARTAO set ? where id = ?', [ tipocartao, tipocartao.id], callback);	
	}
}

TipoCartaoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from TIPOCARTAO where id = ?', id, callback);
}

TipoCartaoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from TIPOCARTAO where id = ?', id, callback);	
}

module.exports = function(){
	return TipoCartaoDAO;
};
