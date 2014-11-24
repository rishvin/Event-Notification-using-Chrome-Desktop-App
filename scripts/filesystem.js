(function(window) {
  var Fs = function() {
    this.space = 50 * 1024 * 1024;
    this.InitFs();
    this.fs = undefined;
    this.RequestFs();
    console.log(this.fs);
  }

  Fs.prototype.Error = function(e) {
    console.error("Error: ", e);
  }

  Fs.prototype.End = function(e) {
    console.log("Write End: ", e);
    var event = new Event("fsWritten");
    document.dispatchEvent(event);
  }

  Fs.prototype.InitFs = function() {
    window.webkitStorageInfo.requestQuota(
      window.PERSISTENT,
      this.space,
      function(bytes) {
        console.log("Allocated ", bytes, "bytes");
      },
      function(err) {
        console.error(err);
      });
  }

  Fs.prototype.RequestFs = function() {
    window.webkitRequestFileSystem(
      PERSISTENT,
      this.space,
      (function(fs) { this.fs = fs; }).bind(this)
    );
  }

  Fs.prototype.Write = function(fileWriter) {
    fileWriter.onwriteend = this.End;
    fileWriter.onerror = this.Error;
    fileWriter.write(this.data);
    console.log("Data written: ", this.data);
    delete this.data;
  }

  Fs.prototype.SaveFile = function(name, data) {
    this.data = data;
    this.fs.root.getFile(
       name,
       {create: true, exclusive: true},
       (function (fileEntry) {
         fileEntry.createWriter(this.Write.bind(this), this.Error.bind(this));
       }).bind(this)
    );
  }

  Fs.prototype.GetFile = function(name, callback) {
    this.fs.root.getFile(
        name,
        {},
        (function(fileEntry){
          fileEntry.file((function(file){
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function(e) {
              console.log("File Url: ", this.result);
              callback(this.result);
            }
            }).bind(callback)
          )
        }).bind(callback),
        function(e){ console.error(e); }
    )
  }

  Fs.prototype.RemoveFile = function(name) {
    this.fs.root.getFile(
        name,
        {},
        (function(fileEntry){
          fileEntry.remove(function(){
            console.log("File removed");
          })
        }),
        function(e){ console.error(e); }
    )
  }

  window.App.Fs = Fs;
})(window);