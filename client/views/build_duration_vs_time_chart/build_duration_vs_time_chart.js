var buildChart = function (startDate, endDate){
	var allBuilds, chart, chartArray = [];
	//get all builds, filtered by 'start' and 'end' date. Array of objects
	allBuilds = Builds.find({
		'created_at' : {
			$gte : startDate,
			$lt: endDate
		}
	}).fetch();

	_.each(allBuilds, function(build){
		//create Array of Arrays for chart. Each Array has 'date' and 'duration'
		var arr = [];
		arr[0] = build.created_at;
		arr[1] = build.duration;
		chartArray.push(arr);
	});

    if(!chartArray.length){
        alertify.alert('There is no data for this period of time');
        return;
    }

	chart = $.jqplot ('duration-chart', [chartArray], {
      	axesDefaults: {
        	labelRenderer: $.jqplot.CanvasAxisLabelRenderer
      	},
  		seriesDefaults: {
          	rendererOptions: {
              	smooth: true
          	}
      	},
      	axes: {
        	xaxis: {
		        renderer:$.jqplot.DateAxisRenderer,
		        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
        		tickOptions:{ 
          			formatString:'%y-%m-%d %#H:%M',
          			angle: -30
    			},
          		label: "Time",
          		pad: 0
        	},
	        yaxis: {
	          	label: "Duration"
	        }
      	}
    });

    chart.replot();
};

Template.buildDurationVsTimeChart.onRendered( function () {
	this.$('.start-date').datetimepicker({
		format:'YYYY-MM-DD'
	});

	this.$('.end-date').datetimepicker({
		format:'YYYY-MM-DD'
	});
});

Template.buildDurationVsTimeChart.events({
	'click .build-chart': function (){
		var startDate = $('.set-start-date').val(),
			endDate = $('.set-end-date').val(),
			start,
			end;

		if(startDate && endDate){
			start = new Date(startDate);
			//small defect. Should add 23h 59m 59s
			end = new Date(moment(endDate, 'YYYY-MM-DD').add(1,'day'));
			buildChart(start, end);
		} else {
			alertify.error('Please, set "Start Date" and "End Date"');
		}
	}
});