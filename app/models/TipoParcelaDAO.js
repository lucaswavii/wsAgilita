function TipoParcelaDAO( connection ){
	this._connection = connection; 
}

TipoParcelaDAO.prototype.listar = function( callback) {
	this._connection.query('select * from TIPOPARCELA order by id', callback);	
}

TipoParcelaDAO.prototype.salvar = function( tipoparcela, callback) {	
	if( !tipoparcela.id ) {
		this._connection.query('insert into TIPOPARCELA set ?', tipoparcela, callback);
	} else {
		this._connection.query('update TIPOPARCELA set ? where id = ?', [ tipoparcela, tipoparcela.id], callback);	
	}
}

TipoParcelaDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from TIPOPARCELA where id = ?', id, callback);
}

TipoParcelaDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from TIPOPARCELA where id = ?', id, callback);	
}

module.exports = function(){
	return TipoParcelaDAO;
};
