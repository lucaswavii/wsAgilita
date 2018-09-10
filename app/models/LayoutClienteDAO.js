function LayoutClienteDAO( connection ){
	this._connection = connection; 
}

LayoutClienteDAO.prototype.listar = function( callback) {
	this._connection.query('select * from LAYOUTCLIENTE order by id', callback);	
}

LayoutClienteDAO.prototype.salvar = function( layout, callback) {	
	if( !layout.id ) {
		this._connection.query('insert into LAYOUTCLIENTE set ?', layout, callback);
	} else {
		this._connection.query('update LAYOUTCLIENTE set ? where id = ?', [ layout, layout.id], callback);	
	}
}

LayoutClienteDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from LAYOUTCLIENTE where id = ?', id, callback);
}

LayoutClienteDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from LAYOUTCLIENTE where id = ?', id, callback);	
}

module.exports = function(){
	return LayoutClienteDAO;
};
