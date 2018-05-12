var imageProcessEngine = require("../processors/ImageProcessingEngine.js");
/**
 * UploadControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
processUploadedFiles = function(files, data) {
    var processResults = imageProcessEngine.processFiles(files, data);
    var fileResults = {};
    processResults.forEach(function(processResult){
        processResult.fileResults.forEach(function(fileResult){
            var filename = fileResult.filename;
            if (undefined === fileResults[filename]) {
                fileResults[filename] = {
                    processResults:[]
                };
            }
            fileResults[filename].processResults.push(fileResult);
        });
        
    });
    console.log("File results:" + fileResults);
    for (filename in fileResults) {
        fileResults[filename].riskFactor = getWeight(fileResults[filename]);
    }
    
    return fileResults;
}

var getWeight = function(fileResult) {
        
        return Math.random();
}

module.exports = {
    uploadMultipleFiles : function (req, res) {
        req.file('claimDoc').upload({
            // don't allow the total upload size to exceed ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.serverError(err);
            }
            //Get date input
            var dateToCompare = new Date();
            var processResults = processUploadedFiles(uploadedFiles, {
                dateToCompare: dateToCompare
            });
            return res.view("layouts/fileRisks", {
                fileResults: processResults,
                files: uploadedFiles
            });
        })
    }
};