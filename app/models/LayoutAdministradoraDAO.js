function LayoutAdministradoraDAO( connection ){
	this._connection = connection; 
}

LayoutAdministradoraDAO.prototype.listar = function( arquivo, callback) {
	this._connection.query('select * from LAYOUTADMINISTRADORA where arquivamentoadministradora = ? order by id', arquivo, callback);	
}

LayoutAdministradoraDAO.prototype.buscar = function( file, dados, callback) {

	var sql  = "select * from LAYOUTADMINISTRADORA "
	sql 	+= " where arquivamentoadministradora = ? "
	sql 	+= " and cnpj = ? "
	sql     += " and administradora = ? "
	sql     += " and bandeira = ? "
	sql     += " and tipocartao = ? "
	sql     += " and parcelamento = ? "
	sql     += " and parcelas = ? "
	sql     += " and datavenda = ? "
	sql     += " and datarecebimento = ? "
	

	this._connection.query(sql, [file.id, dados.cnpj, dados.administradora, dados.bandeira, dados.tipocartao, dados.parcelamento, dados.parcelas, dados.datavenda, dados.datarecebimento ], callback);	
}

LayoutAdministradoraDAO.prototype.salvar = function( layout, callback) {	
	if( !layout.id ) {
		this._connection.query('insert into LAYOUTADMINISTRADORA set ?', layout, callback);
	} else {
		this._connection.query('update LAYOUTADMINISTRADORA set ? where id = ?', [ layout, layout.id], callback);	
	}
}

LayoutAdministradoraDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from LAYOUTADMINISTRADORA where id = ?', id, callback);
}

LayoutAdministradoraDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from LAYOUTADMINISTRADORA where id = ?', id, callback);	
}

module.exports = function(){
	return LayoutAdministradoraDAO;
};
