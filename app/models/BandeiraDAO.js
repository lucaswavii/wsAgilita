function BandeiraDAO( connection ){
	this._connection = connection; 
}

BandeiraDAO.prototype.listar = function( callback) {
	this._connection.query('select * from BANDEIRA order by id', callback);	
}

BandeiraDAO.prototype.salvar = function( bandeira, callback) {	
	if( !bandeira.id ) {
		this._connection.query('insert into BANDEIRA set ?', bandeira, callback);
	} else {
		this._connection.query('update BANDEIRA set ? where id = ?', [ bandeira, bandeira.id], callback);	
	}
}

BandeiraDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from BANDEIRA where id = ?', id, callback);
}

BandeiraDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from BANDEIRA where id = ?', id, callback);	
}

module.exports = function(){
	return BandeiraDAO;
};
