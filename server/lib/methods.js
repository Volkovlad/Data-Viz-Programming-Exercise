Meteor.methods({
    //aggregation; not used in code
    getBuilds: function() {
        return Builds.aggregate(
           [
              {
                $group : {
                   _id : { 
                       month: { $month: "$created_at" }, 
                       day: { $dayOfMonth: "$created_at" }, 
                       year: { $year: "$created_at" },
                       status: '$summary_status'
                       },
                    count: { $sum: 1 }
                }
              }
              
           ]
        );
    }
});