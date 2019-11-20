var timeFormat = "MM/DD/YYYY HH:mm";

function bits2mbits(value){
    return (value/1000/1000).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " mbit/s";
}

function float2ms(value){
    return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ms";
}

$(document).ready(function() {
  var jsonData = $.ajax({
      url: 'https://speedtest.secwiz.io/data.json',
      dataType: 'json',
      error: function(req, err){ console.log('Error loading data.json: ' + err); }
    }).done(function (results) {	

    console.log(results);

    // Split timestamp and data into separate arrays
    
    
    var labels = [], upload=[], download=[], ping=[];
    results.forEach(function(d) {
      labels.push(new Date(d.timestamp));
      upload.push(d.upload);
      download.push(d.download);
      ping.push(d.ping);
    }); 

    $("#details").html('<h3>speedtest-cli from ' + results[0].client.ip + ' hosted by ' + results[0].client.isp + ' (' + results[0].client.country + ')</h3>');

    label_upload = "(" + results[0].server.sponsor + ").upload"; 
    label_download = "download.{" + results[0].server.sponsor + "}";
    label_ping = "ping:" + results[0].server.sponsor +"";


	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
	  type: 'line',
	  data: {            
	    labels: labels,
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

	    ]
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
      xAxes: [
        {
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
        }
      ],
	    }
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
      mode: "xy",
      limits: {
        max: 10,
        min: 0.5
      }
    }

	}); 
    });
});



