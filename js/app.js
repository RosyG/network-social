//login, la var provider provera el servicio para logear.
var provider = new firebase.auth.GoogleAuthProvider();


$( document ).ready(function(){
  showLogin ();//SE muesta el login.

  $(".button-collapse").sideNav();

  //Se llama al botón login para darle el evento click.
  $('#login').click(serviceGoogle);//Logea los datos que introduzca el usuario.
  //Guardando datos en Firebase cuando se da click en Guardar.
  $('#guardar').click(saveText);//Guarda en Firebase las nuevas actualizaciones.

  $('.backPrincipal').click(showPrincipal);//Muestra la página principal.

  $('.notification').click(paintTextPublication);//Muestra las notificaciones recientes.

  /*Ejecutando el modal al dar click en las imagenes, para mostrar más información sobre los restaurantes*/
  $("#modal1").modal();

  //Función para cerrar sesión
  $(".out").click(function(e) {
    e.preventDefault();
  console.log("q out");
    showLogin ();//Oculta principal.
    firebase
      .auth()
      .signOut()
      .then()//Función que muestra la ventana login y oculta las demás vistas para el usuario
      .catch(function(error) {
        // An error happened.
      });
  });

})

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
  }
  console.log(InfUser);
  firebase.database().ref('usLogged/' + user.uid)//Se guarda en la rama que tiene una key igual al identificador unico UID del usuario.
    .set(InfUser);//set modifica a la llave especificada por el uid, push() solo agrega de nuevo.
}

//Función que pinya la información del usuario.
function paintProfile (user) {
  $('.bg-perfil').empty();//Borra los hijos en el div bg-perfil que ya fueron pintadaos para que no se sobre escriba y existan repeticiones.
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
//  $('#notification').click(paintTextPublication (textArea));//Ejecutando la función que pintará las publicationes guardadas en Firebase.
  cleanText ();
}

//Función que limpia el campo del text área.
function cleanText () {
  $('#text-area').val(' ');//limpiando el campo del text área.
}

///----------publicación de las actividades del usuario.----------
function paintTextPublication (text) {
  showNotifications ();//Función que muestra la sección que contiene las nuevas publicaciones.
  //Función que publica en la zona de las publicaciones de los usuarios.
  var database1 = firebase.database().ref("publications").once("value").then(function(snapshot){
  var obj = snapshot.val()//Se obtiene el valor del objeto snapshot, el que contiene las keys con sus valores, los valores son las publicaciones que todos los usuarios han escrito, ie, las nuevas noticias.
  $('#publications').empty();//Borra las actualizaciones que ya fueron pintadas para que no se sobre escriba y existan repeticiones.

  for (var key in obj) {
      createElemen (obj[key]);//Mandando a pintar cada elemento que contiene la sección de las publicaciones.
      console.log(obj[key]);
    }
  });

}//Fin de paintTextPublication.

//Función que crea elementos por medio de DOM para poder llenarlos del contenido que se extraiga de Firebase.
function createElemen (texto) {
  var $containerText = $('<div />',
    {'class':'new-us-write'});
  var nameWrite = document.createElement('label');//Nombre del us que escribe.
  var textUs = document.createElement('label');
/********************
  //us que escribe
  nameWrite.innerHTML = 'HI';
  containerText.append(nameWrite);
  //    $('.bg-perfil').append("<img id='img-perfil'  class = 'img-us' src = '"+imgUser+"' />");

//*******************
//Nuev publicación DEL USUARIO Q SE LOGEA.
var nameWrite = document.createElement('label');//Nombre del us que escribe.
nameWrite.innerHTML = 'HI';
//    $('.bg-perfil').append("<img id='img-perfil'  class = 'img-us' src = '"+imgUser+"' />");

$('.new-us-write').append(nameWrite)
//********************
*/

  textUs.innerHTML = texto;

  $containerText.append(textUs);

  $('#publications').prepend($containerText);
}

//-----Funciones que muestran y ocultan las ventanas al usuario.-----

function showLogin () {
  $('.login').show('slow');//Muestra la ventana de logear.
  $('#welcome').hide();//Ocultado la ventana de principal.
  $('#container-profile').hide();//Mostrando la pantalla del perfil del us.
  $('#container-notifications').hide();//Oculta la ventana de notificaciones.
}

function showPrincipal () {
  $('#welcome').show('slow');//Muestra la página principal.
  $('#container-profile').hide();//Mostrando la pantalla del perfil del us.
  $('.login').hide();//Ocultado la ventana de logear.
  $('#container-notifications').hide();//Oculta la ventana de notificaciones.
}

function showNotifications () {
  $('#container-notifications').show('slow');//Muestra la ventana de notificaciones.
  $('#welcome').hide();//Ocultado la ventana de principal.
  $('#container-profile').hide();//Mostrando la pantalla del perfil del us.
}
