
var processFiles = function(files, data) {
    var fileResults = [];
    files.forEach(function(file){
        var softwareName = getSoftwareName(file.fd);
        var riskClass = sails.config.hackathon.riskClasses.none;
        var riskTitle = "Image Tampering";
        var riskMessage = "No image editing software fingerprint found";
        if (undefined !== softwareName && softwareName.length > 0) {
            //risky image
            riskClass = sails.config.hackathon.riskClasses.high;
            riskMessage = "Found fingerprints of an image editing software"
        }
        
        fileResults.push({
            filename: file.filename,
            software: softwareName,
            riskClass: riskClass,
            riskTitle: riskTitle,
            riskMessage: riskMessage,
            processName: "softwareStamp"
        });
        
    });
    return {
        fileResults: fileResults
    };
}

var tamperingSoftwaresList = [
    "photoshop"
];

var isTamperSoftwareFound = function(softwareName) {
    var softwareLCase = softwareName.toLowerCase();
    var tamperSoftwareFound = false;
    tamperingSoftwaresList.forEach(function(knownSofwareName){
        if (softwareLCase.includes(knownSofwareName)) {
            tamperSoftwareFound = true;
        }
    });
    return tamperSoftwareFound;
}
var getSoftwareName = function(fd) {
    const { spawnSync } = require('child_process');
    var filename = fd;
    const cmd = spawnSync('java', ['-jar', './jars/workspace.jar','softwares',filename]);
    var softwareFoundObj = {};
    try {
        console.log("software output:" + cmd.stdout);
        softwareFoundObj = JSON.parse(cmd.stdout);
    } catch (err) {
        console.error("Error while gettin gdates: " + err);
    }
    var softwareName = softwareFoundObj.Software;
    if (softwareName !== undefined) {
        var softwareLcase = softwareName.toLowerCase();
        if (isTamperSoftwareFound(softwareName)) {
            return softwareName;
        }
    }
    return "";
}
module.exports = {
    process:processFiles
}
