var socket = null;  
var userName = null;
var mensajeA = '';
    
function selectUserName(userName) {
  var selectUsers = document.getElementById("userList");
  selectUsers.value = userName;        
}

function hndlAuthData(data) {
  if(data.isAvailable == false) {
    alert("NOMBRE DE USUARIO YA UTILIZADO. ELIGE OTRO");
    location.reload(true);
  }
}    
    
function authenticate() {
  $("#main_container").hide();
  $("#nombre").focus();
  var enter=document.getElementById("message_cliente");
  enter.onkeyup=function(e)
  {
     if(e.keyCode==13)
     {
         sendMessage();
     }
  }
}


function valEmail(valor) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(valor)){
    return (true)
  } else {
    return (false);
  }
}

function isNumberKey(evt){
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
 
  return true;
}
    
function handleMessage(data) {
  if(data.type == "PUBLIC"){

  }else{
    mensajeA = data.from;
    var htmlCurrent = $("#private_messages_cliente").html();
    htmlCurrent += "<b><Font Color='Blue'>" + data.laid + ": </b>" + data.message+"</Font><br>";
    $("#private_messages_cliente").animate({ scrollTop: $("#private_messages_cliente").prop("scrollHeight") }, 500);
    $("#private_messages_cliente").html(htmlCurrent);
    document.getElementById('privado').volume=1;
    document.getElementById('privado').play();
  }  
}

function pintar(data){
  var htmlCurrent = $("#private_messages_cliente").html();
  htmlCurrent += "<b>" + data.from + ": </b>" + data.message+"<br>";
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
    msg.message = $("#message_cliente").val();
    $("#message_cliente").val("");
    pintar(msg);
    $("#message_cliente").focus();    
    socket.emit('msg', msg);
  }
}

function enviarDatos(){
  var datosCliente = new Array();
  if($("#nombre").val().length < 11){
    alert("Nombre demasiado corto");
  }else{
    datosCliente[0] = $("#nombre").val();
    if(valEmail($("#eMail").val())){
      datosCliente[1] = $("#eMail").val();
      datosCliente[2] = $("#telefono").val();
      datosCliente[3] = $("#empresa").val();
      datosCliente[4] = $("#descripcion").val();
      userName=$("#nombre").val();
      socket.emit("nuevoCliente", datosCliente);
      socket.emit('authData', {"userName" : userName});
      $("#formDatos").fadeOut();
      $("#main_container").fadeIn();
      mensajeInicial();
    }else{
      alert("Ingrese un mail válido");
      $("#eMail").focus();
    }
  }
}
    
function mensajeInicial(){
  var htmlCurrent = $("#private_messages_cliente").html();
  htmlCurrent += "Bienvenido al chat de soporte técnico de REDECOM COMUNICACIÓN TOTAL S.A. DE C.V. en breves momentos será atendido por un administrador, le pedimos de favor que no envíe ningún mensaje hasta que un administrador lo atienda.<br><br>";
  $("#private_messages_cliente").animate({ scrollTop: $("#private_messages_cliente").prop("scrollHeight") }, 500);
  $("#private_messages_cliente").html(htmlCurrent);
  $("#message_cliente").focus();
}

function fueradeServicio(mensaje){
  alert(mensaje);
  window.close();
}

try {
  socket = io.connect('http://localhost:8056');
  socket.on('authData', hndlAuthData);
  socket.on('msg', handleMessage);
  socket.on('fueraHorario', fueradeServicio);
} catch(e) {
  alert("El servidor esta en mantenimiento");
}