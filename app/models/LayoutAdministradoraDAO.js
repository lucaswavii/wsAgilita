function LayoutAdministradoraDAO( connection ){
	this._connection = connection; 
}

LayoutAdministradoraDAO.prototype.listar = function( callback) {
	this._connection.query('select * from LAYOUTADMINISTRADORA order by id', callback);	
}

LayoutAdministradoraDAO.prototype.salvar = function( layout, callback) {	
	if( !layout.id ) {
		this._connection.query('insert into LAYOUTADMINISTRADORA set ?', layout, callback);
	} else {
		this._connection.query('update LAYOUTADMINISTRADORA set ? where id = ?', [ layout, layout.id], callback);	
	}
}

LayoutAdministradoraDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from LAYOUTADMINISTRADORA where id = ?', id, callback);
}

LayoutAdministradoraDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from LAYOUTADMINISTRADORA where id = ?', id, callback);	
}

module.exports = function(){
	return LayoutAdministradoraDAO;
};
