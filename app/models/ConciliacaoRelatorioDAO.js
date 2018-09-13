function ConciliacaoRelatorioDAO( connection ){
	this._connection = connection; 
}

ConciliacaoRelatorioDAO.prototype.listar = function( id, callback) {
    var sql     = " SELECT conciliacao.* FROM CONCILIACAO conciliacao "
    sql        += " inner join LAYOUTCLIENTE layoutCliente on ( layoutCliente.id = conciliacao.cliente ) "
    sql        += " inner join ARQUIVAMENTO arquivamento on ( arquivamento.id = layoutCliente.arquivocliente ) "
    sql        += " where arquivamento.id = ? "
	this._connection.query(sql, id, callback);	
}

module.exports = function(){
	return ConciliacaoRelatorioDAO;
};
