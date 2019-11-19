function bits2mbits(value){
    return (value/1000/1000).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " mbit/s";
}

$(document).ready(function() {
  var jsonData = $.ajax({
      url: 'https://speedtest.secwiz.io/data.json',
      dataType: 'json',
      error: function(req, err){ console.log('Error loading data.json: ' + err); }
    }).done(function (results) {	

    console.log(results);

    // Split timestamp and data into separate arrays
    var labels = [], upload=[], download=[];
    results.forEach(function(d) {
      labels.push(d.timestamp);
      upload.push(d.upload);
      download.push(d.download);
    }); 

    $("#details").html('<h3>speedtest-cli@' + results[0].client.ip + ' (' + results[0].client.isp + '@' + results[0].client.country + ')</h3>');

	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
	  type: 'line',
	  data: {            
	    labels: labels,
	    datasets: [
	      { 
                label: "Upload",
                borderColor: window.chartColors.green,
                backgroundColor: window.chartColors.green,
                fill: false,
		data: upload,
                yAxisID: "y-axis-upload"
	      },
	      { 
                label: "Download",
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
                fill: false,
                data: download,
                yAxisID: "y-axis-download"
	      }

	    ]
	  },
          options: {
	    scales: {
	      yAxes: [{
		id: 'y-axis-download',
		type: 'linear',
		position: 'left',
	        ticks: {
		  beginAtZero: true,
      		  callback: function(value, index, values) {
		   return bits2mbits(value);
		  }
	        } 
	      }, {
		id: 'y-axis-upload',
		type: 'linear',
		position: 'right',
	        ticks: {
		  beginAtZero: true,
      		  callback: function(value, index, values) {
		   return bits2mbits(value);
		  }
	        } 
              }]
	    }
          }
	}); 
    });
});



