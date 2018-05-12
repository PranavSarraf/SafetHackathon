var processors = [
    require("./CreationDateProcessor.js"),
    require("./SoftwareStampProcessor.js"),
    require("./ImageSimilarityProcessor.js")
];
var processFiles = function(fileNames, data) {
    var results = [];
    processors.forEach(function(processor){
        var result = processor.process(fileNames, data);
        results.push(result);
    });
    return results;
};

module.exports = {
    processFiles: processFiles
};