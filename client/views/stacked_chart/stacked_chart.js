var buildChart = function(startDate, endDate, abnormalPercent) {
    var chart, createdAt, dates, uniqDates, createArrayForChart,
        passedBuildsArrOfObj=[], failedBuildsArrOfObj=[], passedBuildsForChart=[],
        failedBuildsForChart=[], data=[], allBuilds;

    //get all builds, filtered by 'start' and 'end' date
    //and by build status
    //Array of objects
    allBuilds = Builds.find({
        'summary_status':{
            $in:['passed','failed']
        },
        'created_at' : {
            $gte : startDate,
            $lt: endDate
        }
    }).fetch();

    //get an Array of 'created_at' values
    createdAt = _.pluck(allBuilds, 'created_at');

    //get an Array of dates without time
    dates = _.map(createdAt, function(date){  
        var d = moment(date).toISOString().split('T');
        return d[0];
    });

    //get an Array of unique dates for building chart (used as 'ticks')
    uniqDates = _.uniq(dates);

    createArrayForChart = function(obj, arrayOfObjects, arrayForChart){
        if(arrayOfObjects.length !== 0 && moment(_.last(arrayOfObjects).created).isSame(obj.created) ){
            // increase value
            _.last(arrayForChart)[0]+=1;
        } else {
            // find position where it should be rendered
            var index = _.indexOf(uniqDates, obj.created);

            //push object into Array for 'record keeping'
            arrayOfObjects.push(obj);

            // index+1 because we don't have 'zero' position
            arrayForChart.push([obj.count, index+1])
        }
    };
    _.each(allBuilds, function(build){
        var d = moment(build.created_at).toISOString().split('T');

        //create an object for params and for 'record keeping'
        var obj = {
            created: d[0], 
            status: build.summary_status, 
            count: 1
        };

        if(build.summary_status === 'failed'){
            createArrayForChart(obj, failedBuildsArrOfObj, failedBuildsForChart);
        } else {
            createArrayForChart(obj, passedBuildsArrOfObj, passedBuildsForChart);
        }
    });

    if(passedBuildsForChart.length > 0){
        data.push(passedBuildsForChart);
    }

    if(failedBuildsForChart.length > 0){
        data.push(failedBuildsForChart);

        _.each(failedBuildsForChart, function(fail){
            var buildCounts,
                acceptable,
                index = fail[1] - 1; //get real index, not position

            _.each(passedBuildsForChart, function(pass){
                // if passed and failed builds are on the same position
                // sum them to get builds per day
                if(pass[1] === fail[1]){
                    //Count of builds per day
                    buildCounts = pass[0] + fail[0];
                }
            });

            if(!buildCounts){
                buildCounts = fail[0]
            }

            // count acceptable percentage of abnormal builds
            acceptable = buildCounts/100*abnormalPercent;

            if(acceptable < fail[0]){
                //mark day as abnormal
                uniqDates[index]= 'Abnormal ' + uniqDates[index];
            }
        })

    }

    if(!data.length){
        alertify.alert('There is no data for this period of time');
        return;
    }

    // data - Array of Arrays of Arrays:)
    // consists of series of passed [[value, position], [value, position]]
    // and failed builds [[value, position], [value, position]]
    // finally [[[passedValue, position], [passedValue, position]],[[failedValue, position]]]
    // Demonstrate example on http://www.jqplot.com/examples/barTest.php
    chart = $.jqplot('stacked-chart', data, {
        stackSeries: false,
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            shadowAngle: 135,
            rendererOptions: {
                barDirection: 'horizontal'  
            },
            pointLabels: {
                show: true, 
                formatString: '%d'
            }
        },
        legend: {
            renderer: $.jqplot.EnhancedLegendRenderer,
            rendererOptions: {
                numberRows: 1
            },
            show: true,
            location: 'n',
            placement: 'outside',
            showLabels: true,
            fontSize: '16px',
            labels:['Passed', 'Failed']
        },
        axes: {
            yaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: uniqDates
            },
            xaxis: {
                min:0
            }
        }
    });

    chart.replot();
};

Template.stackedChart.onRendered( function () {
    this.$('.start-date').datetimepicker({
        format:'YYYY-MM-DD'
    });

    this.$('.end-date').datetimepicker({
        format:'YYYY-MM-DD'
    });
    
    this.$('.slider').slider();
});

Template.stackedChart.events({
    'click .build-chart': function (){
        var abnormalPercent = $('input.slider').val(),
            startDate = $('.set-start-date').val(),
            endDate = $('.set-end-date').val(),
            start,
            end;

        if(startDate && endDate){
            start = new Date(startDate);
            //small defect. Should add 23h 59m 59s
            end = new Date(moment(endDate, 'YYYY-MM-DD').add(1,'day'));
            buildChart(start, end, abnormalPercent);
        } else {
            alertify.error('Please, set "Start Date" and "End Date"');
        }
    }
});