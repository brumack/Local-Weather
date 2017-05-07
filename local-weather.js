$(document).ready(function() {
  var tempType = 0;
  getWeather(tempType);
  getForecast(tempType);

  $('#fOrC').on('click', function() {
      tempType = (tempType + 1) % 2;
      getWeather(tempType);
      getForecast(tempType);
    });
});



var getWeather = function(tempType) {
  $.ajax({
    type: 'GET',
    url: 'http://ip-api.com/json/',
    success: function(data) {
      var ip = data.query;
      $.ajax({
        type: 'GET',
        url: 'https://api.weatherbit.io/v1.0/current/ip?ip=' + ip + '&units=S&key=e14f101e3f74490e807874d3727dff1e',
        success: function(data) {

          var city = data.data[0].city_name;
          var state = data.data[0].state_code;
          var country = data.data[0].country_code;
          var temp = data.data[0].temp;
          var icon = data.data[0].weather.icon;
          var desc = data.data[0].weather.description;
          var precip = data.data[0].precip;

          if (tempType == 0)
            var symbol = 'F';
          else
            symbol = 'C';

          $('.region').text(data.data[0].city_name + ', ' + data.data[0].state_code + ' ' + data.data[0].country_code);
          $('.tempLocal').text(Math.round(convert(temp, tempType)));
          $('#fOrC').text(symbol);
          $('.condit').text(desc);
        }
      });
    }
  });
}

var getForecast = function(tempType) {
  $.ajax({
    type: 'GET',
    url: 'http://ip-api.com/json/',
    success: function(data) {
      var ip = data.query;
      $.ajax({
        type: 'GET',
        url: 'https://api.weatherbit.io/v1.0/forecast/3hourly/ip?ip=' + ip + '&days=7&units=S&key=e14f101e3f74490e807874d3727dff1e',
        success: function(data) {

          var timeStamp = Math.floor(Date.now() / 1000);
          var timeSince = timeStamp % 86400;
          var timeTil = 86400 - timeSince;
          var nextDay = timeStamp + timeTil + 25200 - 3600;
          console.log(nextDay);
          console.log(data);
          var temps = [
            [],
            [],
            []
          ];

          if (tempType == 0)
            var symbol = 'F';
          else
            symbol = 'C';

          var icons = [];
          var descriptions = [];
          var date = '';

          for (var i = 0; i < data.data.length; i++)
            if (data.data[i].ts == nextDay)
              var begin = i;

          console.log(begin);

          for (var j = 0; j < 3; j++)
            for (var k = begin; k < begin + 8; k++) {
              temps[j].push(data.data[k + (j*8)].temp);
              if (k == begin + 4)
                icons.push(data.data[k*(j+1)].weather.icon);
            }

          console.log(icons);
          for (j = 0; j <= 2; j++) {
            temps[j].sort();
            date = new Date(nextDay * 1000 + 3600000 + (86400000 * j));

            $('#day' + (j+1)).text(date.toString().substring(0, 3));
            $('#d' + (j+1) + 'h').text(Math.round(convert(temps[j][7], tempType)) + symbol);
            $('#d' + (j+1) + 'l').text(Math.round(convert(temps[j][0], tempType)) + symbol);
            $('#d' + (j+1) + 'i').html("<img class = 'icon' src='https://www.weatherbit.io/static/img/icons/" + icons[j] + ".png'>");

          }
        }
      });
    }
  });
}

var convert = function(temp, tempType) {
  var converted = 0;

  if (tempType == 0)
    converted = (temp * 9 / 5) - 459.67;
  else
    converted = temp - 273;
  return converted;
}
