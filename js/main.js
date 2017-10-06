$( document ).ready(function() {

  String.prototype.toDash = function(){
    return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
  };

  coordConstructor = function(lat,longi) {
    var newCoord = { lat: lat, longi: longi };
    return newCoord
  }

  zoomConstructor = function(coords) {
    zoomArgs =  { level: 10,
                  latitude: coords.lat,
                  longitude: coords.longi,
                  animDuration: 2500 }
    return zoomArgs
  }

  modalInit = function(trigger,prev,next,city) {
    $(trigger).click(function(){
      if ( trigger == "#js-new-delhi-prev" ) {
        $(prev).modal('hide');
        stopAudio();
        zoomOut();
        setTimeout(function() {
          $(next).modal('show');
        }, 1100);
      } else {
        step(prev, next, city);
      }
    })
  }

  step = function(prev,next,city) {
    $(prev).modal('hide');
    stopAudio();
    audioCity = city.toDash();
    delay = 2500 + zoomLocate(city);
    setTimeout(function() {
      $(next).modal('show');
      playAudio(audioCity)
    }, delay);
  }

  playAudio = function(city) {
    var cityAudio = '#js-' + city + '-audio';
    $(cityAudio)[0].play();
  }

  stopAudio = function() {
    $('audio').each(function() {
      $(this)[0].pause();
      $(this)[0].currentTime = 0
    });
  }

  zoomLocate = function(city) {
    coords = eval(city);
    currentZoom = $(".map-container").data('mapael').zoomData.zoomLevel;
    zoomArgs = zoomConstructor(coords);

    if ( currentZoom == 0 ) {
      $('.map-container').trigger('zoom', zoomArgs);
      flashPlot(city);
      return 0;
    } else {
      zoomOut();
      setTimeout(function() {
        $('.map-container').trigger('zoom', zoomArgs);
        flashPlot(city);
      }, 1100);
      return 1100;
    }

  }

  zoomOut = function() {
    fullMap =  { level: 0, animDuration: 1000 }
    $('.map-container').trigger('zoom', fullMap);
  }

  flashPlot = function(city) {

    [0, 1000, 2000].forEach( function(index) {
      pulse(city, 'over', index);
    });

    [500, 1500, 2500].forEach( function(index) {
      pulse(city, 'out', index);
    });

  }

  pulse = function(city, direction, index) {
    setTimeout(function() {
      $( "circle[data-id=" + city + "]" ).trigger( "mouse" + direction );
    }, index);
  }

  toggleTranscript = function(location) {
    $( "#js-" + location + "-transcript-trigger" ).click(function() {
      $( "#js-" + location + "-transcript" ).toggle();
      if ( $(this).text() == 'Show Transcript' ) {
        $(this).text('Hide Transcript')
      } else {
        $(this).text('Show Transcript')
      }
    });
  }

  // Location Coordinates
  start =  coordConstructor(0, 0);
  newDelhi =  coordConstructor(28.6, 76.2);
  california = coordConstructor(37.7, -122.4);
  dominicanRepublic = coordConstructor(18.7, -70.1);
  phoenix = coordConstructor(33.4, -112);
  cornell = coordConstructor(40.7, -74);

  // Map generator
  $('.map-container').mapael({

      map: {

        name: "world_countries",

        zoom: {
          enabled: true
        },

        defaultPlot: {

          attrs: {
            fill: "#FF1934",
            opacity: 0.6
          },

          attrsHover: {
            opacity: 1
          },

          text: {

            attrs: {
              fill: "#393D40"
            },

            attrsHover: {
              fill: "#777F85"
            }

          } // Close text

        }, // Close default plot

        defaultArea: {

          attrs: {
            fill: "#009CE7",
            stroke: "#fff"
          },

          attrsHover: {
            fill: "#009CE7"
          }

        } // Close default area

      }, // Close map

      plots: {

        'newDelhi': {
          type: 'circle',
          size: 5,
          latitude: newDelhi.lat,
          longitude: newDelhi.longi,
          text: {
            position: 'bottom',
            content: 'New Delhi',
            attrs : { "font-size": 9 }
          }
        },

        'california': {
          type: 'circle',
          size: 5,
          latitude: california.lat,
          longitude: california.longi,
          text: {
            position: 'bottom',
            content: 'Bay Area',
            attrs : { "font-size": 9 }
          }
        },

        'dominicanRepublic': {
          type: 'circle',
          size: 5,
          latitude: dominicanRepublic.lat,
          longitude: dominicanRepublic.longi,
          text: {
            position: 'bottom',
            content: 'Dominican Republic',
            attrs : { "font-size": 9 }
          }
        },

        'phoenix': {
          type: 'circle',
          size: 5,
          latitude: phoenix.lat,
          longitude: phoenix.longi,
          text: {
            position: 'bottom',
            content: 'Phoenix',
            attrs : { "font-size": 9 }
          }
        },

        'cornell': {
          type: 'circle',
          size: 5,
          latitude: cornell.lat,
          longitude: cornell.longi,
          text: {
            position: 'bottom',
            content: 'Cornell',
            attrs : { "font-size": 9 }
          }
        }

      } // Close plots

  }); // end map generator

  // Journey Modals

  // Show start modal on page load
  $('#js-start-journey-modal').modal('show');

  // Set up event listeners for previous and next buttons on journey modals
  modalInit('#js-start-journey-next', '#js-start-journey-modal', "#js-new-delhi-modal", "newDelhi"); // From Start to New Delhi
  modalInit('#js-new-delhi-prev', '#js-new-delhi-modal', "#js-start-journey-modal", "start"); // From New Delhi to Start
  modalInit('#js-new-delhi-next', '#js-new-delhi-modal', "#js-california-modal", "california"); // From New Delhi to Califonia
  modalInit('#js-california-prev', '#js-california-modal', "#js-new-delhi-modal", "newDelhi"); // From California to New Delhi
  modalInit('#js-california-next', '#js-california-modal', "#js-dominican-republic-modal", "dominicanRepublic"); // From California to the Dominican Republic
  modalInit('#js-dominican-republic-prev', '#js-dominican-republic-modal', "#js-california-modal", "california"); // From California to New Delhi
  modalInit('#js-dominican-republic-next', '#js-dominican-republic-modal', "#js-phoenix-modal", "phoenix"); // From California to New Delhi
  modalInit('#js-phoenix-prev', '#js-phoenix-modal', "#js-dominican-republic-modal", "dominicanRepublic"); // From California to New Delhi
  modalInit('#js-phoenix-next', '#js-phoenix-modal', "#js-cornell-modal", "cornell"); // From California to New Delhi
  modalInit('#js-cornell-prev', '#js-cornell-modal', "#js-phoenix-modal", "phoenix"); // From California to New Delhi

  // Show/Hide transcripts on journey slides
  toggleTranscript('new-delhi');
  toggleTranscript('california');
  toggleTranscript('dominican-republic');
  toggleTranscript('phoenix');
  toggleTranscript('cornell');

}); // document.ready
