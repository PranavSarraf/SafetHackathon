var processFiles = function (files, data) {
	const shell = require('shelljs');
	const fs = require('fs')
	var response = [];

	for(var file of files) {
		var path = file.fd
		var name = getFileName(path)
		shell.exec("python3 classify_images_updated.py " + path)
		console.log("Done classify_images_updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
	}
	console.log("Custering Running!!!!!!!!!!!!")
	shell.exec("python3 cluster_vectors.py")
	console.log("Custering Done!!!!!!!!!!!!")
	for (var i = files.length - 1; i >= 0; i--) {
		var path = files[i].fd
		var name = getFileName(path)
		try {
		var temp = JSON.parse(fs.readFileSync("./nearest_neighbors/" + name + ".json", "utf-8"))
        } catch (err) {
            console.error("It seems that similarity magic failed to complete.")
            temp = [];
        }	
        var finalResult = []
        for(var row of temp) {
        	if(row.filename !== name) {
        		finalResult.push(row)
        		console.log(JSON.stringify(row))
        	}
        }
        var riskClass = sails.config.hackathon.riskClasses.none;
        var riskTitle = "Image Similarity";
        var riskMessage = "Didn't find any similar image"
        //TODO change risk class and message  based on similarity % of highest match
        console.log(files[i])
        console.log(JSON.stringify(finalResult))
        response.push({
        	filename: files[i].filename,
            similarity: finalResult,
            riskClass: riskClass,
            riskTitle: riskTitle,
            riskMessage: riskMessage,
            processName: "imageSimilarity",
        })
	}
	console.log(JSON.stringify(response))

	return {fileResults: response};
}

function getFileName(path) {
	var slash = path.lastIndexOf("/") + 1;
	var dot = path.lastIndexOf(".")
	return path.substr(slash, dot - slash)
}
module.exports = {
    process:processFiles
}
