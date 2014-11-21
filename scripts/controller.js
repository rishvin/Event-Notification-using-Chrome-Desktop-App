(function(window) {

  function Controller(storage, fs, view) {
    this.storage = storage;
	this.fs = fs;
    this.view = view;
	this.count = 0;
	this.eventName = undefined;
    this.contentHolder = $$('#content');
	document.addEventListener("storageWritten", this.ShowEvents.bind(this));
	document.addEventListener("fsWritten", this.ShowEvents.bind(this));
  }

  Controller.prototype.CreateEvent = function() {
	var datetime = App.Util.GetValue("datetime");
	console.log("Datetime: ", datetime);
	if(datetime == "") {
		App.Util.SetMsg("error", "date and time is invalid");
		return;
	}
  	var tstamp = App.Util.GetTimeStamp(datetime);
  	if(App.Util.TimestampValid(tstamp) == false) {
  	  // Check how to solve this problem
  	  //this.view.Error("Date and time must be greater than current timestamp");
	  App.Util.SetMsg("error", "date and time must be grater than current timestamp");
  	  return;
  	}
  	var desc = App.Util.GetValue("desc");
  	if(desc == "") {
	  App.Util.SetMsg("error", "description cannot be empty");
  	  return;
  	}
  	var alarmId = "ALM" + App.Util.GetTimeStamp("");
  	chrome.alarms.create(alarmId, {when: tstamp});
  	this.storage.SaveData(alarmId, {"name":alarmId, "timestamp":tstamp, "description":desc});
	var image = $$("#upload").files[0];
	if(image != undefined) {
	  var blob = App.Util.ReturnBlob(image);
	  this.fs.SaveFile(alarmId, blob);
	}
  }

  Controller.prototype.EventHook = function(e){
	var src = App.Util.GetSource(e.target.parentElement.href);
	if(src == "create") {
		var opts = {
			"textId"         : "text",
			"datetimeId"     : "datetime",
			"descId"         : "desc",
			"uploadImageId"  : "upload",
			"linkId"         : "textblock",
			"linkURL"         : "#/done"
		};
	  this.contentHolder.innerHTML = this.view.CreatePage(opts);

		var opts2 = {
			"textId" : "textblock",
			"text" : "testing",
			"imgUrl": "Capture.png"
		};
		$("a")[0].addEventListener('click', this.EventHook.bind(this));
	}
	else if(src == "done") {
	  this.CreateEvent();
	}
	else if(src == "show") {
		this.ShowEvents(last_name);
	}
	e.preventDefault();
  }

  Controller.prototype.ShowEvents = function(e) {
	  switch (e.type) {
		  case "storageWritten" :
			  this.count++;
			  this.eventName = e.detail;
			  break;
		  case "fsWritten" :
			  this.count++;
	  }
	  if (this.count == 2) {
		  this.count = 0;
		  this.storage.GetData(
			  this.eventName,
			  (function (data) {
				  console.log("came to data:", data);
				  var obj = {};
				  obj.data = data;
				  obj.this = this;
				  this.fs.GetFile(
					  data.name,
					  (function (file) {
						  var opts = {
							  "textId" : "textblock",
							  "text" : Date(obj.data.timestamp) + '<br>' + obj.data.description,
							  "imgUrl": file
						  };
						  obj.this.contentHolder.innerHTML += obj.this.view.DispEvent(opts);

					  }).bind(obj),
					  function (e) {
						  console.error("Error:", e);
					  }
				  )
			  }).bind(this)
		  )
		  this.eventName = undefined;
	  }
  }
  window.App.Controller = Controller;
})(window);