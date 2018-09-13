function ArquivamentoDAO( connection ){
	this._connection = connection; 
}

ArquivamentoDAO.prototype.taxas = function( id, callback) {
	var sql  = ' SELECT taxa.* FROM ARQUIVAMENTO arquivamento '
	sql 	+= ' inner join CONCILIADOR conciliador on ( conciliador.id = arquivamento.conciliador ) '
	sql 	+= ' inner join CONTRATO contrato on ( contrato.id = conciliador.contrato) '
	sql 	+= ' inner join TAXA taxa on ( taxa.contrato = contrato.id)'
	sql 	+= ' where arquivamento.id = ? ' 
	this._connection.query(sql, id, callback);
}

ArquivamentoDAO.prototype.percentual = function(id, callback) {

	var sql  = ' SELECT cliente.arquivocliente, (count(conciliado.id)/count(cliente.id)*100 ) as percentual from LAYOUTCLIENTE cliente'
	sql 	+= ' left outer join CONCILIACAO conciliado on ( conciliado.cliente = cliente.id )'
	sql     += ' where cliente.arquivocliente = ? '
	
	this._connection.query(sql,id, callback);
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
