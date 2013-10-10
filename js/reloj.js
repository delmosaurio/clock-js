/*!
 * Taller Web - Dirección de Tecnologia de la Provincia de Buenos Aires
 * 
 */
!function($, window, Math, undefined) {
  "use strict";

  if (window.enDesarrollo === true) {
    calcularPosicionesNumeros(window.radioGlobal);
  }

  $(function(){

    setInterval( function() {
      actualizarRelog(); 
    }, 500);

  });

  //
  // funciones privadas

  function actualizarRelog() {
    var $agujas = $('#agujas');

    var radio = window.radioGlobal;
    var radioAdentro = 5;
    var radioAfuera_s = parseFloat($agujas.width()/2) - 20;
    var radioAfuera_m = parseFloat($agujas.width()/2) - 40;
    var radioAfuera_h = parseFloat($agujas.width()/2) - 50;

    var tiempoActual = new Date();
    var horas = tiempoActual.getHours();
    var minutos = tiempoActual.getMinutes();
    var segundos = tiempoActual.getSeconds();

    // HORAS
    var h_desdeX = Math.round(radioAdentro*Math.cos(obtenerAnguloPara(horas, minutos, 'horas')));
    var h_hastaX = Math.round(radioAfuera_h*Math.cos(obtenerAnguloPara(horas, minutos, 'horas')));

    var h_desdeY = Math.round(radioAdentro*Math.sin(obtenerAnguloPara(horas, minutos, 'horas')));
    var h_hastaY = Math.round(radioAfuera_h*Math.sin(obtenerAnguloPara(horas, minutos, 'horas')));

    // MINUTOS
    var m_desdeX = Math.round(radioAdentro*Math.cos(obtenerAnguloPara(minutos, segundos, 'minutos')));
    var m_hastaX = Math.round(radioAfuera_m*Math.cos(obtenerAnguloPara(minutos, segundos, 'minutos')));

    var m_desdeY = Math.round(radioAdentro*Math.sin(obtenerAnguloPara(minutos, segundos, 'minutos')));
    var m_hastaY = Math.round(radioAfuera_m*Math.sin(obtenerAnguloPara(minutos, segundos, 'minutos')));

    // SEGUNDOS
    var s_desdeX = Math.round(radioAdentro*Math.cos(obtenerAnguloPara(segundos, 0, 'segundos')));
    var s_hastaX = Math.round(radioAfuera_s*Math.cos(obtenerAnguloPara(segundos, 0, 'segundos')));

    var s_desdeY = Math.round(radioAdentro*Math.sin(obtenerAnguloPara(segundos, 0, 'segundos')));
    var s_hastaY = Math.round(radioAfuera_s*Math.sin(obtenerAnguloPara(segundos, 0, 'segundos')));


    // limpia lo dibujado actualmente
    $agujas.clearCanvas();

    // dubuja la aguja de segundos
    $agujas.drawLine({
        strokeStyle: "#ff9500",
        strokeWidth: 1,
        x1: x_desdeCentro(radio, s_desdeX), y1: y_dendeCentro(radio, s_desdeY),
        x2: x_desdeCentro(radio, s_hastaX), y2: y_dendeCentro(radio, s_hastaY)
      });

    // dubuja la aguda de minutos
    $agujas.drawLine({
        strokeStyle: "#D6D6D6",
        strokeWidth: 2,
        x1: x_desdeCentro(radio, m_desdeX), y1: y_dendeCentro(radio, m_desdeY),
        x2: x_desdeCentro(radio, m_hastaX), y2: y_dendeCentro(radio, m_hastaY)
      });

    // dubuja la aguda de horas
    $agujas.drawLine({
        strokeStyle: "#E6E6E6",
        strokeWidth: 5,
        x1: x_desdeCentro(radio, h_desdeX), y1: y_dendeCentro(radio, h_desdeY),
        x2: x_desdeCentro(radio, h_hastaX), y2: y_dendeCentro(radio, h_hastaY)
      });

  }

  function obtenerAnguloPara(valor1, valor2, type) {
    var A360 = parseFloat(2*Math.PI);
    var A90 = parseFloat(Math.PI/2);

    if (valor1 == 0) return -A90;

    
    var sh = A360/12;
    var sm = A360/60;
    var ss = A360/60;

    switch(type) {
      case 'horas':
        return (parseFloat(sh*valor1)-A90) + sh*(valor2/60);

      case 'minutos': 
        return parseFloat(ss*valor1)-A90;

      case 'segundos': 
        return parseFloat(ss*valor1)-A90;
    }

    return undefined;
  }

  function x_desdeCentro(radio, x) {
    var cpx = parseFloat(radio / 2);

    return radio + x;
  }
  
  function y_dendeCentro(radio, y) {
    var cpy = parseFloat(radio / 2);

    return radio + y;
  }

  /*
   * Convierte `angulo` a su valor en Radianes
   *
   * @param {Number} angulo
   */
  function convertirARadianes(angulo) {
    return (parseFloat(angulo)*Math.PI) / 180;
  }

  /*
   * Convierte `radian` a su valor en Grados
   *
   * @param {Number} radian
   */
  function convertirAGrados(radian) {
    return (parseFloat(radian)*180)/Math.PI;
  }

  //
  // funciones para desarrollo

  // Calcula y muestra en consola las posiciones 
  // de los numeros del reloj para un radio dado
  function calcularPosicionesNumeros(radio) {

    // definicion del angulo 360 en Radianes
    var A360 = parseFloat(2*Math.PI);

    // definicion de los indices de los numeros
    // partiendo de la base de que el 3 es 0°
    var indices = [ '3', '2', '1', '12', '11', '10', '9', '8', '7', '6', '5', '4' ]
      , alias = {  '3': 'tres'
                 , '2': 'dos'
                 , '1': 'uno'
                 , '12': 'doce'
                 , '11': 'once'
                 , '10': 'diez'
                 , '9': 'nueve'
                 , '8': 'ocho'
                 , '7': 'siete'
                 , '6': 'seis'
                 , '5': 'cinco'
                 , '4' : 'cuatro'};

    var dif = parseFloat(A360/indices.length);

    for (var i=0; i < indices.length; i++) {
      
      var angulo = (dif*i);
      var y = Math.round(radio*Math.sin(angulo));
      var x = Math.round(radio*Math.cos(angulo));

      // invertimos la Y
      y = y * -1;

      console.log({
        numero: indices[i],
        angulo: angulo,
        x: x,
        y: y
      });

      $('#' + alias[ indices[i] ]).css({ 
        'top': y + radio,
        'left': x + radio
      });;

    }

  }

}(jQuery, window, Math);