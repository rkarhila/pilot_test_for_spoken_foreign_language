/**
 * jQuery PieTimer Plugin v0.1
 * Authors: Kus (http://blakek.us/css3-pie-graph-timer-with-jquery/)
 *          Connor Doyle (jQuery plugin)
 *
 * http://github.com/chikamichi/jquery.pietimer
 *
 * Licensed under the MIT licenses:
 * http://www.opensource.org/licenses/mit-license.php
 *
 *
 *  Modifications by Reima Karhila 23 Sep 2015
 *  to accommodate countdown of seconds
 *
 *    http://github.com/rkarhila/pilot_test_for_spoken_foreign_language
 */
(function($){
  var methods = {
    init: function(options) {
      var state = {
        timer: null,
        timerSeconds: 10,
        callback: function() {},
        timerCurrent: 0,
        showPercentage: false,
        showRemaining: true,
        fill: false,
        color: '#CCC'
      };

      state = $.extend(state, options);

      return this.each(function() {
        var $this = $(this);
        var data = $this.data('pietimer');
        if (!data) {
          $this.addClass('pietimer');
          $this.css({fontSize: $this.width()});
          $this.data('pietimer', state);
          if (state.showPercentage) {
            $this.find('.percent').show();
          }
          if (state.fill) {
            $this.addClass('fill');
          }
          $this.pietimer('start');
        }
      });
    },

    stopWatch: function() {
      var data = $(this).data('pietimer');
      if (data) {
        var seconds = (data.timerFinish-(new Date().getTime()))/1000;
        if (seconds <= 0) {
          clearInterval(data.timer);
          $(this).pietimer('drawTimer', 100, (data.timerSeconds));
          data.callback();
        } else {
          var percent = 100-((seconds/(data.timerSeconds))*100);
	  var remainingsec = (seconds);
          $(this).pietimer('drawTimer', percent, remainingsec);
        }
      }
    },

    drawTimer: function(percent, remainingsec) {
      $this = $(this);
      var data = $this.data('pietimer');
      if (data) {
        $this.html('<div class="percent"></div><div class="remainingsec"></div><div class="slice'+(percent > 50?' gt50"':'"')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
        var deg = 360/100*percent;
        $this.find('.slice .pie').css({
          '-moz-transform':'rotate('+deg+'deg)',
          '-webkit-transform':'rotate('+deg+'deg)',
          '-o-transform':'rotate('+deg+'deg)',
          'transform':'rotate('+deg+'deg)'
        });
        $this.find('.percent').html(Math.round(percent)+'%');
        $this.find('.remainingsec').html(Math.round(remainingsec)+' s');
        if (data.showPercentage) {
          $this.find('.percent').show();
        }
        if (data.showRemaining) {
          $this.find('.remainingsec').show();
        }
        if ($this.hasClass('fill')) {
          $this.find('.slice .pie').css({backgroundColor: data.color});
        }
        else {
          $this.find('.slice .pie').css({borderColor: data.color});
        }
      }
    },
    
    start: function() {
      var data = $(this).data('pietimer');
      if (data) {
        data.timerFinish = new Date().getTime()+(data.timerSeconds*1000);
        $(this).pietimer('drawTimer', 0, data.timerSeconds);
        data.timer = setInterval("$this.pietimer('stopWatch')", 50);
      }
    },

    reset: function() {
      var data = $(this).data('pietimer');
      if (data) {
	  console.log('resetting timer');
        clearInterval(data.timer);
        $(this).pietimer('drawTimer', 0, data.timerSeconds);
	  console.log('That went well');
      }
    }
  };

  $.fn.pietimer = function(method) {
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.pietimer');
    }
  };
})(jQuery);
