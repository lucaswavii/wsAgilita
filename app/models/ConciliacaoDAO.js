function ConciliacaoDAO( connection ){
	this._connection = connection; 
}

ConciliacaoDAO.prototype.listarAdmin = function( id, callback) {
	this._connection.query('select * from CONCILIACAO where admin = ? order by id', callback);	
}

ConciliacaoDAO.prototype.listarCliente = function( id, callback) {
	this._connection.query('select * from CONCILIACAO where cliente = ? order by id', id, callback);	
}

ConciliacaoDAO.prototype.salvar = function( conciliacao, callback) {	
	if( !conciliacao.id ) {
		this._connection.query('insert into CONCILIACAO set ?', conciliacao, callback);
	} else {
		this._connection.query('update CONCILIACAO set ? where id = ?', [ conciliacao, conciliacao.id], callback);	
	}
}

ConciliacaoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from CONCILIACAO where id = ?', id, callback);
}

ConciliacaoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from CONCILIACAO where id = ?', id, callback);	
}

module.exports = function(){
	return ConciliacaoDAO;
};
