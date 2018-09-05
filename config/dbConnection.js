var mysql = require('mysql');
// Configuração do banco de dados
var connMysql = function() {
	return mysql.createConnection({
			host : '',
			user: 'root',
			password: 'Wa180279',
			database: 'wsagilita'
	});
}

module.exports = function(){
	return connMysql;
}
