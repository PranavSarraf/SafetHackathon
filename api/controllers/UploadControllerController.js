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
                    processResults:{}
                };
            }
            fileResults[filename].processResults[fileResult.processName] = fileResult;
        });
        
    });
    for (filename in fileResults) {
        fileResults[filename].riskClass = getWeight(fileResults[filename]);
    }
    
    return fileResults;
}

var getWeight = function(fileResult) {
    var isTampered = fileResult.processResults["softwareStamp"].software.length > 0;
    var isOldImage = fileResult.processResults["creationDate"].dateRisk.oldDatesFound.length > 0;
    var similarityList = fileResult.processResults["imageSimilarity"].similarity;
    var similarity = 0;
    
    if (similarityList.length > 0) {
        similarity = similarityList.similarity * 100;
    }
    var riskClasses = sails.config.hackathon.riskClasses;
    var riskClass = "";
    var riskPercentage = 0;
        if (isTampered || isOldImage || similarity == 100) {
            riskClass = riskClasses.high;
            riskPercentage = 100;
        } else if (similarity < 50) {
            riskClass = riskClasses.none;
            riskPercentage = 40;
        } else if (similarity < 85) {
            riskClass = riskClasses.low;
            riskPercentage = 66;
        } else {
            riskClass = riskClasses.medium;
            riskPercentage = 90;
        }
    return {
        className: riskClass,
        percentage: riskPercentage
    }
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
            var dateToCompare = new Date(Date.parse(req.param("returnDeliveryDate")));
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