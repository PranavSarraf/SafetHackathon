
var processFiles = function(files, data) {
    var fileResults = [];
    var dateToCompare = data.dateToCompare;
    files.forEach(function(file){
        var dateRisk = getDateRisk(file, dateToCompare);
        var riskClass = sails.config.hackathon.riskClasses.none;
        var riskTitle = "Image Date";
        var riskMessage = "No sign of old date found";
        if (dateRisk.oldDatesFound.length > 0) {
            //risky image
            riskClass = sails.config.hackathon.riskClasses.high;
            riskMessage = "Found signs of image being older than return delivery"
        }
        fileResults.push({
            filename: file.filename,
            riskClass: riskClass,
            riskTitle: riskTitle,
            riskMessage: riskMessage,
            processName: "creationDate",
            dateRisk: dateRisk
        });
    });
    return {
        fileResults: fileResults
    };
}

var getDateRisk = function(file, dateToCompare) {
    var datesFound = getDatesFromMetadata(file.fd);
    var oldDatesFound = getOldDatesFound(datesFound, dateToCompare);
    var dt = new Date();
        return {
            filename: file.filename,
            dateCompared: dateToCompare,
            oldDatesFound: oldDatesFound
        }
}

var getOldDatesFound = function(datesFound, dateToCompare) {
    var oldDatesFound = [];
    for (dateTag in datesFound) {
        var dateFound = new Date(datesFound[dateTag]);
        if (dateFound.getTime() < dateToCompare.getTime()) {
            oldDatesFound.push({
                tag: dateTag,
                date: dateFound
            });
        }
    }
    return oldDatesFound;
}

var getDatesFromMetadata = function(fd) {
    const { spawnSync } = require('child_process');
    var filename = fd;
    const cmd = spawnSync('java', ['-jar', './jars/workspace.jar','dates',filename]);
    var datesFound = {};
    try {
        var datesFound = JSON.parse(cmd.stdout);
    } catch (err) {
        console.error("Error while gettin gdates: " + err);
    }
    return datesFound;
}
module.exports = {
    process:processFiles
}
