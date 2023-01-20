$(document).ready(function () {
  var uri = $(location).attr("href");
  console.log(uri);
  const create_charts = async () => {
    try {
      let chartsIdResponse = await fetch(uri + "api/v1/charts_id");
      let chartsId = await chartsIdResponse.json();
      console.log(JSON.stringify(chartsId));

      /* Card generation */
      let i = 0;
      while (i < Object.keys(chartsId).length) {
        let chartResponse = await fetch(
          uri + "node/" + Object.values(chartsId[i]) + "?_format=json"
        );
        let chartData = await chartResponse.json();
        console.log(chartData);
        console.log(chartData.title[0].value);

        /** Paragraph data extraction that will be inserted 
        it in charts.js Chart Class **/

        /* calculate number of pairs of data that will be manipulated*/
        let numberOfPairs = Object.keys(chartData.field_data_paragraph).length;
        console.log("Pairs: " + numberOfPairs);
        let j = 0;
        let axisX = [];
        let axisY = [];
        while (j < numberOfPairs) {
          console.log(
            "Pairs -> Target Id: " + chartData.field_data_paragraph[j].target_id
          );
          var pairResponse = await fetch(
            uri +
              "/entity/paragraph/" +
              chartData.field_data_paragraph[j].target_id +
              "?_format=json"
          );
          var pairData = await pairResponse.json();
          console.log(
            "Nuevo Axis X founded: " + pairData.field_axis_x[0].value
          );
          console.log(
            "Nuevo Axis Y founded: " + pairData.field_axis_y[0].value
          );
          axisX.push(pairData.field_axis_x[0].value);
          axisY.push(pairData.field_axis_y[0].value);
          console.log("New Axis X Pushed into arr: " + axisX);
          console.log("New Axis Y Pushed into arr: " + axisY);
          j++;
        }
        create_card(chartData, i, axisX, axisY);
        i++;
      }
    } catch (error) {
      //console.log("Error en charge data!!");
    }
  };
  /* ***************************************************************** End */
  function create_card(data, idNum, axisX, axisY) {
    let style = format_style(data.field_graph_styles[0].value);
    console.log("Este es el estilo: " + style);

    let id = idNum + 1;
    $("#box-1").append(
      "<div id='card-" +
        id +
        "'class='chart-card-" +
        style.toLowerCase() +
        "'></div>"
    );
    $("#card-" + id).append(
      "<div id='card-header-" +
        id +
        "'class='chart-card-header'>" +
        data.title[0].value +
        "</div>"
    );
    $("#card-" + id).append(
      "<div class='canvas-container'><canvas id='card-content-" +
        id +
        "'class='chart-card-content'></canvas></div>"
    );
    $("#card-" + id).append(
      "<div id='card-footer-" +
        id +
        "'class='chart-card-footer'>" +
        data.body[0].value +
        "</div>"
    );
    let type = data.field_type_of_graph[0].value;
    if (type == "pie" || type == "doughnut" || type == "polarArea") {
      let colors = get_colors(style);
      create_pie_chart(data, id, axisX, axisY, colors);
    } else {
      let colors = get_colors(style);
      colors = colors[0];
      create_default_chart(data, id, axisX, axisY, colors);
    }
  }

  function create_default_chart(data, id, axisX, axisY, colors) {
    let sufix = data.field_sufix[0].value;
    let label = data.field_data_type[0].value;
    let type = data.field_type_of_graph[0].value;

    new Chart("card-content-" + id, {
      type: type,
      data: {
        labels: axisX, //concepts,
        datasets: [
          {
            label: label,
            data: axisY, //amounts,
            borderWidth: 1,
            backgroundColor: colors,

            fill: true,
            borderColor: "#d0dff5", // Add custom color border (Line)
          },
        ],
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
              callback: function (value, index, ticks) {
                return sufix + " " + value;
              },
            },
          },
        },
      },
    });
  }

  function create_pie_chart(data, id, axisX, axisY, colors) {
    let sufix = data.field_sufix[0].value;
    let label = data.field_data_type[0].value;
    let type = data.field_type_of_graph[0].value;

    new Chart("card-content-" + id, {
      type: type,
      data: {
        labels: axisX, //concepts,
        datasets: [
          {
            label: label,
            data: axisY, //amounts,
            borderWidth: 1,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
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
    let colrs = [];
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
        colrs = [
          "#0fe9e9",
          "#2270c4",
          "#50c7c6",
          "#e4970d",
          "##1edada",
          "#d0dff5",
        ];
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
