var processFiles = function (files, data) {
	const shell = require('shelljs');
	const fs = require('fs')
	var response = [];
	for (var i = files.length - 1; i >= 0; i--) {
		var path = files[i].fd
		var name = getFileName(path)
		shell.exec("cd /Users/$USER/SafetHackthon/ && python3 classify_images_updated.py " + path + "&& python3 cluster_vectors.py")
        var temp = JSON.parse(fs.readFileSync("/Users/sarrafp/SafetHackthon/nearest_neighbors/" + name + ".json", "utf-8"))
        var finalResult = []
        for(var row of temp) {
        	if(row.filename !== name) {
        		finalResult.push(row)
        	}
        }
        console.log(files[i])
        response.push({
        	filename: files[i].filename,
            similarity: finalResult
        })
	}
	console.log(response)

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
