$(document).ready(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDxdbNZ57tTz29eZ1Nqxq2nNICR22swGEY",
    authDomain: "trainscheduler-d869c.firebaseapp.com",
    databaseURL: "https://trainscheduler-d869c.firebaseio.com",
    projectId: "trainscheduler-d869c",
    storageBucket: "trainscheduler-d869c.appspot.com",
    messagingSenderId: "161359891836"
  };
  firebase.initializeApp(config);

	var database = firebase.database();

	//Add form data to Firebase when "submit" is clicked
	$("#add-train").click(function () {

		event.preventDefault();

		var name = $("#name-input").val().trim();
		var destination = $("#destination-input").val().trim();
		var time = $("#first-train-time-input").val().trim();
		var frequency = $("#frequency-input").val().trim();

		database.ref("trainlog").push({
		name: name,
		dest: destination,
		time: time,
		freq: frequency,
		});
	//Reset forms
		$("input").val('');

	});
	//When an objet child is pushed to the database this function is called
	database.ref("trainlog").on("child_added", function(childSnapshot) {
		//Set our working variables to the last child object added to the database
		var name = childSnapshot.val().name;
		var destination = childSnapshot.val().dest;
		var time = childSnapshot.val().time;
		var frequency = childSnapshot.val().freq;
		//Parse the frequency into an integer
		var frequency = parseInt(frequency);
		//Moment is a function from jsdeliver that gets the current time
		var currentTime = moment();
		//Subtract a year from the moment object to get hour and minute
		var timeFormat = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');

		var trainTime = moment(timeFormat).format('HH:mm');

		var timeConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');

		var timeDifference = moment().diff(moment(timeConverted), 'minutes');

		var timeRemainder = timeDifference % frequency;

		var minsAway = frequency - timeRemainder;

		var nextTrain = moment().add(minsAway, 'minutes');
		//Append data to the proper tables
		$('#currentTime').text(currentTime);
		$('#trainTable').append(
				"<tr><td>" + childSnapshot.val().name +
				"</td><td>" + childSnapshot.val().dest +
				"</td><td>" + childSnapshot.val().freq +
				"</td><td>" + moment(nextTrain).format("HH:mm") +
				"</td><td>" + minsAway  + ' minutes until arrival' + "</td></tr>");
	},
		function(errorObject) { 
		console.log("Read failed: " + errorObject.code);

	});

});
