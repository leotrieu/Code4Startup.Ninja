'use strict';

app.factory('Offer', function(FURL, $firebase, $q, Auth, Task) {
	var ref = new Firebase(FURL);
	var user = Auth.user;

	var Offer = {
		offers: function(taskId) {
			return $firebase(ref.child('offers').child(taskId)).$asArray();
		},

		makeOffer: function(taskId, offer) {
			var task_offers = this.offers(taskId);

			if(task_offers) {
				return task_offers.$add(offer);
			}
		},

		// This function is to check if the login user already made offer for this task.
		// This to prevent a user from offering more than 1.
		isOfferred: function(taskId) {

			if(user && user.provider) {
				var d = $q.defer();

				$firebase(ref.child('offers').child(taskId).orderByChild("uid")
					.equalTo(user.uid))
					.$asArray()
					.$loaded().then(function(data) {						
						d.resolve(data.length > 0);
					}, function() {
						d.reject(false);
					});

				return d.promise;
			}
			
		},

		isMaker: function(offer) {
			return (user && user.provider && user.uid === offer.uid);
		},

		getOffer: function(taskId, offerId) {
			return $firebase(ref.child('offers').child(taskId).child(offerId));
		},

		cancelOffer: function(taskId, offerId) {
			return this.getOffer(taskId, offerId).$remove();			
		},

		//-----------------------------------------------//

		acceptOffer: function(taskId, offerId, runnerId) {
			// Step 1: Update Offer with accepted = true
			var o = this.getOffer(taskId, offerId);
			return o.$update({accepted: true})
				.then(function() {				
						
					// Step 2: Update Task with status = "assigned" and runnerId
					var t = Task.getTask(taskId);			
					return t.$update({status: "assigned", runner: runnerId});	
				})
				.then(function() {					

					// Step 3: Create User-Tasks lookup record for use in Dashboard
					return Task.createUserTasks(taskId);
				});
		},

		notifyRunner: function(taskId, runnerId) {
			// Get runner's profile
			Auth.getProfile(runnerId).$loaded().then(function(runner) {
				var n = {
					taskId: taskId,
					email: runner.email,
					name: runner.name
				};

				// Create Notification and Zapier will delete it after use.
				var notification = $firebase(ref.child('notifications')).$asArray();
				return notification.$add(n);	
			});
		}

	};

	return Offer;

})