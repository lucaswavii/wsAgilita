function ContratoDAO( connection ){
	this._connection = connection; 
}

ContratoDAO.prototype.listar = function( callback) {
	this._connection.query('select * from CONTRATO where inicio < now() and fim >= now() order by id', callback);	
}

ContratoDAO.prototype.salvar = function( contrato, callback) {	
	if( !contrato.id ) {
		this._connection.query('insert into CONTRATO set ?', contrato, callback);
	} else {
		this._connection.query('update CONTRATO set ? where id = ?', [ contrato, contrato.id], callback);	
	}
}

ContratoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from CONTRATO where id = ?', id, callback);
}

ContratoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from CONTRATO where id = ?', id, callback);	
}

module.exports = function(){
	return ContratoDAO;
};
