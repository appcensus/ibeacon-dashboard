var appId = '8ZRnPK6TTi8p9uGrARtm0RvF1eAKgzciL18oASuF',
    key = 'bhXp8UST70ApUILSCvE2llMLTh5RBVRgP2K6Jl4a',
    x = ['x'],
    minutes = ['Minutes'],
    PERIOD = 1,
    events = [],
    chart;

$(function() {
  Parse.initialize(appId, key);
  // listener to update period and data on selection
  $('#period').on('change', function () {
    var selection = $(this).val();
    if (PERIOD !== selection) {
      PERIOD = selection;
      update();
    }
  });
  // get data for chart
  loadData()
  .done(function (data) {
    events = data;
    organizeData();
    $('#spinner').hide();
    $('#main').show();
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

function loadData() {
  var deferred = $.Deferred();
  // get events from Parse based on period selection
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.lessThanOrEqualTo('exitTime', new Date(moment().format()))
  query.greaterThanOrEqualTo('enterTime', new Date(moment().subtract(PERIOD - 1, 'days').startOf('day').format()));
  query.find({
    success: function (results) {
      deferred.resolve(results);
    },
    error: function (error) {
      alert("Error: " + error.code + " " + error.message);
      deferred.resolve();
    }
  });
  return deferred;
}

function organizeData() {
  // group events by date
  var eventGroups = _.groupBy(events, function (event) {
    return moment(event.get("enterTime")).format('YYYY-M-D');
  });
  for (var i = 0; i < PERIOD; i++) {
    // add dates
    var day = moment().subtract(i, 'days').format('YYYY-M-D');
    x.push(day);
    // check if day in data
    if (eventGroups.hasOwnProperty(day)) {
      // sum difference between enter and exit times for each date
      var time = 0;
      _.each(eventGroups[day], function (event) {
        var start = moment(event.get("enterTime"));
        var exit = (event.get("exitTime")) ? event.get("exitTime") : moment();
        var end = moment(exit);
        time += end.diff(start, 'minutes');
      });
      // add minutes for date
      minutes.push(time);
    } else {
      minutes.push(0);
    }
  }
}

function update() {
  // reset arrays to first values
  x = x.slice(0,1);
  minutes = minutes.slice(0,1);
  var spinner = $('#spinner');
  spinner.show();
  loadData()
  .done(function (data) {
    events = null;
    events = data;
    organizeData();
    spinner.hide();
    // reload data and chart
    chart.load({
      columns: [x, minutes]
    });
  });
}
