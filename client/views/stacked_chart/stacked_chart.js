var buildChart = function(startDate, endDate, abnormalPercent) {
    var chart, createdAt, dates, uniqDates, createArrayForChart,
        testPassed=[],testFailed=[], passed=[], failed=[], data=[],
        all = Builds.find({
            'summary_status':{
                $in:['passed','failed']
            },
            'created_at' : { 
                $gte : startDate, 
                $lt: endDate    
            }
        }).fetch();

    createdAt = _.pluck(all, 'created_at');

    dates = _.map(createdAt, function(date){  
        var d = moment(date).toISOString().split('T');
        return d[0];
    });

    uniqDates = _.uniq(dates);

    createArrayForChart = function(obj, arrayOfObjects, arrayForChart){
        if(arrayOfObjects.length !== 0 && moment(_.last(arrayOfObjects).created).isSame(obj.created) ){
            _.last(arrayForChart)[0]+=1;
        } else {
            var index = _.indexOf(uniqDates, obj.created);
            arrayOfObjects.push(obj);
            arrayForChart.push([obj.count, index+1])
        }
    }
    _.each(all, function(build){
        var d = moment(build.created_at).toISOString().split('T');
        var obj = {
            created: d[0], 
            status: build.summary_status, 
            count: 1
        };

        if(build.summary_status === 'failed'){
            createArrayForChart(obj, testFailed, failed);
        } else {
            createArrayForChart(obj, testPassed, passed);
        }
    });

    if(passed.length > 0){
        data.push(passed);
    }
    if(failed.length > 0){
        data.push(failed);

        _.each(failed, function(fail){
            var buildCounts,
                acceptable,
                index = fail[1] - 1;

            _.each(passed, function(pass){
                if(pass[1] === fail[1]){
                    //Count of builds per day
                    buildCounts = pass[0] + fail[0];
                }
            });
            
            if(!buildCounts){
                buildCounts = fail[0]
            }

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

    chart = $.jqplot('stacked-chart', data, {
        stackSeries: false,
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            shadowAngle: 135,
            rendererOptions: {
                barDirection: 'horizontal',  
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
}

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
            end = new Date(moment(endDate, 'YYYY-MM-DD').add(1,'day'));
            buildChart(start, end, abnormalPercent);
        } else {
            alertify.error('Please, set "Start Date" and "End Date"');
        }
    }
});