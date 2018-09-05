function ClassificacaoDAO( connection ){
	this._connection = connection; 
}

ClassificacaoDAO.prototype.listar = function( callback) {
	this._connection.query('select * from CLASSIFICACAO order by id', callback);	
}

ClassificacaoDAO.prototype.salvar = function( classificacao, callback) {	
	if( !classificacao.id ) {
		this._connection.query('insert into CLASSIFICACAO set ?', classificacao, callback);
	} else {
		this._connection.query('update CLASSIFICACAO set ? where id = ?', [ classificacao, classificacao.id], callback);	
	}
}

ClassificacaoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from CLASSIFICACAO where id = ?', id, callback);
}

ClassificacaoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from CLASSIFICACAO where id = ?', id, callback);	
}

module.exports = function(){
	return ClassificacaoDAO;
};
