var socket = null;  
var userName = null;
var nombre = '';

function selectUserName(userName) {
  var selectUsers = document.getElementById("userList");
  selectUsers.value = userName;        
}
    
function hndlAuthData(data) {
  if(data.isAvailable == false) {
  alert("Nombre en uso elija otro...");
  location.reload(true);
  }
}
    
function ocultar() {
  $("#main_container").hide();
  $("#Usuario").focus();
  var enter=document.getElementById("message");
  enter.onkeyup=function(e)
  {
     if(e.keyCode==13)
     {
         sendMessage();
     }
  }
}

function enviarPass(){
  socket.emit("passContra", $("#Usuario").val(), $("#Contrasena").val());
}
    
function refreshUserList(data) {
  $("#message").focus();
  var selectUsers = document.getElementById("userList");
  selectUsers.options.length = 0;
  selectUsers.options[0] = new Option(" A Todos ", 0);
  var html = "<table><center><Font color='red'><b>Clientes Conectados</b></Font></center><br>";
  var html2 = "<table><center><Font color='red'><b>Administradores Conectados</b></Font></center><br>";
  for(var i = 0; i < data.length; i++) {
    if(data[i].userName.length <= 10){
        if(data[i].userName.indexOf("valor")){
          html2 += "<tr class='selectable'>";
          html2 += "<td onClick='selectUserName(\""+data[i].userName+"\")'>"+"<li style='color:green'> <Font Color='Black'>" +data[i].userName+"</Font></li>"+"</td>";
          html2 += "</tr>";
          selectUsers.options[(i+1)] = new Option(data[i].userName, data[i].userName);
        }else{

        }
      
    }else{
      if(data[i].userName.indexOf("valor")){
        html += "<tr class='selectable'>";
        html += "<td onClick='selectUserName(\""+data[i].userName+"\")'>"+"<li style='color:green'> <Font Color='Black'>" +data[i].userName+"</Font></li>"+"</td>";
        html += "</tr>";
        selectUsers.options[(i+1)] = new Option(data[i].userName, data[i].userName);
      }else{

      }
    }    
  }
  html += "</table>";
  html2 += "</table>";
  $("#users").html(html);
  $("#admins").html(html2);
}

function agregarDatos(datosCliente, actual){
  var htmlCurrent = $("#chat_screen").html();
  htmlCurrent += "<div id='subrayado'>"+actual+"<br> <b>Se ha conectado: </b>"+datosCliente[0]+"<br> <b>E-Mail: </b>"+datosCliente[1]+"<br> <b>Teléfono: </b>"+datosCliente[2]+"<br> <b>Empresa: </b>"+datosCliente[3]+"<br> <b>Comentario: </b>"+datosCliente[4]+"</div>";
  $("#chat_screen").html(htmlCurrent);
  $("#chat_screen").animate({ scrollTop: $("#chat_screen").prop("scrollHeight") }, 500);
  document.getElementById('nuevo').volume=1;
  document.getElementById('nuevo').play();
}
    
function handleMessage(data) {    
  if(data.type == "PUBLIC") {
  var htmlCurrent = $("#private_messages").html();
  htmlCurrent += "<b>" + data.from + ": </b>" + data.message+"<br>";
  $("#private_messages").animate({ scrollTop: $("#private_messages").prop("scrollHeight") }, 500);
  $("#private_messages").html(htmlCurrent);
  document.getElementById('publico').volume=1;
  document.getElementById('publico').play();
  } else {
    var htmlCurrent = $("#private_messages").html();
    htmlCurrent += "<b>" + data.from + ": </b>" + data.message+"<br>";
    $("#private_messages").animate({ scrollTop: $("#private_messages").prop("scrollHeight") }, 500);
    $("#private_messages").html(htmlCurrent);
    document.getElementById('privado').volume=1;
    document.getElementById('privado').play();
  }
}

function pintar(data){
  var htmlCurrent = $("#private_messages").html();
  htmlCurrent += "<b>" + data.from + ": </b>" + data.message+"<br>";
  $("#private_messages").animate({ scrollTop: $("#private_messages").prop("scrollHeight") }, 500);
  $("#private_messages").html(htmlCurrent);  
}
    
function sendMessage() {
  var msg = {};
    if($("#message").val()==""){

    }else{
      if($("#userList").val() != 0) {
       msg.type = "PRIVATE";
       msg.to = $("#userList").val();
      } else {    
       msg.type = "PUBLIC";
      }
      msg.from = userName;
      msg.message = $("#message").val();
      $("#message").val("");
      pintar(msg);      
      $("#message").focus();    
      socket.emit('msg', msg);
    }
}

function acceso(valor,name, nickName){
  if(valor){
    nombre = name;
    alert("Bienvenido "+ name);
    $("#formularioPrincipal").fadeOut();
    $("#main_container").fadeIn();
    userName = nickName;
    socket.emit('authData', {"userName" : nickName});
  }else{
    alert("Usuario y/o Contraseña Incorrecta");
    location.reload(true);
  }
}

function atender(){
  if($("#userList").val()==0){
    alert("Seleccione un cliente para poder atenderlo");
  }else{
    window.open("chaAtencion.html?Destino="+encodeURI($("#userList").val())+"&De="+nombre+"&Admin="+userName , "" , "width=600,height=400,scrollbars=NO,resizable=NO");
  }
  
}
   
try {
  socket = io.connect('http://localhost:8056');
  socket.on('authData', hndlAuthData);
  socket.on('userList', refreshUserList);
  socket.on('msg', handleMessage);
  socket.on("recibeLogin", acceso);
  socket.on("datosDesdeServidor", agregarDatos);
} catch(e) {
  alert("El servidor no se ha iniciado");
}