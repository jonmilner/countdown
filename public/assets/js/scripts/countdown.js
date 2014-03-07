(function() {

  var units = 'px', // px, percent, or blocks
      $containerID = $('.main'),
      $counterValue = $containerID.find('.counter-value'),
      $counterMax = $containerID.find('.counter-max'),
      $counterUnit = $containerID.find('.counter-unit'),
      $radialProgress = $('.progress'),
      documentHeight,
      windowHeight,
      scrollPosition,
      option = {
        pageHeight: 10000,
        blocks: 10,
        offset: 0,
        testOffset: false,
        startAtBottom: false,
        reverseValues: false,
        showOutOf: false,
        launchSpeed: 800
      };

  function locatePosition() {
    documentHeight = $(document).height() - option.offset;
    windowHeight = $(window).height();
    scrollPosition = $(window).scrollTop() - option.offset;
  }

  function calcPixelsRemain() {
    if (option.reverseValues) {
      return (documentHeight - windowHeight) - scrollPosition;
    } else {
      return windowHeight + scrollPosition;
    }
  }

  function calcPercentageRemain(base) {
    if (option.reverseValues) {
      return base - (Math.round((scrollPosition / (documentHeight - windowHeight)) * base));
    } else {
      return (Math.round((scrollPosition / (documentHeight - windowHeight)) * base));
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function checkMinMax(val, max, min) {
    if (val > max) {
      return max;
    } else if (val < min) {
      return min;
    }
    return val;
  }

  function updateDom(counterValue, counterMax, counterUnit) {
    $counterValue.html(counterValue);
    if (option.showOutOf) {
      $counterMax.html(counterMax).show();
    } else {
      $counterMax.hide();
    };
    $counterUnit.html(counterUnit);
    $radialProgress.attr('data-progress', checkMinMax(calcPercentageRemain(100), 100, 0));
  }

  // Calculate # of Units Remaining
  function updateUnitsRemain(units) {
    var counterValue,
        counterMax,
        counterUnit;
    if (units === 'px') {
      counterMax = '/ ' + documentHeight;
      counterValue = checkMinMax(calcPixelsRemain(), documentHeight, windowHeight);
      counterValue = numberWithCommas(counterValue);
      counterUnit = 'Pixel';
    } else if (units === 'percent') {
      counterMax = '/ ' + 100 + '%';
      counterValue = checkMinMax(calcPercentageRemain(100), 100, 0);
      if (!option.showOutOf) {
        counterValue += '%';
      };
      counterUnit = '';
    } else if (units === 'blocks') {
      counterMax = '/ ' + option.blocks;
      counterValue = checkMinMax(calcPercentageRemain(option.blocks), option.blocks, 0);
      counterUnit = 'Block';
    };
    if (units != 'percent' && counterValue != 1) {
      counterUnit += 's';
    };
    updateDom(counterValue, counterMax, counterUnit);
  }

  function setPageHeight() {
    $('body').css('height', option.pageHeight);
  }

  function setOffsetPosition() {
    $('#test-offset').css('top', option.offset + 'px');
  }

  function main() {
    locatePosition();
    setPageHeight();
    setOffsetPosition();
    updateUnitsRemain(units);
  }

  function scrollTo(position) {
    window.scrollTo(0, position);
  }

  if (option.startAtBottom) {
    goToBottom();
    $('#option-start').html('Start at Top');
  };

  main();

  $(window).scroll(function() {
    main();
  })

  // Smooth Scroll to Top
  $('#top').click(function(){
    $('html, body').animate({ scrollTop: 0 }, option.launchSpeed);
    return false;
  })

  // Update Units
  $('#control-units').on('click', 'button', function() {
    $('.control-panel').removeClass (function (index, css) {
      return (css.match (/\bcurrent-unit-\S+/g) || []).join(' ');
    }).addClass('current-unit-' + $(this).data('unit'));
    if (!$(this).hasClass('active')) {
      $('#control-units .btn').removeClass('active');
      $(this).addClass('active');
      units = $(this).data('unit');
      main();
      return false;
    } else {
      return false;
    }
  });

  // Update Value Options
  $('.control-panel').on('keyup', '.update-value', function() {
    var filteredVal = $(this).val().replace(/[^0-9,]*/g, '');
    $(this).val(filteredVal);
    option[$(this).data('option')] = parseInt(filteredVal.replace(/,/g, ''), 10);
    main();
  })

  function optionCallback(string1, string2, optionName, callback) {
    if (option[optionName]) {
      $(this).removeClass('active');
    } else {
      $(this).addClass('active');
    };
    $(this).html(option[optionName] ? string1 : string2);
    option[optionName] = !option[optionName];
    callback && callback();
    main();
    return false;
  }

  // Toggle Reverse Option
  $('#option-reverse').click(function() {
    return optionCallback.call(this, 'Count Down', 'Count Up', 'reverseValues');
  })

  // Toggle Start Position
  $('#option-start').click(function() {
    return optionCallback.call(this, 'Start at Bottom', 'Start at Top', 'startAtBottom', function () {
      scrollTo(option.startAtBottom ? document.body.clientHeight : 0);
    })
  })

  // Toggle Offset Test
  $('#option-test-offset').click(function() {
    return optionCallback.call(this, 'Test Offset On', 'Test Offset Off', 'testOffset', function () {
      $('#test-offset')[option.testOffset ? 'show' : 'hide']();
    })
  })

  // Toggle "Out Of"
  $('#option-out-of').click(function() {
    return optionCallback.call(this, 'Show Remaining On', 'Show Remaining Off', 'showOutOf', function () {
    })
  })

})();