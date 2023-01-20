//$(document).ready(function () {
jQuery(document).ready(function ($) {
  function countTo(f, value) {
    let from = 0;
    let to = value;
    let step = to > from ? 1 : -1;
    let interval = 300;

    if (from == to) {
      document.querySelector(f).textContent = from;
      return;
    }

    let counter = setInterval(function () {
      from += step;
      document.querySelector(f).textContent = from;

      if (from == to) {
        clearInterval(counter);
      }
    }, interval);
  }

  const charge_data = async () => {
    try {
      var nodes_ids_response = await fetch(
        "http://localhost/vehicle-fleet/web/api/v1/graphics/ids"
      );
      var nodes_ids_data = await nodes_ids_response.json();
      var nodes_ids_length = Object.keys(nodes_ids_data).length;
      //console.log(nodes_ids_length);

      for (var i = 0; i < nodes_ids_length; i++) {
        var node_response = await fetch(
          "http://localhost/vehicle-fleet/web/node/" +
            nodes_ids_data[i].nid +
            "?_format=json"
        );
        var node_data = await node_response.json();

        console.log(node_data);

        var data_lenght = Object.keys(node_data.field_data_paragraph).length;

        /* console.log("Exiten: " + data_lenght + " parejas de datos! "); */

        var title = JSON.stringify(node_data.title[0].value).replace(
          /["]+/g,
          ""
        );
        var body = JSON.stringify(node_data.body[0].value).replace(/["]+/g, "");
        var sufix = JSON.stringify(node_data.field_sufix[0].value).replace(
          /["]+/g,
          ""
        );
        console.log(
          "Este es tu Suffix: " + sufix + " del tipo: " + typeof sufix
        );

        if (sufix == "none") {
          console.log("Si esta entrando en el if del sufix");
          sufix = "";
        } else {
          console.log("Sufix: " + sufix);
        }

        var graph_type = JSON.stringify(
          node_data.field_type_of_graph[0].value
        ).replace(/["]+/g, "");
        var graph_styles = JSON.stringify(
          node_data.field_graph_styles[0].value
        ).replace(/["]+/g, "");
        var colors = [];
        var concepts = [];
        var amounts = [];
        var paragraph_amounts = [];
        var paragraph_concepts = [];

        if (graph_type == "upCount") {
          $("#up-count-box").append(
            "<div id='graphic-" +
              i +
              "'class='graphic'><div id='graphic-header-" +
              i +
              "'class='graphic-header'>" +
              title +
              "</div> <div id='graphic-up-count-" +
              i +
              "'class='graphic-up-count'></div><div id='graphic-footer-" +
              i +
              "'class='graphic-footer'></div></div>"
          );
          /* REST Paragraphs +++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
          var paragraph_lenght = Object.keys(
            node_data.field_data_paragraph
          ).length;
          console.log("Exiten: " + paragraph_lenght + " parejas de datos! ");
          for (var k = 0; k < paragraph_lenght; k++) {
            var target_id = node_data.field_data_paragraph[k].target_id;

            var paragraph_response = await fetch(
              "http://localhost/vehicle-fleet/web/entity/paragraph/" +
                target_id +
                "?_format=json"
            );
            var paragraph_data = await paragraph_response.json();

            console.log(
              "Request: " +
                (k + 1) +
                " ||   Concept: " +
                paragraph_data.field_concept[0].value +
                "| Amount: " +
                paragraph_data.field_amount[0].value
            );

            paragraph_concepts[k] = paragraph_data.field_concept[0].value;
            paragraph_amounts[k] = paragraph_data.field_amount[0].value;
            /* var concept = JSON.stringify(node_data.title[0].value).replace(
                    /["]+/g,
                    ""
                ); */
          }
          console.log(paragraph_concepts);
          console.log(paragraph_amounts);
          /* End REST Paragraphs *++++++++++++++++++++++++++++++++++++++++++++++++++++*/

          for (let j = 0; j < paragraph_concepts.length; j++) {
            let r = j;
            let amount_string = paragraph_amounts[r]
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            /* Erase coma */
            amount_string = amount_string.replace(/,/g, "");
            amount_string = Math.trunc(amount_string);

            console.log("Type amount string: " + typeof amount_string);
            console.log(
              "Type paragraph amounts: " + typeof paragraph_amounts[r]
            );

            $("#graphic-up-count-" + i).append(
              "<div id='graphic-up-count-grid-" +
                r +
                "'class='graphic-up-count-grid'>" +
                "<div  class='up-count-amount' id='up-count-amount-" +
                r +
                "'><div class='amount' id='amount-graphic-" +
                i +
                "-count-up-" +
                r +
                "'><div id='amount-graphic-" +
                i +
                "-count-up-" +
                r +
                "-sufix" +
                "' class='sufix'>" +
                sufix +
                "</div></div></div> <div class='up-count-concept' id='up-count-concept-" +
                r +
                "'>" +
                paragraph_concepts[r] +
                "</div></div>"
            );

            var amount_string_size = amount_string.toString().length;
            console.log(amount_string_size);

            for (o = 0; o < amount_string_size; o++) {
              let div = "#amount-graphic-" + i + "-count-up-" + r;
              $(div).append(
                "<div id='amount-graphic-" +
                  i +
                  "-count-up-" +
                  r +
                  "-digit-" +
                  o +
                  "'>0</div>"
              );
            }
            const number_array = amount_string.toString().split("");

            for (o = 0; o < number_array.length; o++) {
              let div =
                "#amount-graphic-" + i + "-count-up-" + r + "-digit-" + o;
              number = number_array[o];
              console.log(number);

              countTo(div, number);
            }
          }
        } else {
          $("#box").append(
            "<div id='graphic-" +
              i +
              "'class='graphic'><div id='graphic-header-" +
              i +
              "'class='graphic-header'>" +
              title +
              "</div><canvas id='graphic-canvas-" +
              i +
              "'class='graphic-canvas'></canvas> <div id='graphic-footer-" +
              i +
              "'class='graphic-footer'>" +
              body +
              " </div> </div>"
          );

          /* REST Paragraphs +++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
          var paragraph_lenght = Object.keys(
            node_data.field_data_paragraph
          ).length;

          console.log("Exiten: " + paragraph_lenght + " parejas de datos! ");

          for (var k = 0; k < paragraph_lenght; k++) {
            var target_id = node_data.field_data_paragraph[k].target_id;

            var paragraph_response = await fetch(
              "http://localhost/vehicle-fleet/web/entity/paragraph/" +
                target_id +
                "?_format=json"
            );
            var paragraph_data = await paragraph_response.json();

            console.log(
              "Request: " +
                (k + 1) +
                " ||   Concept: " +
                paragraph_data.field_concept[0].value +
                "| Amount: " +
                paragraph_data.field_amount[0].value
            );

            paragraph_concepts[k] = paragraph_data.field_concept[0].value;
            paragraph_amounts[k] = paragraph_data.field_amount[0].value;
            /* var concept = JSON.stringify(node_data.title[0].value).replace(
                    /["]+/g,
                    ""
                ); */
          }

          console.log(paragraph_concepts);
          console.log(paragraph_amounts);
          /* End REST Paragraphs *++++++++++++++++++++++++++++++++++++++++++++++++++++*/

          /* for (var j = 0; j < concepts_length; j++) {
            concepts[j] = node_data.field_concept[j].value;
          }

          for (var j = 0; j < concepts_length; j++) {
            amounts[j] = node_data.field_amount[j].value;
          } */

          var index = i;
          var default_colors = ["red", "green", "blue", "orange", "brown"];

          var california = [
            "#f9cb9c",
            "#274e13",
            "#f38f18",
            "#eeeeee",
            "#ebcc00",
          ];

          var georgia = ["#9ec367", "#e87851", "#f3a65f", "#f4b59e", "#fac355"];

          var new_york = [
            "#acadb6",
            "#726890",
            "#382f3c",
            "#222222",
            "#020202",
          ];

          var texas = ["#0660a9", "#ffffff", "#b80a0a", "#ffffff", "#888888"];

          var alabama = ["#2ec58f", "#7a339c", "#20e3a8", "#0e85d6", "#00dacf"];

          var florida = ["#dbd1ba", "#59b2bf", "#5d6aa7", "#df982c", "#4fa161"];

          var new_mexico = [
            "#c9976d",
            "#464f2d",
            "#c96235",
            "#e7ebec",
            "#3786c1",
          ];

          var arizona = ["#888580", "#b9a79d", "#b7b5b2", "#c4b9b5", "#dededc"];

          switch (graph_styles) {
            case "Default":
              colors = default_colors;
              break;
            case "California":
              colors = california;
              break;
            case "Georgia":
              colors = georgia;
              break;
            case "New York":
              colors = new_york;
              break;
            case "Texas":
              colors = texas;
              break;
            case "Alabama":
              colors = alabama;
              break;
            case "Florida":
              colors = florida;
              break;
            case "New Mexico":
              colors = new_mexico;
              break;
            case "Arizona":
              colors = arizona;
              break;
            default:
              colors = default_colors;
          }

          switch (graph_type) {
            case "bar":
              var animation = {
                backgroundColor: {
                  type: "color",
                  duration: 5000,
                  easing: "linear",
                  from: "blue",
                  to: "red",
                  loop: true,
                },
              };
              break;
            case "":
              var animation = {
                backgroundColor: {
                  type: "color",
                  duration: 2000,
                  easing: "linear",
                  from: "blue",
                  to: "red",
                  loop: true,
                },
              };
              break;

            case "":
              var animation = {
                tension: {
                  duration: 1000,
                  easing: "linear",
                  from: 1,
                  to: 0,
                  loop: true,
                },
              };
              break;
            case "":
              var animation = {
                tension: {
                  duration: 1000,
                  easing: "linear",
                  from: 1,
                  to: 0,
                  loop: true,
                },
              };
              break;
            case "":
              var animation = {
                tension: {
                  duration: 1000,
                  easing: "linear",
                  from: 1,
                  to: 0,
                  loop: true,
                },
              };
              break;
            case "":
              var animation = {
                tension: {
                  duration: 1000,
                  easing: "linear",
                  from: 1,
                  to: 0,
                  loop: true,
                },
              };
              break;
            case "line":
              var animation = {
                tension: {
                  duration: 1000,
                  easing: "linear",
                  from: 1,
                  to: 0,
                  loop: true,
                },
              };
              break;
            default:
              var animation = {
                duration: 1000,
                easing: "linear",
                from: 1,
                to: 0,
                loop: true,
              };
          }
          var axis = true;
          if (
            graph_type == "pie" ||
            graph_type == "polarArea" ||
            graph_type == "doughnut"
          ) {
            axis = false;
          }

          new Chart("graphic-canvas-" + index++, {
            type: graph_type,
            data: {
              labels: paragraph_concepts, //concepts,
              datasets: [
                {
                  label: title.replace(/["]+/g, ""),
                  data: paragraph_amounts, //amounts,
                  borderWidth: 3,
                  backgroundColor: colors,
                },
              ],
            },
            options: {
              animations: animation,
              scales: {
                x: {
                  stacked: true,
                  display: axis,
                },
                y: {
                  display: axis,
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    callback: function (value, index, ticks) {
                      return sufix + value;
                      /* return sufix + value; */
                      /*  switch (sufix) {
                        case "None":
                          return "" + value;
                          break;
                        case "US$":
                          return "US$ " + value;
                          break;
                        case "MUS$":
                          return "MUS$ " + value;
                          break;
                        case "$EURO":
                          return "$EURO " + value;
                          break;
                        case "$MEURO":
                          return "$MEURO " + value;
                          break;
                        case "$MXN":
                          return "$MXN " + value;
                          break;
                        case "$MMXN":
                          return "$MMXN " + value;
                          break;
                        case "%":
                          return "% " + value;
                          break;
                        case "m":
                          return "m " + value;
                          break;
                        case "yd":
                          return "yd " + value;
                          break;
                        case "ft":
                          return "ft " + value;
                          break;
                        case "in":
                          return "in " + value;
                          break;
                        case "lb":
                          return "lb " + value;
                          break;
                        case "oz":
                          return "oz " + value;
                          break;
                        case "gl":
                          return "gl " + value;
                          break;
                        case "Kilometers":
                          return "Kilometers " + value;
                          break;
                        case "Miles":
                          return "Miles " + value;
                          break;
                        case "Tons":
                          return "Tons " + value;
                          break;
                        case "Employees":
                          return "Employees " + value;
                          break;
                        case "Representatives":
                          return "Representatives " + value;
                          break;
                        case "Students":
                          return "Students " + value;
                          break;
                        case "Buildings":
                          return "Buildings " + value;
                          break;
                        case "Hospitals":
                          return "Hospitals " + value;
                          break;
                        case "Clinics":
                          return "Clinics " + value;
                          break;
                        case "Pieces":
                          return "Pieces " + value;
                          break;
                        case "Packages":
                          return "Packages " + value;
                          break;
                        case "Votes":
                          return "Votes " + value;
                          break;
                        default:
                          return sufix + value;
                      } */
                    },
                  },
                },
              },
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  charge_data();
});
/********************************************************************************************************
/* With hate, Mad Kitten. |******************************************************************************
ff -- **************************************************************************************************/
