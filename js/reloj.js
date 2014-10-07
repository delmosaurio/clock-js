/*!
 * 
 * Reloj Analógico - Campamento Digital
 *
 * Copyright (c) 2014 - Dirección de Tecnología Educativa
 * Licencia GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 */

(function($, window, undefined){
  'use strict';

  // Librería global de Matemática
  var Math = window.Math;

  $.fn.agujas = function(opciones){

    var opts = $.extend( {}, $.fn.agujas.defaults, opciones );

    var obtenerAnguloPara = function (valor1, valor2, type) {
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
    };

    var xDesdeCentro = function(radio, x) {
      var cpx = parseFloat(radio / 2);

      return radio + x;
    };
    
    var yDendeCentro = function(radio, y) {
      var cpy = parseFloat(radio / 2);

      return radio + y;
    };

    var actualizarAgujas = function(elem){
      var radio = parseFloat(elem.width()/2);
      var radioAdentro = 5;
      var radioAfuera_s = parseFloat(elem.width()/2) - opts.rellenoSegundos;
      var radioAfuera_m = parseFloat(elem.width()/2) - opts.rellenoMinutos;
      var radioAfuera_h = parseFloat(elem.width()/2) - opts.rellenoHoras;

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
      elem.clearCanvas();

      // dubuja la aguja de segundos
      elem.drawLine({
          strokeStyle: opts.colorSegundero,
          strokeWidth: 1,
          x1: xDesdeCentro(radio, s_desdeX), y1: yDendeCentro(radio, s_desdeY),
          x2: xDesdeCentro(radio, s_hastaX), y2: yDendeCentro(radio, s_hastaY)
        });

      // dubuja la aguda de minutos
      elem.drawLine({
          strokeStyle: opts.colorMinutero,
          strokeWidth: 2,
          x1: xDesdeCentro(radio, m_desdeX), y1: yDendeCentro(radio, m_desdeY),
          x2: xDesdeCentro(radio, m_hastaX), y2: yDendeCentro(radio, m_hastaY)
        });

      // dubuja la aguda de horas
      elem.drawLine({
          strokeStyle: opts.colorHorario,
          strokeWidth: 5,
          x1: xDesdeCentro(radio, h_desdeX), y1: yDendeCentro(radio, h_desdeY),
          x2: xDesdeCentro(radio, h_hastaX), y2: yDendeCentro(radio, h_hastaY)
        });
    };

    return this.each(function(){

      var elem  = $(this);
      
      setInterval( function() {
        actualizarAgujas(elem, 200);
      }, 500);

    });

  };

  $.fn.agujas.defaults = {
    rellenoSegundos: 20,
    rellenoMinutos: 40,
    rellenoHoras: 50,
    colorSegundero: '#000',
    colorMinutero: '#000',
    colorHorario: '#000'
  };

  $.fn.reloj = function(opciones){

    var setPosicionReloj = function(elem, pos){

      if (pos === undefined) {
        return false;
      }

      var posiciones = /^(top|middle|bottom)\s+(left|center|right)$/i;

      if (!posiciones.test(pos)) {
        return false;
      }

      var res = posiciones.exec(pos);
      var pos1 = res[1].toLowerCase();
      var pos2 = res[2].toLowerCase();
      
      // arriba, centro o abajo
      if (pos1 === 'top') {
        elem.css('top', 0);
      } else if (pos1 === 'middle') {
        elem.css('top', 'calc( 50% - ' + elem.height() / 2 + 'px)');
      } else {
        elem.css('bottom', 0);
      }

      // izquierda, medio o derecha
      if (pos2 === 'left') {
        elem.css('left', 0);
      } else if (pos2 === 'center') {
        elem.css('left', 'calc( 50% - ' + elem.width() / 2 + 'px)');
      } else {
        elem.css('right', 0);
      }

      return true;
    };

    var setPosicionHora = function(elem, h, radio){
      // definicion del angulo 360 en Radianes
      var A360 = parseFloat(2*Math.PI);

      var dif = parseFloat(A360/12);

      var angulo = (dif*h) - Math.PI / 2;
      var y = Math.round(radio*Math.sin(angulo));
      var x = Math.round(radio*Math.cos(angulo));

      elem.css({  'top': y + radio, 'left': x + radio });
    };

    var setPosicionMin = function(elem, h, m, radio){
      // definicion del angulo 360 en Radianes
      var A360 = parseFloat(2*Math.PI);

      var dif = parseFloat(A360/12);
      var mdif = parseFloat(A360/60);

      var angulo = ((dif*h) + (mdif*m)) - Math.PI / 2;
      var y = Math.round(radio*Math.sin(angulo));
      var x = Math.round(radio*Math.cos(angulo));

      elem.css({  'top': y + radio, 'left': x + radio });
    };

    // Extendemos las opciones por default
    var opts = $.extend( {}, $.fn.reloj.defaults, opciones );

    return this.each(function(){

      var elem  = $(this);

      // La posición de nuestro elemento será absoluta
      // debemos chequear que la posición del contenedor
      // sea `relative`

      var contenedor = elem.parent();

      if (contenedor.css('position') !== 'relative') {
        alert('El reloj no podrá ser ubicado correctamente.');
      }

      // Seteamos el alto y el ancho según el parámetro
      elem.width(opts.anchoAlto);
      elem.height(opts.anchoAlto);

      elem.css('position', 'absolute');

      if ( !setPosicionReloj(elem, opts.posicion) ) {
        alert('Posición invalida: ' + opts.posicion);
      }

      // agregamos el tema
      elem.addClass(opts.tema);

      // creamos los números
      var radio = ( (opts.anchoAlto - 30) / 2);

      var $agujas = $('<canvas width="' + opts.anchoAlto + '" height="' + opts.anchoAlto + '"></canvas>');
      $agujas.css('position', 'absolute');

      elem.append( $agujas );

      var $nums = $('<ul class="numeros"></ul>');
      var nums = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 , 11];

      for (var i = 0; i < nums.length; i++) {
        var h = nums[i];
        var $li = $('<li data-hora="' + h + '"></li>');
        setPosicionHora($li, h, radio);
        $nums.append($li);

        for (var j = 1; j <= 4; j++) {
          var $li = $('<li data-min="' + j + '"></li>');
          setPosicionMin($li, h, j, radio);
          $nums.append($li);
        }
      };

      elem.append( $nums);

      $agujas.agujas({
        rellenoSegundos: 20,
        rellenoMinutos: 40,
        rellenoHoras: 50,
        colorSegundero: '#000',
        colorMinutero: '#000',
        colorHorario: '#000'
      });

    });

  };

  $.fn.reloj.defaults = {
    tema: 'camp-digital',
    anchoAlto: 400,
    posicion: 'middle center'
  };

})(jQuery, window);