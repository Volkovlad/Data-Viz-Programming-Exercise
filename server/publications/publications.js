Meteor.publish('builds', function () {
  return Builds.find();
});