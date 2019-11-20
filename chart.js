var timeFormat = "MM/DD/YYYY HH:mm";

colArr = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
];

function bits2mbits(value) {
    return (value / 1000 / 1000).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " mbit/s";
}

function float2ms(value) {
    return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ms";
}

$(document).ready(function() {
    var tests = {};
    colorIdx = 0;

    var jsonData = $.ajax({
        url: './data.json',
        dataType: 'text',
        error: function(req, err) {
            console.log('Error loading config.json: ' + err);
        }
    }).done(function(results) {
        // Split the JSON lines, parse them and put
        // data into the correct tests mapping
        var lines = results.split('\n');
        $.each(lines, function(n, elem) {
            if (elem.length < 1) {
                return
            }
            o = JSON.parse(elem);


            console.log(o);
            key = o.server.host;
            if (tests.hasOwnProperty(key) == false) {
                console.log("adding " + key);

                color = colArr[colorIdx];

                tests[key] = {};
                tests[key]['upload'] = {
                    label: 'Up ' + o.server.sponsor + " (" + o.server.name + ", " + o.server.country + ")",
                    borderColor: color,
                    backgroundColor: color,
                    fill: false,
                    data: [],
                    yAxisID: "y-axis-mbit"
                };
                tests[key]['download'] = {
                    label: 'Down ' + o.server.sponsor + " (" + o.server.name + ", " + o.server.country + ")",
                    borderColor: color,
                    backgroundColor: color,
                    fill: false,
                    pointStyle: 'star',
                    data: [],
                    yAxisID: "y-axis-mbit"
                };
                tests[key]['ping'] = {
                    label: 'Ping ' + o.server.sponsor + " (" + o.server.name + ", " + o.server.country + ")",
                    borderColor: color,
                    backgroundColor: color,
                    fill: false,
                    borderDash: [2, 2],
                    data: [],
                    yAxisID: "y-axis-ms"
                };

                colorIdx++;
            }
            z = tests[key]["upload"].data;
            z.push({
                x: new Date(o.timestamp),
                y: o.upload,
            });
            z = tests[key]["download"].data;
            z.push({
                x: new Date(o.timestamp),
                y: o.download,
            });
            z = tests[key]["ping"].data;
            z.push({
                x: new Date(o.timestamp),
                y: o.ping,
            });


            //      labels.push(new Date(o.timestamp));
            /*      upload.push(o.upload);
                  download.push(o.download);
                  ping.push(o.ping);*/
        });

        console.log(tests);

        //    var labels = [], upload=[], download=[], ping=[];
        //    results.forEach(function(d) {
        //    labels.push(new Date(d.timestamp));
        //  upload.push(d.upload);
        //      download.push(d.download);
        //    ping.push(d.ping);
        // });

        //    $("#details").html('<h3>speedtest-cli from ' + results[0].client.ip + ' hosted by ' + results[0].client.isp + ' (' + results[0].client.country + ')</h3>');

        /*   label_upload = "(" + results[0].server.sponsor + ").upload";
           label_download = "download.{" + results[0].server.sponsor + "}";
           label_ping = "ping:" + results[0].server.sponsor +"";*/

        // Convert the tests to a dataset for Chart
        var datasets = [];
        $.each(tests, function(k, v) {
            $.each(v, function(key, value) {
                console.log(key + ": " + value);
                datasets.push(value);
            });
        });

        //label_upload="meh";
        //label_download="hhihi";
        //label_ping="kake";

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                //          labels: labels,
                datasets: datasets,
                /*
                            datasets: [
                              {
                                label: label_upload,
                                borderColor: window.chartColors.green,
                                backgroundColor: window.chartColors.green,
                                fill: false,
                                data: upload,
                                yAxisID: "y-axis-mbit"
                              },
                              {
                                label: label_download,
                                borderColor: window.chartColors.blue,
                                backgroundColor: window.chartColors.blue,
                                fill: false,
                                data: download,
                                yAxisID: "y-axis-mbit"
                              },
                              {
                                label: label_ping,
                                borderColor: window.chartColors.yellow,
                                backgroundColor: window.chartColors.yellow,
                                fill: false,
                                borderDash: [2, 2],
                                data: ping,
                                yAxisID: "y-axis-ms"
                              }

                            ]*/
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        id: 'y-axis-mbit',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return bits2mbits(value);
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'bandwidth'
                        }
                    }, {
                        id: 'y-axis-ms',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return float2ms(value);
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'latency'
                        }

                    }],
                    xAxes: [{
                        type: "time",
                        time: {
                            format: timeFormat,
                            //            round: 'day',
                            displayFormats: {
                                'day': 'MMM DD',
                            },
                            tooltipFormat: "ll HH:mm"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Date"
                        },
                        ticks: {
                            maxRotation: 0
                        }
                    }],
                },


                pan: {
                    enabled: true,
                    mode: "x",
                    speed: 10,
                    threshold: 10
                },
                zoom: {
                    enabled: true,
                    drag: false,
                    mode: "x",
                    limits: {
                        max: 10,
                        min: 0.5
                    },
                    speed: 0.3,
                }


            }, // options

        });


        // So we can access this instance later.
        $('#myChart').data("storedChart", myChart);
    });

});




$("#btnAll").click(function() {
    $("#myChart").data('storedChart').data.datasets.forEach(function(ds) {
        ds.hidden = false;
    });
    $("#myChart").data('storedChart').update();
});


$("#btnToggle").click(function() {
    $("#myChart").data('storedChart').data.datasets.forEach(function(ds) {
        ds.hidden = !ds.hidden;
    });
    $("#myChart").data('storedChart').update();
});

$("#btnOnlyDownload").click(function() {
    $("#myChart").data('storedChart').data.datasets.forEach(function(ds) {
        console.log(ds.label);
        if (ds.label.startsWith("Down ")) {
            ds.hidden = false;
        } else {
            ds.hidden = true;
        }
    });
    $("#myChart").data('storedChart').update();
});

$("#btnOnlyUpload").click(function() {
    $("#myChart").data('storedChart').data.datasets.forEach(function(ds) {
        console.log(ds.label);
        if (ds.label.startsWith("Up ")) {
            ds.hidden = false;
        } else {
            ds.hidden = true;
        }
    });
    $("#myChart").data('storedChart').update();
});

$("#btnOnlyPing").click(function() {
    $("#myChart").data('storedChart').data.datasets.forEach(function(ds) {
        console.log(ds.label);
        if (ds.label.startsWith("Ping ")) {
            ds.hidden = false;
        } else {
            ds.hidden = true;
        }
    });
    $("#myChart").data('storedChart').update();
});
