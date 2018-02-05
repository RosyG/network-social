//login, la var provider provera el servicio para logear.
var provider = new firebase.auth.GoogleAuthProvider();
//Se llama al botón login para darle el evento click.
$('#login').click(serviceGoogle);//Logea los datos que introduzca el usuario.
//Guardando datos en Firebase cuando se da click en Guardar.
$('#guardar').click(saveText);//Guarda en Firebase las nuevas actualizaciones.

$('#myProfile').click(showProfile);//Muestra el perfil del usuario.

$('#out').click(showLogin);//Muestra el login.

$('.backPrincipal').click(showPrincipal);//Muestra la página principal.

$('#notification').click(showNotifications);//Muestra las notificaciones recientes.


function serviceGoogle () {
  firebase.auth()//Mandando a llamar a Firebase.
  .signInWithPopup(provider)//Ventana popup para logearse con la var provider (con google).
  .then(function(result) {
  //En este momento el us ya accedio.
  showPrincipal ();//Solo se muestra la ventanaprincipal si el us se loguea.

  $('#welcome-user').text('Bienvenid@ ' + result.user.displayName);//Añadiendo nombre de usuario para concatenar.
  saveUs (result.user);//Guada la información del usuario de manera automatica.
  paintProfile (result.user);//Pinta los datos del usuario en su perfil.
  //saveData (result.user);
  //paintTextPublication (textPublication);//Ejecutando la función que pintará las publicationes guardadas en Firebase.
  });
};

//Función que guarda automaticamente.
function saveUs(user) {
  var InfUser = {
    uid:user.uid,
    name:user.displayName,
    email:user.email,
    photo:user.photoURL,
    sexo: 'MF'
  }
  console.log(InfUser);
  firebase.database().ref('usLogged/' + user.uid)//Se guarda en la rama que tiene una key igual al identificador unico UID del usuario.
    .set(InfUser);//set modifica a la llave especificada por el uid, push() solo agrega de nuevo.
}

//Función que pinya la información del usuario.
function paintProfile (user) {
  var imgUser = user.photoURL;//Variable que contine toda la inf del usuario.
  var nameUser = user.displayName;
  var email = user.email;
  var uid= user.uid;
  $('.bg-perfil').append("<img id='img-perfil'  class = 'img-us' src = '"+imgUser+"' />");
  $('#name').text(nameUser);
  $('#email').text(email);
}

//Función que guarda datos al hacer click en guardar.
function saveText () {
  var textArea = $('#text-area').val();
  firebase.database().ref('publications')
    .push(textArea)//Añadiendo la publicación en la rama 'publications'.
  dataPublications.push(textArea);//Guardando la publicación en la data local.
  $('#notification').click(paintTextPublication (textArea));//Ejecutando la función que pintará las publicationes guardadas en Firebase.
  cleanText ();
}

//Función que limpia el campo del text área.
function cleanText () {
  $('#text-area').val(' ');//limpiando el campo del text área.
}
/*
//Función que lee la base de datos que alguien más inicia sesión AUTOMÁTICO.
firebase.database().ref('usuarios')
//Cuando alguien agregue algo en la rama usuarios, se ejecutará la función anónima.
.on('child_added', function(s){//s contiene los datos.
  var user = s.val();//Se guardan los datos en una variable.
  $('#root').append("<img src='"+user.photo+"'>");//De los datos se toman los datos del usuario que añadio su información.
})
*/
///--------------------------publicación de las actividades del usuario.
function paintTextPublication (text) {
  //Función que publica en la zona de las publicaciones de los usuarios.
  var database1 = firebase.database().ref("publications").once("value").then(function(snapshot){
    var obj = snapshot.val()//Se obtiene el valor del objeto snapshot, el que contiene las keys con sus valores, los valores son las publicaciones que todos los usuarios han escrito, ie, las nuevas noticias.
    console.log('a borrar');
      $('#publications').empty();//Borra las actualizaciones que ya fueron pintadas para que no se sobre escriba y existan repeticiones.
    for (var key in obj) {
      createElemen (obj[key]);//Mandando a pintar cada elemento que contiene la sección de las publicaciones.
      console.log(obj[key]);
    }
  });
}//Fin de paintTextPublication.

function createElemen (texto) {
  var containerText = document.createElement('div');
  var textUs = document.createElement('label');

  containerText.append(textUs);
  textUs.innerHTML = texto;
  containerText.append(textUs);

  $('#publications').prepend(containerText);
}

/*function saveData (user) {
  var objUser = {
    uid:user.uid,
    name:user.displayName,
    email:user.email,
    photo:user.photoURL,
  }
  dataUsers.push(objUser);
  console.log(dataUsers);
  console.log(objUser);
  console.log('data impresa');
}
*/
function showProfile () {
  $('#welcome').hide();//Ocultado la ventana de logear.
  $('#container-profile').show('slow');//Mostrando la pantalla del perfil del us.
}

function showLogin () {
  $('#welcome').hide();//Ocultado la ventana de principal.
  $('#container-profile').hide();//Mostrando la pantalla del perfil del us.
  $('#container-notifications').hide();//Oculta la ventana de notificaciones.
  $('.login').show('slow');//Muestra la ventana de logear.
}

function showPrincipal () {
  $('#container-profile').hide();//Mostrando la pantalla del perfil del us.
  $('.login').hide();//Ocultado la ventana de logear.
  $('#container-notifications').hide();//Oculta la ventana de notificaciones.
  $('#welcome').show('slow');//Muestra la página principal.
}

function showNotifications () {
  $('#welcome').hide();//Ocultado la ventana de principal.
  $('#container-profile').hide();//Mostrando la pantalla del perfil del us.
  $('#container-notifications').show('slow');//Muestra la ventana de notificaciones.
}
