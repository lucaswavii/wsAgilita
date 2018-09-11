function FileClienteDAO( connection ){
	this._connection = connection; 
}

FileClienteDAO.prototype.listar = function( arquivamento, callback) {
	this._connection.query('select * from ARQUIVOCLIENTE where arquivamento = ? order by id', arquivamento, callback);	
}

FileClienteDAO.prototype.salvar = function( fileCliente, callback) {	
	
	if( !fileCliente.id ) {
		this._connection.query('insert into ARQUIVOCLIENTE set ?', fileCliente, callback);
	} else {
		this._connection.query('update ARQUIVOCLIENTE set ? where id = ?', [ fileCliente, fileCliente.id], callback);	
	}
}

FileClienteDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from ARQUIVOCLIENTE where id = ?', id, callback);
}

FileClienteDAO.prototype.abre = function( id, callback) {
	this._connection.query('select * from ARQUIVOCLIENTE where arquivamento = ?', id, callback);
}

FileClienteDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from ARQUIVOCLIENTE where id = ?', id, callback);	
}

module.exports = function(){
	return FileClienteDAO;
};
