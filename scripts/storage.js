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
      var data = [];
      for(prop in content[key]) {
        data.push(content[key][prop]);
      }
      callback(data);
    }).bind(key));
  }

  Storage.prototype.DumpData = function(callback) {
    chrome.storage.local.get(function(content) {
      var data = [];
      for(prop in content) {
        for(ele in content[prop]) {
          data.push(content[prop][ele]);
        }
      }
      callback(data);
    });
  }

  Storage.prototype.RemoveData = function(key, callback) {
    chrome.storage.local.remove(key, callback);
  }

  window.App.Storage = Storage;
})(window);