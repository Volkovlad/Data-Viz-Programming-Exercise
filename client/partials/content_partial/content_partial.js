Template.contentPartial.helpers({
	'showTemplate':function() {
		return Session.get('currentTemplate');
	},

	'showChartTitle': function() {
		switch (Session.get('currentTemplate')){
			case 'passingAndFailingBuilds':
				return 'Passing And Failing Builds Overall Pie Chart';
			case 'stackedChart':
				return 'Passing And Failing Builds Stacked Chart';
			case 'buildDurationVsTimeChart':
				return 'Builds Duration Vs Time Line Chart';
			default:
				return 'Welcome'								
		}
	}
});
