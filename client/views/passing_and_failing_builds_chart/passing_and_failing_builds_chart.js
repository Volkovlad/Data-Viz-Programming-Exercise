Template.passingAndFailingBuilds.onRendered( function () {
	var passed = Builds.find({'summary_status':'passed'}).fetch(),
		failed = Builds.find({'summary_status':'failed'}).fetch();

    $.jqplot('builds-pie-chart', [[['Passed',passed.length],['Failed',failed.length]]], {
        grid: {
            drawBorder: false, 
            drawGridlines: false,
            background: '#ffffff',
            shadow:false
        },
        seriesDefaults:{
            renderer:$.jqplot.PieRenderer,  
            rendererOptions: { padding: 8, showDataLabels: true }
        },
        legend:{
            show:true,  
            rendererOptions: {
                numberRows: 1
            }, 
            location:'s',
            marginTop: '15px'
        }       
    });
});