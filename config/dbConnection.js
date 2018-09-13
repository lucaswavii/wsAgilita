var mysql = require('mysql');
// Configuração do banco de dados
var connMysql = function() {
	/*return mysql.createConnection({
			host : 'localhost',
			user: 'root',
			password: '123456',
			database: 'wsagilita'
	});*/
	return mysql.createConnection({
		host : '',
		user: 'root',
		password: '',
		database: 'wsagilita'
	});
}

module.exports = function(){
	return connMysql;
}
