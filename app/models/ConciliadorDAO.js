function ConciliadorDAO( connection ){
	this._connection = connection; 
}

ConciliadorDAO.prototype.listar = function( callback) {
	this._connection.query('select * from CONCILIADOR order by id', callback);	
}

ConciliadorDAO.prototype.salvar = function( conciliador, callback) {	
	if( !conciliador.id ) {
		this._connection.query('insert into CONCILIADOR set ?', conciliador, callback);
	} else {
		this._connection.query('update CONCILIADOR set ? where id = ?', [ conciliador, conciliador.id], callback);	
	}
}

ConciliadorDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from CONCILIADOR where id = ?', id, callback);
}

ConciliadorDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from CONCILIADOR where id = ?', id, callback);	
}

module.exports = function(){
	return ConciliadorDAO;
};
