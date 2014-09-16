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

function loadData() {
  var deferred = $.Deferred();
  // get events from Parse based on period selection
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  console.log(new Date(moment().format()));
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
    return moment(event.attributes.enterTime).format('YYYY-M-D');
  });
  // add dates
  x = x.concat(_.keys(eventGroups));
  _.each(eventGroups, function (events) {
    // sum difference between enter and exit times for each date
    var time = 0;
    _.each(events, function (event) {
      var start = moment(event.attributes.enterTime);
      var exit = (event.attributes.exitTime) ? event.attributes.exitTime : moment();
      var end = moment(exit);
      time += end.diff(start, 'minutes');
    });
    // add minutes for date
    minutes.push(time);
  });
}

function update() {
  // reset arrays to first values
  x = x.slice(0,1);
  minutes = minutes.slice(0,1);
  var spinner = $('#loading-spinner');
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
