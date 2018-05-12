
var processFiles = function(files, data) {
    var fileResults = [];
    files.forEach(function(file){
        var softwareName = getSoftwareName(file.fd);
        if (softwareName.length > 0) {
            fileResults.push({
                filename: file.filename,
                software: softwareName
            });
        }
    });
    return {
        fileResults: fileResults
    };
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
    if (softwareFoundObj.Software !== undefined) {
        return softwareFoundObj.Software
    }
    return "";
}
module.exports = {
    process:processFiles
}
