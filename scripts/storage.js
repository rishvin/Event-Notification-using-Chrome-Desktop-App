(function(window) {
  function Storage() {
  }
  Storage.prototype.SaveData = function (key, value) {
    chrome.storage.local.get(key, function(val) {
      var newContent = [];
      var content = val[key];
      if(content != undefined) {
        for(var props in content) {
          newContent.push(content[props]);
        }
      }
      newContent.push(value);
      var pair = {};
      pair[key] =newContent;
      chrome.storage.local.set(pair, (function() {
        console.log("Stored date :", pair);
        var event = new CustomEvent("storageWritten", {"detail":key});
        document.dispatchEvent(event);
      }).bind(key));
    });
  }
  Storage.prototype.GetData = function(key, callback) {
    chrome.storage.local.get(key, (function(content) {
      for(prop in content[key]) {
        callback(content[key][prop]);
      }
    }).bind(key));
  }
  Storage.prototype.DumpData = function(callback) {
    chrome.storage.local.get(function(content) {
      for(prop in content) {
        for(ele in content[prop]) {
          callback(content[prop][ele]);
        }
      }
    });
  }
  window.App.Storage = Storage;
})(window);