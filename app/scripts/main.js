var x = ['x'],
    minutes = ['Minutes'],
    PERIOD = 7,
    chart;

$(function() {
  setTimeout(function() {
    $('.loading-spinner').hide();
    $('.main').show();
    // listener to update period and data on selection
    $('#period').on('change', function() {
      var selection = $(this).val();
      if (selection !== PERIOD) {
        PERIOD = $(this).val();
        update();
      }
    });
    // get initial data for chart with default settings
    loadData();
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
  }, 2000);
});

function loadData() {
  // reset arrays to first values
  x = [x[0]]
  minutes = [minutes[0]];
  // set random data from yesterday to end of period
  for (var i = 0; i < PERIOD; i++) {
    minutes.push(Math.floor(Math.random() * 100));
    var date = new Date();
    date.setDate(date.getDate() + (i - PERIOD));
    var dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
    x.push(dateString);
  }
}

function update() {
  // reload data and chart
  loadData();
  chart.load({
    columns: [x, minutes]
  })
}
