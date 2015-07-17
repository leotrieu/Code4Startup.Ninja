{
    "rules": {
      "notifications": {
        ".read": true,
        ".write": true
      },

      "comments": {
        ".read": true,

        "$task_id": {

          ".validate": "root.child('tasks/'+$task_id).exists()",

          "$comment_id": {
            ".write": "auth != null && !data.exists()",

            ".validate": "!data.exists()",

            "content": {
              ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 100"
            },

            "datetime": {
              ".validate": "newData.val() <= now"
            },

            "gravatar": {
              ".validate": "newData.isString() && newData.val().contains('https://www.gravatar.com/avatar/')"
            },

            "name": {
              ".validate": "newData.isString() && newData.val().length > 0 && root.child('profile/' + auth.uid + '/name').exists()"
            }
          }
        }
        
      },

      "offers": {
        ".read": true,

        "$task_id": {

          ".validate": "root.child('tasks/'+$task_id).exists()",

          "$offer_id": {
            // Case 1: Create Offer
            // Case 2: Runner cancel his offer
            // Case 3: Poster accept offer
            
            ".write": "(auth != null && !data.exists()) 
                      || (auth.uid === data.child('uid').val()) 
                      || (auth.uid === root.child('tasks/' + $task_id + '/poster').val())",

            "gravatar": {
              ".validate": "newData.isString() && newData.val().contains('https://www.gravatar.com/avatar/')"
            },

            "name": {
              ".validate": "newData.isString() && newData.val().length > 0 && root.child('profile/' + auth.uid + '/name').exists()"
            },

            "total": {
              ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() < 500"
            },

            "uid": {
              ".validate": "auth.uid === newData.val() && root.child('profile/' + newData.val()).exists()"
            },
            
            // Fixing Chinese security issue
            "accepted": {
              ".validate": "auth.uid === root.child('tasks/' + $task_id + '/poster').val()"
            }
          }
        }

      },

      "tasks": {
        ".read": true,

        "$task_id": {
          
          ".write": "auth != null",

          // Make sure that all 8 fields are present before creating a new task.
          ".validate": "newData.hasChildren(['title', 'description', 'total', 'status', 'gravatar', 'name', 'poster', 'datetime'])",

          "title": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 25"
          },

          "description": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 250"
          },

          "total": {
            ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() < 500"
          },

          "status": {
            ".validate": "newData.val() === 'open' || newData.val() === 'assigned' || newData.val() === 'completed'"
          },

          "gravatar": {
            ".validate": "newData.isString() && newData.val().contains('https://www.gravatar.com/avatar/')"
          },

          "name": {
            ".validate": "newData.isString() && newData.val().length > 0 && root.child('profile/' + auth.uid + '/name').exists()"
          },

          // Poster must be the current user and that user must be exists.
          "poster": {
            ".validate": "auth.uid === newData.val() && root.child('profile/' + newData.val()).exists()"
          },

          "datetime": {
            ".validate": "newData.val() <= now"
          }
        }

      },

      "profile": {
        ".read": true,

        "$uid": {
          ".write": "!data.exists() && auth.uid === $uid"
        }

      },

      "user_tasks": {
        "$uid": {
          
          // Only current user can see the data (in Dashboard)
          ".read": "auth != null && auth.uid === $uid",   
          
          ".validate": "root.child('profile/' + $uid).exists()",
          
          "$user_tasks_id": {
            ".write": "auth != null",
            
            // The data we're gonna save should never exists before.
            ".validate": "!data.exists()",
            
            "taskId": {
              ".validate": "root.child('tasks/' + newData.val()).exists()
                            // Only Poster (current user) can create record in this user_tasks node
                            && root.child('tasks/' + newData.val() + '/poster').val() === auth.uid"
            }
          }
        }

      },

      "$other": { ".validate": false }
    }
}