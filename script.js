function getWeather(city) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=3c5df29c7c4104b411776c9903d99c5f";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    icon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
    date = new Date(response.dt*1000).toDateString();
    $("#current-city").html(response.name + "<img src=" + icon + ">" + date);
    $("#temperature").html(" " + Math.round(response.main.temp) + "&#8457");
    $("#humidity").html(" " + response.main.humidity + "%");
    $("#wind-speed").html(" " + Math.round(response.wind.speed) + " MPH");
    var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=3c5df29c7c4104b411776c9903d99c5f&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
    $.ajax({
      url: UVQueryURL,
      method: "GET"
    }).then(function(response){
      if (response.value < 3) {
        $("#uv-index").css("color", "#0f0");
        $("#uv-index").html(" " + response.value + " LOW");
      } else if (response.value >= 3 && response.value < 6) {
        $("#uv-index").css("color", "#ff0");
        $("#uv-index").html(" " + response.value + " MODERATE");
      } else if (response.value >= 6 && response.value < 8) {
        $("#uv-index").css("color", "#f80");
        $("#uv-index").html(" " + response.value + " HIGH");
      } else if (response.value >= 8 && response.value < 11) {
        $("#uv-index").css("color", "#f00");
        $("#uv-index").html(" " + response.value + " VERY HIGH");
      } else {
        $("#uv-index").css("color", "#f0f");
        $("#uv-index").html(" " + response.value + " EXTREME");
      };
      var forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.lat + "&lon=" + response.lon + "&units=imperial&exclude=current,minutely,hourly&appid=3c5df29c7c4104b411776c9903d99c5f";
      $.ajax({
        url: forecastQueryURL,
        method: "GET"
      }).then(function(response){
        for (i = 0; i < 5; i++) {
          date = new Date(response.daily[i].dt*1000).toDateString().slice(0, 3);
          icon = "https://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
          $("#day" + i).html(date + "<img src=" + icon + ">");
          $("#high" + i).html(" " + Math.round(response.daily[i].temp.max) + "&#8457");
          $("#low" + i).html(" " + Math.round(response.daily[i].temp.min) + "&#8457");
        };
        document.getElementById("data-display").style.visibility = "visible";
      });
    });
  });
};

function getCity(event) {
  // event.preventDefault();
  if ($("#city").val().trim() != "") {
    getWeather($("#city").val().trim());
  } else {
    document.getElementById("data-display").style.visibility = "hidden";
  };
};

$("#search-btn").on("click", getCity);

