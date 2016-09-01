var socket = null;  
var userName = null;
var mensajeA = '';
var idUs= '';
var nick='';

function selectUserName(userName) {
  var selectUsers = document.getElementById("userList");
  selectUsers.value = userName;        
}

function hndlAuthData(data) {
  if(data.isAvailable == false) {
    alert("NOMBRE DE USUARIO YA COGIDO. ELIGE OTRO");
    location.reload(true);
  }
}    
    
function leer() {
  document.$_GET = [];
  var urlHalves = String(document.location).split('?');
  if(urlHalves[1]){
    var urlVars = urlHalves[1].split('&');
      for(var i=0; i<=(urlVars.length); i++){
        if(urlVars[i]){
          var urlVarPair = urlVars[i].split('=');
          document.$_GET[urlVarPair[0]] = urlVarPair[1];
        }
      }
    }
  mensajeA = decodeURI(document.$_GET['Destino']);
  nick = decodeURI(document.$_GET['De']);
  $("#message_cliente").focus();
  var enter=document.getElementById("message_cliente");
  enter.onkeyup=function(e)
  {
     if(e.keyCode==13)
     {
         sendMessage();
     }
  }
}
    
function handleMessage(data) {
  if(data.type == "PUBLIC"){

  }else{
    var htmlCurrent = $("#private_messages_cliente").html();
    htmlCurrent += "<b>" + data.from + ":</b>" + data.message+"<br>";
    $("#private_messages_cliente").animate({ scrollTop: $("#private_messages_cliente").prop("scrollHeight") }, 500);
    $("#private_messages_cliente").html(htmlCurrent); 
    document.getElementById('privado').volume=1;
    document.getElementById('privado').play();
  }
}

function pintar(data){
  var htmlCurrent = $("#private_messages_cliente").html();
  htmlCurrent += "<b><Font Color='Blue'>" + data.from + ":</b>" + data.message+"</Font><br>";
  $("#private_messages_cliente").animate({ scrollTop: $("#private_messages_cliente").prop("scrollHeight") }, 500);
  $("#private_messages_cliente").html(htmlCurrent);    
}
    
function sendMessage() {
  if($("#message_cliente").val()==""){

  }else{
    var msg = {};
    msg.type = "PRIVATE";
    msg.to = mensajeA;
    msg.from =  userName;
    msg.laid = nick;
    msg.message = $("#message_cliente").val();
    $("#message_cliente").val("");
    pintar(msg);
    $("#message_cliente").focus();    
    socket.emit('msg', msg);
  }
}
    
function miName(myid){
  userName=myid;
  socket.emit('authData', {"userName" : userName});
}

try {
  socket = io.connect('http://localhost:8056');
  //socket.on('authData', hndlAuthData);
  socket.on('msg', handleMessage);
  socket.on('miNombre',miName);
   
} catch(e) {
  alert("El servidor no se ha iniciado");
}