var appId = '8ZRnPK6TTi8p9uGrARtm0RvF1eAKgzciL18oASuF',
    key = 'bhXp8UST70ApUILSCvE2llMLTh5RBVRgP2K6Jl4a',
    x = ['x'],
    minutes = ['Minutes'],
    PERIOD = 7,
    chart;

$(function() {
  Parse.initialize(appId, key);
  // listener to update period and data on selection
  $('#period').on('change', function () {
    var selection = $(this).val();
    if (selection !== PERIOD) {
      PERIOD = $(this).val();
      update();
    }
  });
  // get temp data for chart
  loadData()
  .then(function (data) {
    console.log(_.groupBy(data, function (event) {
      return moment(event.attributes.enterTime).format('YYYY-M-D');
    }));
    return loadData(true);
  })
  .done(function (data) {
    $('.loading-spinner').hide();
    $('.main').show();
    // render chart
    chart = c3.generate({
      data: {
        x: 'x',
        type: 'bar',
        columns: [x, minutes]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        }
      }
    });
  });
});

function loadData(temp) {
  var deferred = $.Deferred();
  if (temp) {
    // reset arrays to first values
    x = [x[0]]
    minutes = [minutes[0]];
    // set random data from yesterday to end of period
    for (var i = 0; i < PERIOD; i++) {
      minutes.push(Math.floor(Math.random() * 100));
      x.push(moment().subtract('days', i + 1).format('YYYY-M-D'));
    }
    deferred.resolve();
  } else {
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.find({
      success: function (results) {
        deferred.resolve(results);
      },
      error: function (error) {
        alert("Error: " + error.code + " " + error.message);
        deferred.resolve();
      }
    });
  }
  return deferred;
}

function update() {
  // reload data and chart
  loadData()
  .then(function (data) {
    console.log(data);
    return loadData(true);
  })
  .done(function () {
    chart.load({
      columns: [x, minutes]
    });
  });
}
