module.exports = {


  friendlyName: 'Upload multiple files',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: function (inputs, exits) {
      inputs.file('file1').upload({
    // don't allow the total upload size to exceed ~10MB
    maxBytes: 10000000
  },function whenDone(err, uploadedFiles) {
    if (err) {
      return exits.serverError(err);
    }
    
    // If no files were uploaded, respond with an error.
    if (uploadedFiles.length === 0){
      return exits.badRequest('No file was uploaded');
    }
    return exits.success();
  })}


};
