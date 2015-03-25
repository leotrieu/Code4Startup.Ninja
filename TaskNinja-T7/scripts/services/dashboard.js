'use strict';

app.factory('Dashboard', function(FURL, $firebase, $q) {
	var ref = new Firebase(FURL);

	var Dashboard = {
		
		getTasksForUser: function(uid) {
			var defer = $q.defer();

			$firebase(ref.child('user_tasks').child(uid))
				.$asArray()
				.$loaded()
				.then(function(tasks) {					
					defer.resolve(tasks);
				}, function(err) {
					defer.reject();
				});

			return defer.promise;
		}
	};

	return Dashboard;
});