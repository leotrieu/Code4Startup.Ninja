'use strict';

// app.factory('Dashboard', function(FURL, $firebase, $q) {

// [AngularFire 1.1.2]
app.factory('Dashboard', function(FURL, $q, $firebaseArray) {

	var ref = new Firebase(FURL);

	var Dashboard = {
		
		getTasksForUser: function(uid) {
			var defer = $q.defer();

			// $firebase(ref.child('user_tasks').child(uid))
			// 	.$asArray()

			// [AngularFire 1.1.2]
			$firebaseArray(ref.child('user_tasks').child(uid))				
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