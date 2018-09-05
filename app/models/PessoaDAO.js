function PessoaDAO( connection ){
	this._connection = connection; 
}

PessoaDAO.prototype.listar = function( callback) {
	this._connection.query('select * from PESSOA order by id', callback);	
}

PessoaDAO.prototype.salvar = function( pessoa, callback) {	
	if( !pessoa.id ) {
		this._connection.query('insert into PESSOA set ?', pessoa, callback);
	} else {
		this._connection.query('update PESSOA set ? where id = ?', [ pessoa, pessoa.id], callback);	
	}
}

PessoaDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from PESSOA where id = ?', id, callback);
}

PessoaDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from PESSOA where id = ?', id, callback);	
}

module.exports = function(){
	return PessoaDAO;
};
