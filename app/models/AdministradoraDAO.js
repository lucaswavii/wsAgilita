function AdministradoraDAO( connection ){
	this._connection = connection; 
}

AdministradoraDAO.prototype.listar = function( callback) {
	this._connection.query('select * from ADMINISTRADORA order by id', callback);	
}

AdministradoraDAO.prototype.salvar = function( administradora, callback) {	
	if( !administradora.id ) {
		this._connection.query('insert into ADMINISTRADORA set ?', administradora, callback);
	} else {
		this._connection.query('update ADMINISTRADORA set ? where id = ?', [ administradora, administradora.id], callback);	
	}
}

AdministradoraDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from ADMINISTRADORA where id = ?', id, callback);
}

AdministradoraDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from ADMINISTRADORA where id = ?', id, callback);	
}

module.exports = function(){
	return AdministradoraDAO;
};
