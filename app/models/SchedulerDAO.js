function SchedulerDAO( connection ){
	this._connection = connection; 
}

SchedulerDAO.prototype.listar = function( callback) {
	this._connection.query('select * from SCHEDULER where fechamento is null order by id', callback);	
}

SchedulerDAO.prototype.salvar = function( scheduler, callback) {	
	if( !scheduler.id ) {
		this._connection.query('insert into SCHEDULER set ?', scheduler, callback);
	} else {
		this._connection.query('update SCHEDULER set ? where id = ?', [ scheduler, scheduler.id], callback);	
	}
}

SchedulerDAO.prototype.editar = function( id, callback) {
	this._connection.query('select * from SCHEDULER where id = ?', id, callback);
}

SchedulerDAO.prototype.excluir = function( id, callback) {
	this._connection.query('delete from SCHEDULER where id = ?', id, callback);	
}

module.exports = function(){
	return SchedulerDAO;
};
