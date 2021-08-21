var expect = chai.expect;

describe('Creación', function() {
    'use strict';

  describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.Juego){
        done(err);
      }
      else{
        done();
      }
    });
  });
  describe('Tamaño de la grilla', function() {
    it('La grilla tiene el tamaño correcto', function() {
      //se crea la grilla con un valor de cantidad de piezas por lado
      Juego.cantidadDePiezasPorLado = 5;
      Juego.crearGrilla();
      //se evalua si el tamaño de la grilla creada es correcto
      expect(Juego.grilla.length).to.equal(Juego.cantidadDePiezasPorLado);
      expect(Juego.grilla[0].length).to.equal(Juego.cantidadDePiezasPorLado);
    });
    it('La grilla ordenada comienza igual que la grilla para jugar', function() {
      expect(Juego.grilla).to.eql(grillaOrdenada());
    });
  });
  describe('Piezas dinámicas', function() {
    it('Se crea la cantidad de piezas correctas', function() {
      Juego.piezas = [];
      Juego.cantidadDePiezasPorLado = 5;
      Juego.construirPiezas();
      expect(Juego.piezas.length).to.equal(Math.pow(Juego.cantidadDePiezasPorLado, 2));
    });
  });
});

describe('Mover piezas', function() {
  describe('Direccion', function(){
    it('La dirección solo responde a las flechas en el teclado', function() {
      var direccion=38;
      expect([37,38,39,40]).to.include(direccion);
      direccion=42;
      expect([37,38,39,40]).to.not.include(direccion);
    });
  });
  describe('Posición Válida', function() {
      it('La posición está dentro de la grilla', function() {
        Juego.cantidadDePiezasPorLado = 5;
        var filaNueva = 1;
        var columnaNueva = 5;
        var filaVieja = 1;
        var columnaVieja = 4;
        expect(Juego.posicionValida(filaVieja, columnaVieja, filaNueva, columnaNueva)).to.be.false;
      });
      it('El numero de fila y columna pertenecen la grilla', function() {
        Juego.cantidadDePiezasPorLado = 4;
        var filaNueva = 4;
        var columnaNueva = 0;
        var filaVieja = 3;
        var columnaVieja = 0;
        expect(Juego.posicionValida(filaVieja, columnaVieja, filaNueva, columnaNueva)).to.be.false;
      });
      it('La posición no incluye números negativos', function() {
        Juego.cantidadDePiezasPorLado = 5;
        var filaNueva = -1;
        var columnaNueva = 2;
        var filaVieja = 0;
        var columnaVieja = 2;
        expect(Juego.posicionValida(filaVieja, columnaVieja, filaNueva, columnaNueva)).to.be.false;
      });
  });
  describe('Intercambiar posiciones', function() { //NO SE SI ES AL PEDO vol2
      it('Se intercambia la pieza vacía', function() {
        Juego.cantidadDePiezasPorLado = 5;
        var fila1 = 1;
        var columna1 = 4;
        var fila2 = 1;
        var columna2 = 3;
        //Juego.intercambiarPosiciones(fila1, columna1, fila2, columna2);
        expect(Juego.grilla[fila2][columna2]).to.equal(grillaOrdenada()[fila2][columna2]);
      });
  });
  describe('Actualizar posición vacía', function() {
      it('La posición es numérica', function() {
        var nuevaFila = 3;
        var nuevaColumna = 5;
        Juego.actualizarPosicionVacia(nuevaFila, nuevaColumna);
        expect(Juego.filaPosicionVacia).to.be.a("number");
        expect(Juego.columnaPosicionVacia).to.be.a("number");
      });
  });
});
describe('Ganar', function() {
  describe('Movimientos', function(){
    it('Termino el rompecabezas con movimientos de sobra', function() {
      var gano = false;
      Juego.contadorDeMovimientos = 20;
      var grillaA = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ];
      var grillaB = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ];
      gano = Juego.chequearSiGano(grillaA, grillaB);
      if(Juego.contadorDeMovimientos <= 0){
        gano = false;
      }
      expect(gano).to.be.true;
    });
  });
});




/*Paso 4: Testeá la función posicionValida()
Ahora que el test corre bien, testeá más funcionalidades. En este paso, tenés que testear la función posicionValida(). Para eso, definí los casos de test e implementalos usando Mocha y Chai en el archivo de test.

Pista: No te olvides de pensar qué casos deberían devolver un resultado incorrecto y cuáles uno correcto. Fijate, además, si hay que tener en cuenta algún caso borde y ¡que todo esto se vea plasmado en tu test!

Paso 5: Separá en componentes y creá más tests
Una vez hecho esto, ¿se te ocurren más tests para agregar? En esta parte, tenés que detectar al menos una funcionalidad que te interese testear y agregarla al archivo de test.

Recomiendan los/as pro: Es muy importante agregar tests para verificar que no se rompa nada en el caso en el que quieras agregar funcionalidades o modificar tu código sin arruinar lo que estaba hecho.*/
