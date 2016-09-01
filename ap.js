var chatMultiApp = require('http').createServer(handleMultiChat);
var url = require('url');
var io = require('socket.io').listen(chatMultiApp);
var dato = 0;
var horario={};

chatMultiApp.listen(8056);
try{
  var mysql = require('mysql');
  var sql = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database :'ChatNode'
  });
}catch(e){
  console.log("Error al conectarse a la Base de Datos: "+e);
}

 
var connectedClients = [];
var userList = [];

function newMsg(socket, data) {  
 if(connectedClients.hasOwnProperty(socket.id))
    var clientFrom = connectedClients[socket.id];
  if(data.from == clientFrom.userName) {     
    if(data.type == 'PRIVATE') {     
     for(client in connectedClients) {    
      if(connectedClients[client].userName == data.to) { 
       connectedClients[client].socket.emit('msg', data);             
      }
     }
    } else {
     //socket.emit('msg', data);
     socket.broadcast.emit('msg', data);     
    }
    }else{
    for(client in connectedClients) {     
      if(connectedClients[client].userName == data.to) { 
       connectedClients[client].socket.emit('msg', data);
      }
     }
  }
}


 
function handleMultiChat(request, response) {
 var args = url.parse(request.url, true);
 var queryString = args.query;
   
  if(request.url == "/login") {
    response.end("TODO... SOON... ");    
  }
  
 if(queryString.hasOwnProperty("user")) {
  if(queryString.user == "test" && queryString.pass == "test") {
   response.writeHead(200);
   var debugData = {};
   debugData.users = connectedClients;
   debugData.userNames = userList;
   response.end(JSON.stringify(debugData));
  }
 } else {    
  response.writeHead(404);
  response.end("404 NOT FOUND");
 }
}
 
function assignUserName(userName, idSocket) {
 connectedClients[idSocket].userName = userName;
}
 
function isUserNameAvailable(userName) {
 for(var client in connectedClients) {
  if(connectedClients[client].userName == userName) {
   return false;   
  }
 }
 return true;
}
 
function makeUserList() {
 userList = []; 
  var i = 0;
 for(var client in connectedClients) {    
  userList[i] = {"userName" : connectedClients[client].userName};
    i++;
 } 
}
 
io.sockets.on('connection', function(socket) {
 setInterval(tiempo,1000);
 connectedClients[socket.id] = {}; 
 connectedClients[socket.id].socket = socket;
 
 var valor = 'valor ';
 dato = dato+1;
 valor = valor+dato+"";
 socket.emit('miNombre', valor);
  
 socket.on('authData', function(data) {
  if(isUserNameAvailable(data.userName) == true) {
   userList.push({"userName" : data.userName});
   assignUserName(data.userName, socket.id);
   socket.emit('userList', userList);
   socket.broadcast.emit('userList', userList);
  } else {
   socket.emit('authData', {"isAvailable" : false});   
  }
 });
  
 socket.on('msg', function(data) {  
  newMsg(socket, data);  
 });


 function tiempo(){
  var fecha = new Date();
  horario[0]=fecha.getHours();
  horario[1]=fecha.getMinutes();
  horario[2]=fecha.getSeconds();
  horario[3]=fecha.getDate();
  horario[4]=fecha.getMonth()+1;
  horario[5]=fecha.getFullYear();
  //console.log(horario[0]+":"+horario[1]+":"+horario[2]+" "+horario[3]+"/"+horario[4]+"/"+horario[5]); 
 }

 socket.on('nuevoCliente', function(datosCliente) {
  var dts = {};
  tiempo();
  socket.broadcast.emit("datosDesdeServidor", datosCliente, "1", horario[0]);
  /*if(horario[0] == 9 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 10 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 11 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 12 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 13 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 14 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 15 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 16 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 17 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    console.log(dts[0]);
    console.log(dts[1]);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 18 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"1",horario);
    socket.broadcast.emit("datosDesdeServidor", datosCliente, dts[1]);
  }else if(horario[0] == 19 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 20 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 21 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 22 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 23 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 24 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 1 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 2 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0");
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 3 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 4 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 5 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 6 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 7 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }else if(horario[0] == 8 && horario[1] >= 0){
    dts = insertarDatos(datosCliente,"0",horario);
    io.sockets.emit("fueraHorario", dts[0]);
  }*/
 }); 

function insertarDatos(datosCliente,valor,horario){
  var info={};
  var actual = horario[0]+":"+horario[1]+":"+horario[2]+" "+horario[3]+"/"+horario[4]+"/"+horario[0];
  if(valor == "1"){
    sql.query('INSERT INTO informacion (nombre, mail, telefono, empresa, informacion, ano, mes, dia, hora, minuto) VALUES ("'+datosCliente[0]+'","'+datosCliente[1]+'",'+datosCliente[2]+',"'+datosCliente[3]+'","'+datosCliente[4]+'",'+horario[5]+','+horario[4]+','+horario[3]+','+horario[0]+','+horario[1]+')');
    info[1] = actual;
  }else{
    sql.query('INSERT INTO informacion (nombre, mail, telefono, empresa, informacion, ano, mes, dia, hora, minuto) VALUES ("'+datosCliente[0]+'","'+datosCliente[1]+'",'+datosCliente[2]+',"'+datosCliente[3]+'","'+datosCliente[4]+'",'+horario[5]+','+horario[4]+','+horario[3]+','+horario[0]+','+horario[1]+')');
    info[0] = "El chat se encuentra fuera del horario de servicio, su información ha sido enviada y nos pondremos en contacto con usted lo mas pronto posible";
    info[1] = actual;
  }
  console.log(info[0]);
  console.log(info[1]);
  return info;
}
  
 socket.on('disconnect', function(data) {
    if(connectedClients.hasOwnProperty(socket.id)) {
      delete connectedClients[socket.id];
    }    
  makeUserList();
  socket.broadcast.emit('userList', userList);
 });


///RECIBE NOMBRE DE USUARIO Y PASS PARA VERIFICAR EN LA BASE DE DATOS
socket.on('passContra', function(nickUsuario,pass){
  console.log("Recibo Usuario: "+nickUsuario+" Contraseña: "+pass)
  var vandera = false;
  sql.query(
      'SELECT Nombre, Nick, Contrasena FROM admins',
      function selectUsuario(err, results, fields) {
   
      if (err) {
          console.log("Error: " + err.message);
          throw err;
      }
      for(var i=0; i<results.length;i++){
        if(results[i].Nick == nickUsuario && results[i].Contrasena == pass){
        vandera = true;
        nickUsuario = results[i].Nombre
        var Nickname = results[i].Nick
        console.log("Bienvenido", nickUsuario)
        i = results.length;
      }else{
        vandera = false;
        console.log("Incorrecto")
      }
      }
    socket.emit("recibeLogin",vandera, nickUsuario, Nickname);
    });
});

});