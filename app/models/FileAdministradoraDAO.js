function FileAdministradoraDAO( connection ){
	this._connection = connection; 
}

FileAdministradoraDAO.prototype.listar = function( arquivamento, callback) {
	this._connection.query('select * from ARQUIVOADMINISTRADORA order by id', arquivamento, callback);	
}

FileAdministradoraDAO.prototype.salvar = function( fileAdministradora, callback) {	
	if( !fileAdministradora.id ) {
		this._connection.query('insert into ARQUIVOADMINISTRADORA set ?', fileAdministradora, callback);
	} else {
		this._connection.query('update ARQUIVOADMINISTRADORA set ? where id = ?', [ fileAdministradora, fileAdministradora.id], callback);	
	}
}

FileAdministradoraDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from ARQUIVOADMINISTRADORA where id = ?', id, callback);
}

FileAdministradoraDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from ARQUIVOADMINISTRADORA where id = ?', id, callback);	
}

module.exports = function(){
	return FileAdministradoraDAO;
};
