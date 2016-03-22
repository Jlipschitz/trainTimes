var trainData = new Firebase("https://jlipschitzfire.firebaseio.com/");

var trainEngine = {
    clearTrainInput: function() {
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#frequency").val("");
    },
}

$(document).ready(function() {
    $("#addNewTrain").on("click", function() {

        var getTrainInput = {
            newTrain: $("#trainName").val().trim(),
            newDestination: $("#destination").val().trim(),
            newFirstTrain: $("#firstTrain").val().trim(),
            newFrequency: $("#frequency").val().trim()
        }

        console.log("added" + getTrainInput.newTrain, getTrainInput.newDestination,
            getTrainInput.newFirstTrain, getTrainInput.newFrequency)

        var newTrain = {
            train: getTrainInput.newTrain,
            destination: getTrainInput.newDestination,
            initialHour: getTrainInput.newFirstTrain[0] + getTrainInput.newFirstTrain[1],
            initialMinutes: getTrainInput.newFirstTrain[3] + getTrainInput.newFirstTrain[4],
            frequency: getTrainInput.newFrequency
        }
        console.log(newTrain.initialHour)
        console.log(newTrain.initialMinutes)


        trainData.push(newTrain)

        trainEngine.clearTrainInput();

        return false;
    });

    trainData.on("child_added", function(childSnapshot, prevChildKey) {

        trainDataEngine = {

            getTrain: childSnapshot.val().train,
            getDestination: childSnapshot.val().destination,
            getInitialHour: childSnapshot.val().initialHour,
            getInitialMinutes: childSnapshot.val().initialMinutes,
            getFrequency: childSnapshot.val().frequency,

            appendToPage: function() {
                $("#trainTable > tbody").append("<tr><td>" + trainDataEngine.getTrain + "</td><td>" + trainDataEngine.getDestination + "</td><td>" + trainDataEngine.getFrequency + "</td><td>" + getNextArrival + "</td><td>" + getMinutesAway + "</td></tr>");
            },
            updateToPage: function() {
                $("<td>").text(trainDataEngine.getTrain)
                $("#data2").text(trainDataEngine.getDestination)
                $("#data3").text(trainDataEngine.getFrequency)
                $("#data4").text(getNextArrival)
                $("#data5").text(getMinutesAway)
            }

        }

        console.log(childSnapshot.val());
        console.log("initial log of train time " + trainDataEngine.getInitialHour + trainDataEngine.getInitialMinutes)

        //use current day (assume)
        var now = new Date();
        var currentDay = moment(now).format('YYYY-MM-DD')

        //combine currentday with user time
        var combine = JSON.stringify(currentDay);
        console.log("timeNow" + now)
        combine = moment(combine).set('hour', trainDataEngine.getInitialHour);
        combine = moment(combine).set('minute', trainDataEngine.getInitialMinutes);

        //calculate next arrival time (use add)
        var getNextArrival = moment(combine).format("hh:mm a");
        console.log("get nextArrival : " + getNextArrival)

        //console.log(getNextArrival)
        //calculate how many minutes away
        var minuteDifference = moment.duration(combine.diff(now));
        var getMinutesAway = minuteDifference.minutes();
        console.log("need to change " + getMinutesAway)

        if (getMinutesAway === 0) {
            getNextArrival = moment(combine).add(trainDataEngine.getFrequency, 'minutes').format("hh:mm a")
            console.log("arrival inside if " + getNextArrival)

            minuteDifference = moment.duration(combine.diff(now));
            getMinutesAway = minuteDifference.minutes();
            console.log("need to change ++++++ " + getMinutesAway)
            console.log("getMinutesAway ==== 0")
        }

        trainDataEngine.appendToPage();
        setInterval(function() { trainDataEngine.updateToPage(); }, 1000);
        //increment time variables when a minute has passed

    });

    //add background slideshow
    $.backstretch([
        "http://wallpapercave.com/wp/R5ngRiR.jpg", "https://images6.alphacoders.com/400/400666.jpg", "https://images7.alphacoders.com/357/357382.jpg"
    ], { duration: 7000, fade: 750 });
});