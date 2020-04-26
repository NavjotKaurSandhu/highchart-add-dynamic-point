import * as Highcharts from "highcharts";
import timeline from "highcharts/modules/timeline";
import Exporting from "highcharts/modules/exporting";
import xrange from "highcharts/modules/xrange";

Exporting(Highcharts);
timeline(Highcharts);
xrange(Highcharts);

Highcharts.chart("container", {
  chart: {
    type: "xrange",
    events: {
      load() {
        let chart = this;
        // Set initial flag for all points
        chart.series[0].points.forEach(p => {
          p.clicked = false;
        });
      }
    }
  },

  plotOptions: {
    series: {
      states: {
        inactive: {
          opacity: 1
        }
      }
    }
  },

  xAxis: {
    type: "datetime",
    opposite: true
  },
  yAxis: {
    categories: ["Prototyping", "Development", "Testing"],
    reversed: true
  },
  series: [
    {
      name: "Project 1",
      borderColor: "gray",
      pointWidth: 20,
      data: [
        {
          x: Date.UTC(2014, 10, 21),
          x2: Date.UTC(2014, 11, 2),
          y: 0,
          events: {
            click() {
              let point = this,
                chart = this.series.chart,
                newSeries = [
                  {
                    name: "test1",
                    type: "scatter",
                    id: point.id,
                    yPos: point.y + 1,
                    color: "red",
                    data: [
                      {
                        x: Date.UTC(2014, 10, 22),
                        y: point.y + 1,
                        marker: {
                          symbol: "square"
                        }
                      },
                      {
                        x: Date.UTC(2014, 10, 25),
                        y: point.y + 1,
                        marker: {
                          symbol: "triangle"
                        }
                      },
                      {
                        x: Date.UTC(2014, 10, 15),
                        y: point.y + 1,
                        marker: {
                          symbol: "triangle"
                        }
                      }
                    ]
                  },
                  {
                    name: "test2",
                    type: "scatter",
                    id: point.id,
                    yPos: point.y + 2,
                    color: "blue",
                    data: [
                      {
                        x: Date.UTC(2014, 10, 10),
                        y: point.y + 2,
                        marker: {
                          symbol: "square"
                        }
                      },
                      {
                        x: Date.UTC(2014, 10, 20),
                        y: point.y + 2,
                        marker: {
                          symbol: "triangle"
                        }
                      },
                      {
                        x: Date.UTC(2014, 10, 30),
                        y: point.y + 2,
                        marker: {
                          symbol: "triangle"
                        }
                      }
                    ]
                  }
                ];

              !point.clicked
                ? showTasks(newSeries, point)
                : hideTasks(newSeries, point, catName, seriesYpos);
            }
          }
        },
        {
          x: Date.UTC(2014, 10, 30),
          x2: Date.UTC(2014, 11, 1),
          y: 0,
          color: "blue",
          partialFill: 0.25
        },
        {
          x: Date.UTC(2014, 11, 2),
          x2: Date.UTC(2014, 11, 5),
          y: 1,
          events: {
            click() {
              let point = this,
                chart = this.series.chart,
                catName = "collapsed2",
                seriesYpos = point.y + 1,
                newSeries = [
                  {
                    name: "test3",
                    type: "scatter",
                    color: "blue",
                    yPos: point.y + 1,
                    id: point.id,
                    data: [
                      {
                        x: Date.UTC(2014, 10, 25),
                        y: point.y + 1,
                        marker: {
                          symbol: "square"
                        }
                      }
                    ]
                  },
                  {
                    name: "test4",
                    type: "scatter",
                    yPos: point.y + 1,
                    id: point.id,
                    color: "red",
                    data: [
                      {
                        x: Date.UTC(2014, 10, 30),
                        y: point.y + 1,
                        marker: {
                          symbol: "triangle"
                        }
                      }
                    ]
                  }
                ];

              !point.clicked
                ? showTasks(newSeries, point, catName, seriesYpos)
                : hideTasks(newSeries, point, catName, seriesYpos);
            }
          }
        },
        {
          x: Date.UTC(2014, 11, 8),
          x2: Date.UTC(2014, 11, 9),
          y: 2
        }
      ]
    }
  ]
});

function showTasks(newSeries, point) {
  var series = point.series,
    chart = series.chart,
    newYCat = [...chart.yAxis[0].categories];

  // Set points to higher y to make a space for collapsed points
  chart.series.forEach(s => {
    s.points.forEach(p => {
      if (p.y > point.y) {
        const x = p.x;
        const y = p.y;
        p.update(
          {
            x: x + 1,
            y: y + 1
          },
          false, false
        );
        // p.update({ y: p.y + 1 },
        //   true,
        //   true
        // );
      }
    });
  });
  newSeries.forEach((s, index) => {
    // Add collapsed series
    newYCat.splice(point.y + 1, 0, s.name);
    // chart.addSesries(s);
    chart.series[0].addPoint({type: 'timeline', x: s.name, y: 0})
    // chart.series[0].addPoint(s);
    // chart.series[0].data.splice(point.y + 1, 0, s);
  });
  // chart.addSeries({data: [...newSeries], index: 0});
  // Set point flag
  point.clicked = true;
  // Add the series name to the yAxis cat array
  /* newYCat.splice(seriesYpos, 0, catName); */
  // Update the yAxis
  chart.yAxis[0].update({
    categories: newYCat,
    plotLines: [
      {
        color: "#FF0000",
        width: 2
      }
    ]
  });
  /* chart.xAxis[0].update({
  series: [...newSeries];
  }) */
}

function hideTasks(newSeries, point, catName, seriesYpos) {
  let series = point.series,
    chart = series.chart,
    newYCat = [...chart.yAxis[0].categories];

  chart.series.forEach(s => {
    s.points.forEach(p => {
      if (p.y > point.y) {
        p.update(
          {
            y: p.y - 1
          },
          false,
          false
        );
      }
    });
  });

  chart.series.forEach(s => {
    if (s.userOptions.id === point.id) {
      console.log("test");
      setTimeout(() => {
        s.destroy();
      }, 50);
    }
  });

  point.clicked = false;

  newYCat.splice(seriesYpos, 1);
  chart.yAxis[0].update({
    categories: newYCat
  });
}
