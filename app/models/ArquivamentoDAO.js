function ArquivamentoDAO( connection ){
	this._connection = connection; 
}

ArquivamentoDAO.prototype.listar = function( callback) {
	this._connection.query('select * from ARQUIVAMENTO order by id', callback);	
}

ArquivamentoDAO.prototype.salvar = function( arquivamento, callback) {	
	if( !arquivamento.id ) {
		this._connection.query('insert into ARQUIVAMENTO set ?', arquivamento, callback);
	} else {
		this._connection.query('update ARQUIVAMENTO set ? where id = ?', [ arquivamento, arquivamento.id], callback);	
	}
}

ArquivamentoDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from ARQUIVAMENTO where id = ?', id, callback);
}

ArquivamentoDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from ARQUIVAMENTO where id = ?', id, callback);	
}

module.exports = function(){
	return ArquivamentoDAO;
};
