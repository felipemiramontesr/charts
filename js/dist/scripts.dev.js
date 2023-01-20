"use strict";

$(document).ready(function () {
  var uri = $(location).attr("href");
  console.log(uri);

  var create_charts = function create_charts() {
    var chartsIdResponse, chartsId, i, chartResponse, chartData, numberOfPairs, j, axisX, axisY, pairResponse, pairData;
    return regeneratorRuntime.async(function create_charts$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(fetch(uri + "api/v1/charts_id"));

          case 3:
            chartsIdResponse = _context.sent;
            _context.next = 6;
            return regeneratorRuntime.awrap(chartsIdResponse.json());

          case 6:
            chartsId = _context.sent;
            console.log(JSON.stringify(chartsId));
            /* Card generation */

            i = 0;

          case 9:
            if (!(i < Object.keys(chartsId).length)) {
              _context.next = 44;
              break;
            }

            _context.next = 12;
            return regeneratorRuntime.awrap(fetch(uri + "node/" + Object.values(chartsId[i]) + "?_format=json"));

          case 12:
            chartResponse = _context.sent;
            _context.next = 15;
            return regeneratorRuntime.awrap(chartResponse.json());

          case 15:
            chartData = _context.sent;
            console.log(chartData);
            console.log(chartData.title[0].value);
            /** Paragraph data extraction that will be inserted 
            it in charts.js Chart Class **/

            /* calculate number of pairs of data that will be manipulated*/

            numberOfPairs = Object.keys(chartData.field_data_paragraph).length;
            console.log("Pairs: " + numberOfPairs);
            j = 0;
            axisX = [];
            axisY = [];

          case 23:
            if (!(j < numberOfPairs)) {
              _context.next = 40;
              break;
            }

            console.log("Pairs -> Target Id: " + chartData.field_data_paragraph[j].target_id);
            _context.next = 27;
            return regeneratorRuntime.awrap(fetch(uri + "/entity/paragraph/" + chartData.field_data_paragraph[j].target_id + "?_format=json"));

          case 27:
            pairResponse = _context.sent;
            _context.next = 30;
            return regeneratorRuntime.awrap(pairResponse.json());

          case 30:
            pairData = _context.sent;
            console.log("Nuevo Axis X founded: " + pairData.field_axis_x[0].value);
            console.log("Nuevo Axis Y founded: " + pairData.field_axis_y[0].value);
            axisX.push(pairData.field_axis_x[0].value);
            axisY.push(pairData.field_axis_y[0].value);
            console.log("New Axis X Pushed into arr: " + axisX);
            console.log("New Axis Y Pushed into arr: " + axisY);
            j++;
            _context.next = 23;
            break;

          case 40:
            create_card(chartData, i, axisX, axisY);
            i++;
            _context.next = 9;
            break;

          case 44:
            _context.next = 48;
            break;

          case 46:
            _context.prev = 46;
            _context.t0 = _context["catch"](0);

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 46]]);
  };
  /* ***************************************************************** End */


  function create_card(data, idNum, axisX, axisY) {
    var style = format_style(data.field_graph_styles[0].value);
    console.log("Este es el estilo: " + style);
    var id = idNum + 1;
    $("#box-1").append("<div id='card-" + id + "'class='chart-card-" + style.toLowerCase() + "'></div>");
    $("#card-" + id).append("<div id='card-header-" + id + "'class='chart-card-header'>" + data.title[0].value + "</div>");
    $("#card-" + id).append("<div class='canvas-container'><canvas id='card-content-" + id + "'class='chart-card-content'></canvas></div>");
    $("#card-" + id).append("<div id='card-footer-" + id + "'class='chart-card-footer'>" + data.body[0].value + "</div>");
    var type = data.field_type_of_graph[0].value;

    if (type == "pie" || type == "doughnut" || type == "polarArea") {
      var colors = get_colors(style);
      create_pie_chart(data, id, axisX, axisY, colors);
    } else {
      var _colors = get_colors(style);

      _colors = _colors[0];
      create_default_chart(data, id, axisX, axisY, _colors);
    }
  }

  function create_default_chart(data, id, axisX, axisY, colors) {
    var sufix = data.field_sufix[0].value;
    var label = data.field_data_type[0].value;
    var type = data.field_type_of_graph[0].value;
    new Chart("card-content-" + id, {
      type: type,
      data: {
        labels: axisX,
        //concepts,
        datasets: [{
          label: label,
          data: axisY,
          //amounts,
          borderWidth: 1,
          backgroundColor: colors,
          fill: true,
          borderColor: "#d0dff5" // Add custom color border (Line)

        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        //animations: animation,
        scales: {
          x: {},
          y: {
            beginAtZero: true,
            ticks: {
              callback: function callback(value, index, ticks) {
                return sufix + " " + value;
              }
            }
          }
        }
      }
    });
  }

  function create_pie_chart(data, id, axisX, axisY, colors) {
    var sufix = data.field_sufix[0].value;
    var label = data.field_data_type[0].value;
    var type = data.field_type_of_graph[0].value;
    new Chart("card-content-" + id, {
      type: type,
      data: {
        labels: axisX,
        //concepts,
        datasets: [{
          label: label,
          data: axisY,
          //amounts,
          borderWidth: 1,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right"
          }
        }
      }
    });
  }

  function format_style(str) {
    switch (str) {
      case "New York":
        str = "new-york";
        return str;

      case "New Mexico":
        str = "new-mexico";
        return str;

      default:
        str = str.toLowerCase();
        return str;
    }
  }

  function get_colors(style) {
    var colrs = [];

    switch (style) {
      case "florida":
        colrs = ["#66acfa", "#ffe5ae", "#d6eaff", "#bcbbb0", "#d0dff5"];
        return colrs;

      case "new-york":
        colrs = ["#496494", "#7e7f8e", "#e8e5e0", "#f6f6f6", "#d0dff5"];
        return colrs;

      case "georgia":
        colrs = ["#C1D42F", "#002D56", "#EED000", "#B50027", "#fdfdef"];
        return colrs;

      case "default":
        colrs = ["#0fe9e9", "#2270c4", "#50c7c6", "#e4970d", "##1edada", "#d0dff5"];
        return colrs;

      case "california":
        colrs = ["#e4970d", "#86cbf3", "#000505", "#525252", "#d0dff5"];
        return colrs;

      case "texas":
        colrs = ["#002868", "#bf0a30"];
        return colrs;

      case "alabama":
        colrs = ["#7c5d5a", "#5bb2b5", "#f7e7af", "#f8f4e6", "#d0dff5"];
        return colrs;

      case "new-mexico":
        colrs = ["#ffd700", "#bf0a30", "#002d56", "#ffffff", "#d0dff5"];
        return colrs;

      case "arizona":
        colrs = ["#e5601a", "#bb580d", "#bfc1c3", "#252525", "#d0dff5"];
        return colrs;

      default:
    }
  }

  create_charts();
});