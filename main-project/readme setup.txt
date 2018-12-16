For at teste systemet burde dette være nok til at installere det (på windows 10)

1. Installer node.js og MySQL (jeg kører node v10.6.0 og MySQL v8.0.13)

2. Opret en bruger med navn "nlj" og kode "password" (hvis du ikke vil oprette en bruger skal du ændre i filen /server/modules/database/mysqlconfig.js)

3. Opret en database med navnet "mydb2"

4. Vælg mydb2 og execute mysqldb.sql og mysqlTestData.sql

4. Åben en terminal/powershell i root af mit projekt og kør "npm install" for at installere dependencies

5. Kør "npm start" i terminalen

6. Systemet kører nu på http://localhost:3000 (port kan evt ændres i config.js)


Hvis du får fejlen "Client does not support authentication protocol requested by server; consider upgrading MySQL client" kør dette i MySQL:
ALTER USER 'nlj'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;