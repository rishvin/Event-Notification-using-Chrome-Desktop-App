var space = 50 * 1024 * 1024;

function CreateNotification(content) {
  var opt = {
    type: "basic",
    title: "Notification",
    message: String(content.msg),
    iconUrl: content.file
  };
  var id = "NOTIF" + new Date().getTime();
  chrome.notifications.create(id, opt, function(id){
    console.log("Trigerred notification: ", content.id);
  });
}

function Notification() {
  this.name   = undefined;
  this.msg  = undefined;
  this.file = undefined;
}

Notification.prototype.ReadAndSpawn = function (file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = (function(e) {
    this.file = reader.result;
    CreateNotification(this);
  }).bind(this);
}

function ProcessRest(instance) {
  window.webkitRequestFileSystem(
    PERSISTENT,
    space,
    (function(fs) {
      fs.root.getFile(
       instance.name,
       {},
       (function (fileEntry) {
         console.log("FileEntry: ", fileEntry);
         fileEntry.file(instance.ReadAndSpawn.bind(instance), function(e) {console.error(e);});
       }).bind(instance),
       (function(e) {
         console.log("Image not found creating notification without image");
         CreateNotification(instance);
       }).bind(instance)
      )
    }).bind(instance)
  );
}

function ProcessAlarm(key) {
  chrome.storage.local.get(key, function(data) {
    var content = data[key][0];
    console.log("Retreived data: ", content);
    var instance = new Notification();
    instance.name = content.name;
    instance.msg = content["description"];
    ProcessRest(instance);
  });
}

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'bounds': {
      'width': 600,
      'height': 600
    },
    "resizable": false
  });
});

chrome.alarms.onAlarm.addListener(function(alm) {
  console.log("Alarm trigerred with alarm id:", alm.name);
  ProcessAlarm(alm.name);
});