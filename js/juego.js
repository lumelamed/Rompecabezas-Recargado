var Juego = {
  anchoPiezas: 0,
  altoPiezas: 0,
  anchoDeRompecabezas: 0,
  altoDeRompecabezas: 0,
  cantidadDePiezasPorLado: 0,
  imagen: "",
  movimientosTotales: 0,
  contadorDeMovimientos: 0,
  piezas: [],
  grilla: [],
  filaPosicionVacia: 0,
  columnaPosicionVacia: 0,
  crearGrilla: function(){
      var piezas = -1;
        for (var i = 0; i < this.cantidadDePiezasPorLado; i++) {
          this.grilla.push([]);
          for (var j = 0; j < this.cantidadDePiezasPorLado; j++) {
            this.grilla[i][j]=(piezas+=1);
          }
        }
  },

  configurarCanvas: function(){
      var canvas = document.getElementById("canvas");
      var contexto = canvas.getContext("2d");

      contexto.drawImage(this.imagen, 0, 0, this.anchoDeRompecabezas, this.altoDeRompecabezas);
      this.dibujarRectangulo(this.anchoDeRompecabezas-this.anchoPiezas,this.anchoDeRompecabezas-this.altoPiezas,this.anchoPiezas, this.altoPiezas);
  },

  dibujarRectangulo: function(x,y,ancho,alto){
    contexto.beginPath();
    contexto.rect(x,y,ancho,alto);
    contexto.fillStyle = '#f4ece4';
    contexto.fill();
    contexto.lineWidth = 0;
    contexto.strokeStyle = '#f4ece4';
    contexto.stroke();
  },

  construirPiezas: function(){
      for (var i = 0; i < this.cantidadDePiezasPorLado; i++) {
        for (var j = 0; j < this.cantidadDePiezasPorLado; j++) {
          this.piezas.push(new piezas(i,j,i,j));
        }
      }
  },

  //se carga la imagen del rompecabezas
  cargarImagen: function (e) {
      //se calcula el ancho y el alto de las piezas de acuerdo al tamaño del canvas (600).
      var canvasSize= 600;
      this.anchoPiezas = Math.floor(canvasSize / this.cantidadDePiezasPorLado);
      this.altoPiezas = Math.floor(canvasSize / this.cantidadDePiezasPorLado);
      //se calcula el ancho y alto del rompecabezas de acuerdo al ancho y alto de cada pieza y la cantidad de piezas por lado
      this.anchoDeRompecabezas = canvasSize;
      this.altoDeRompecabezas = canvasSize;
      this.configurarCanvas();
    },

  //funcion que carga la imagen
  iniciarImagen: function (callback) {
      this.imagen = new Image();
      var self = this;
      //se espera a que se termine de cargar la imagen antes de ejecutar la siguiente funcion
      this.imagen.addEventListener('load', function () {
        self.cargarImagen.call(self);
        callback();
      }, false);
      this.imagen.src = "images/imagen.jpg";
    },

  //una vez elegido el nivel, se inicia el juego
  iniciar: function (cantMovimientos) {
      this.movimientosTotales = cantMovimientos;
      this.contadorDeMovimientos = cantMovimientos;
      this.piezas = [];
      this.grilla = [];
      document.getElementById("contadorDeMovimientos").innerHTML = this.contadorDeMovimientos;
      this.cantidadDePiezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
      //se guarda el contexto en una variable para que no se pierda cuando se ejecute la funcion iniciarImagen (que va a tener otro contexto interno)
      var self = this;
      this.crearGrilla();
      //se instancian los atributos que indican la posicion de las fila y columna vacias de acuerdo a la cantidad de piezas por lado para que sea la ultima del tablero
      this.filaPosicionVacia = this.cantidadDePiezasPorLado - 1;
      this.columnaPosicionVacia = this.cantidadDePiezasPorLado - 1;
      //se espera a que este iniciada la imagen antes de construir las piezas y empezar a mezclarlas
      this.iniciarImagen(function () {
        self.construirPiezas();
        //la cantidad de veces que se mezcla es en funcion a la cantidad de piezas por lado que tenemos, para que sea lo mas razonable posible.
        var cantidadDeMezclas = Math.max(Math.pow(self.cantidadDePiezasPorLado, 3), 100);
        self.mezclarPiezas(cantidadDeMezclas);
      });
    }
};

Juego.capturarTeclasYMover = function() {
  document.body.onkeydown = (function(evento) {
    if(evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37){
      Juego.moverEnDireccion(evento.which);
      Juego.contadorDeMovimientos--;
      $("#contadorDeMovimientos").html(Juego.contadorDeMovimientos);
      Juego.gano();
      evento.preventDefault();
    }
  })
};

Juego.moverConMouse = function() {
  $("#canvas").click(function(e){
    //parte del código fue tomada de uno de los ejercicios de prueba :)
    var rect = canvas.getBoundingClientRect(); //funcion que obtiene el tamaño de un elemento y su posicion
    var xClick = e.clientX - rect.left;
    var yClick = e.clientY - rect.top;
    console.log(xClick);
    console.log(yClick);
    var direc = Juego.chequearSiEsAdyacenteYDirec(xClick, yClick, direc);
    if(direc != 0){
      Juego.moverEnDireccion(direc);
      Juego.contadorDeMovimientos--;
      $("#contadorDeMovimientos").html(Juego.contadorDeMovimientos);
      Juego.gano();
    }
  });
};

//chequea si la pieza clickeada es adyacente a la pieza vacía, y si lo es, indica la posición a la que se debe mover
Juego.chequearSiEsAdyacenteYDirec = function(x, y, direc) {
  var xPiezaVacia = this.filaPosicionVacia * this.anchoPiezas;
  var yPiezaVacia = this.columnaPosicionVacia * this.altoPiezas;
  var xFinPiezaVacia = xPiezaVacia+this.anchoPiezas;
  var yFinPiezaVacia = yPiezaVacia+this.altoPiezas;

  if(x+this.anchoPiezas > xPiezaVacia && x+this.anchoPiezas < xFinPiezaVacia){
    direc = 39;
    return direc;
  }
  if(x-this.anchoPiezas > xPiezaVacia && x-this.anchoPiezas < xFinPiezaVacia){
    direc = 37;
    return direc;
  }
  if(y+this.altoPiezas > yPiezaVacia && y+this.altoPiezas < yFinPiezaVacia){
    direc = 40;
    return direc;
  }
  if(y-this.altoPiezas > yPiezaVacia && y-this.altoPiezas < yFinPiezaVacia){
    direc = 38;
    return direc;
  }
  direc = 0;
  return direc;
};

Juego.gano = function() {
  var gano = this.chequearSiGano(this.grilla, grillaOrdenada());
  if(gano && Juego.contadorDeMovimientos > 0){
    setTimeout(function(){
      Juego.mostrarCartelGanador();
    },500);
  }
  if(Juego.contadorDeMovimientos <= 0){
    Juego.mostrarCartelPerdedor();
  }
};

// Movimiento de fichas, en este caso la que se mueve es la blanca intercambiando su posición con otro elemento
Juego.moverEnDireccion = function(direccion) {

  var nuevaFilaPiezaVacia;
  var nuevaColumnaPiezaVacia;

  // Intercambia pieza blanca con la pieza que está a su der
  if(direccion == 40){
    nuevaFilaPiezaVacia = this.filaPosicionVacia;
    nuevaColumnaPiezaVacia = this.columnaPosicionVacia-1;
  }
  // Intercambia pieza blanca con la pieza que está a su izq
  else if (direccion == 38) {
    nuevaFilaPiezaVacia = this.filaPosicionVacia;
    nuevaColumnaPiezaVacia = this.columnaPosicionVacia+1;
  }
  // Intercambia pieza blanca con la pieza que está abajo suyo
  else if (direccion == 39) {
    nuevaFilaPiezaVacia = this.filaPosicionVacia-1;
    nuevaColumnaPiezaVacia = this.columnaPosicionVacia;
  }
  // Intercambia pieza blanca con la pieza que está arriba suyo
  else if (direccion == 37) {
    nuevaFilaPiezaVacia = this.filaPosicionVacia+1;
    nuevaColumnaPiezaVacia = this.columnaPosicionVacia;
  }

  this.mover(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
};

Juego.mover = function (nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia) {
  // Se chequea si la nueva posición es válida, si lo es, se intercambia
  if (this.posicionValida(this.filaPosicionVacia,  this.columnaPosicionVacia, nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)){
    this.intercambiarPosiciones(this.filaPosicionVacia, this.columnaPosicionVacia,
    nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    this.actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
  }
};

// Para chequear si la posicón está dentro de la grilla.
// función corregida en la devolución del TP 3 :) y refactorizada
Juego.posicionValida = function(filaVieja, columnaVieja, filaNueva, columnaNueva) {
   return ((filaNueva>=0 && filaNueva<=(this.cantidadDePiezasPorLado-1)) && (columnaNueva>=0 && columnaNueva<=(this.cantidadDePiezasPorLado-1)) && !this.filaYColumnaSonIguales(filaVieja,columnaVieja,filaNueva,columnaNueva));
};

Juego.filaYColumnaSonIguales= function(filaVieja, columnaVieja, filaNueva, columnaNueva) {
  return (filaVieja == filaNueva && columnaVieja == columnaNueva);
};

Juego.intercambiarPosiciones = function(fila1, columna1, fila2, columna2) {
            //intercambio en grilla
  var auxiliar = [[]];
  auxiliar = this.grilla[fila1][columna1];
  this.grilla[fila1][columna1] = this.grilla[fila2][columna2];
  this.grilla[fila2][columna2] = auxiliar;

            //intercambio Canvas
  //se actualizan los valores de x e y de la pieza que se mueve
  var aux;
  aux = this.piezas[(this.grilla[fila1][columna1])].xActual;
  this.piezas[(this.grilla[fila1][columna1])].xActual = this.piezas[(this.grilla[fila2][columna2])].xActual;
  this.piezas[(this.grilla[fila2][columna2])].xActual = aux;
  var aux2;
  aux2 = this.piezas[(this.grilla[fila1][columna1])].yActual;
  this.piezas[(this.grilla[fila1][columna1])].yActual = this.piezas[(this.grilla[fila2][columna2])].yActual;
  this.piezas[(this.grilla[fila2][columna2])].yActual = aux2;

  //se dibujan la pieza y la vacía en su nuevo lugar
  var laPieza1 = (this.grilla[fila1][columna1]);
  contexto.drawImage(canvas, (this.piezas[laPieza1].xOriginal)*this.anchoPiezas, (this.piezas[laPieza1].yOriginal)*this.altoPiezas, this.anchoPiezas, this.altoPiezas, (this.piezas[laPieza1].xActual)*this.anchoPiezas, (this.piezas[laPieza1].yActual)*this.altoPiezas, this.anchoPiezas, this.altoPiezas);
  var laPieza2 = (this.grilla[fila2][columna2]);
  this.dibujarRectangulo(this.piezas[laPieza2].xActual*this.anchoPiezas, this.piezas[laPieza2].yActual*this.altoPiezas, this.anchoPiezas, this.altoPiezas);

  //los valores originales de las piezas tambien se actualizan para el proximo cambio
  aux = this.piezas[(this.grilla[fila1][columna1])].xOriginal;
  this.piezas[(this.grilla[fila1][columna1])].xOriginal = this.piezas[(this.grilla[fila2][columna2])].xOriginal;
  this.piezas[(this.grilla[fila2][columna2])].xOriginal = aux;
  aux2 = this.piezas[(this.grilla[fila1][columna1])].yOriginal;
  this.piezas[(this.grilla[fila1][columna1])].yOriginal = this.piezas[(this.grilla[fila2][columna2])].yOriginal;
  this.piezas[(this.grilla[fila2][columna2])].yOriginal = aux2;
};

// Actualiza la posición de la pieza vacía
Juego.actualizarPosicionVacia = function(nuevaFila,nuevaColumna) {
  this.filaPosicionVacia=nuevaFila;
  this.columnaPosicionVacia=nuevaColumna;
};

// Esta función va a chequear si el Rompecabezas está en la posición ganadora
// función corregida en la devolución del TP 3 :) y refactorizada
Juego.chequearSiGano = function(grilla1, grilla2) {
  for (var i = 0; i < grilla1.length; i++){
    for (var j = 0; j < grilla1.length; j++){
      if (grilla1[i][j] !== grilla2[i][j]) {
        return false;
      }
    }
  }
  return true;
};

Juego.mostrarCartelGanador = function() {
  contexto.drawImage(this.imagen, 0, 0, this.anchoDeRompecabezas, this.altoDeRompecabezas);
  swal("Ganaste!", "Felicitaciones, completaste el rompecabezas :)", "success");
};

Juego.mostrarCartelPerdedor = function() {
  swal("Perdiste :(" ,"Volvé a intentarlo!", "error");
};

Juego.mezclarPiezas = function(veces) {
  if(veces<=0){return;}
  var direcciones = [40, 38, 39, 37];
  var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
  this.moverEnDireccion(direccion);

  setTimeout(function(){
    Juego.mezclarPiezas(veces-1);
  },30);
};

Juego.calcularMovimientos = function(nivel) {
  var piezas = document.getElementById("cantidadPiezasPorLado").value;
  if(nivel == "facil"){
    return piezas * 50;
  }
  if(nivel == "intermedio"){
    return piezas * 30;
  }
  if(nivel == "dificil"){
    return piezas * 15;
  }
};

var piezas = function(xActual, yActual, xOriginal, yOriginal){
  this.xActual = xActual;
  this.yActual = yActual;
  this.xOriginal = xOriginal;
  this.yOriginal = yOriginal;
};

var grillaOrdenada = function(){
  var laGrillaOrdenada = [];
  var piezas = -1;
    for (var i = 0; i < Juego.cantidadDePiezasPorLado; i++) {
      laGrillaOrdenada.push([]);
      for (var j = 0; j < Juego.cantidadDePiezasPorLado; j++) {
        laGrillaOrdenada[i][j]=(piezas+=1);
      }
    }
    return laGrillaOrdenada;
};

var canvas = document.getElementById("canvas");
var contexto = canvas.getContext("2d");

var nivel;
var movimientos;

$("#contadorDeMovimientos").hide();
$("input[name=nivel]:radio").click(function(){
  nivel = $("input:checked").val();
  movimientos = Juego.calcularMovimientos(nivel);
  $("#contadorDeMovimientos").html(movimientos);
  $("#contadorDeMovimientos").show();
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  Juego.iniciar(movimientos);
  Juego.capturarTeclasYMover();
  Juego.moverConMouse();
});
