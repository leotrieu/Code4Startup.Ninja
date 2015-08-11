'use strict';

// app.factory('Comment', function(FURL, $firebase) {

// [AngularFire 1.1.2]
app.factory('Comment', function(FURL, $firebaseArray) {

	var ref = new Firebase(FURL);	

	var Comment = {
		comments: function(taskId) {
			// return $firebase(ref.child('comments').child(taskId)).$asArray();

			// [AngularFire 1.1.2]
			return $firebaseArray(ref.child('comments').child(taskId));
		},

		addComment: function(taskId, comment) {
			var task_comments = this.comments(taskId);
			comment.datetime = Firebase.ServerValue.TIMESTAMP;

			if(task_comments) {
				return task_comments.$add(comment);	
			}			
		}
	};

	return Comment;
});