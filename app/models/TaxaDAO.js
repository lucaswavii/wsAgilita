function TaxaDAO( connection ){
	this._connection = connection; 
}

TaxaDAO.prototype.listar = function( callback) {
	this._connection.query('select * from TAXA order by id', callback);	
}

TaxaDAO.prototype.salvar = function( taxa, callback) {	
	if( !taxa.id ) {
		this._connection.query('insert into TAXA set ?', taxa, callback);
	} else {
		this._connection.query('update TAXA set ? where id = ?', [ taxa, taxa.id], callback);	
	}
}

TaxaDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from TAXA where id = ?', id, callback);
}

TaxaDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from TAXA where id = ?', id, callback);	
}

module.exports = function(){
	return TaxaDAO;
};
