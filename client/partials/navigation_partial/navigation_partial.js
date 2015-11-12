Session.set('currentTemplate','welcome');

Template.navigationPartial.events({
	'click .passing': function() {
		Session.set('currentTemplate','passingAndFailingBuilds');
	},
	'click .stacked': function() {
		Session.set('currentTemplate','stackedChart');
	},
	'click .duration': function() {
		Session.set('currentTemplate','buildDurationVsTimeChart');
	},
});