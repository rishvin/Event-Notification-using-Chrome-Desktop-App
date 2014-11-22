(function(window) {

  function GetCreatePageParams() {
	return {
	  "textId"         : "text",
	  "datetimeId"     : "datetime",
	  "descId"         : "desc",
	  "uploadImageId"  : "upload",
	  "linkId"         : "textblock",
	  "linkURL"        : "#/done"
	};
  }

  function Controller(storage, fs, view) {
    this.storage = storage;
	this.fs = fs;
    this.view = view;
	this.count = 0;
	this.eventName = undefined;
    this.contentHolder = $$('#content');
	document.addEventListener("storageWritten", this.ShowLastEvent.bind(this));
	document.addEventListener("fsWritten", this.ShowLastEvent.bind(this));
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
	  App.Util.SetMsg("error", "date and time must be greater than current time");
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
	if(image == undefined) {
      var obj = {"alarmId": alarmId, "this": this};
	  image = new Image();
	  image.src = "images/default.png";
	  image.onload = (function() {
		var blob = App.Util.ReturnBlob(image);
		obj.this.fs.SaveFile(obj.alarmId, blob)
	  }).bind(obj);
	}
	else {
	  var blob = App.Util.ReturnBlob(image);
	  this.fs.SaveFile(alarmId, blob);
	}
  }

  Controller.prototype.EventHook = function(e){
	var src = App.Util.GetSource(e.target.parentElement.href);
	if(src == "create") {

	  this.contentHolder.innerHTML = this.view.CreatePage(GetCreatePageParams());
	  $("a")[0].addEventListener('click', this.EventHook.bind(this));
	}
	else if(src == "done") {
	  this.CreateEvent();
	}
	else if(src == "show") {
		this.ShowAllEvents();
	}
	e.preventDefault();
  }

  Controller.prototype.ShowAllEvents = function() {
	this.contentHolder.innerHTML = "";
	this.storage.DumpData(
	  (function (data) {
		var obj = {};
		obj.data = data;
		obj.this = this;
		this.fs.GetFile(
		  data.name,
		  (function (file) {
			obj.this.contentHolder.innerHTML += obj.this.view.DispEvent(
			  {
			    "textId" : "textblock",
				"text"   : Date(obj.data.timestamp) + '<br>' + obj.data.description,
				"imgUrl" : file
			  }
			);
			obj.count++;
		  }).bind(obj),
		  function (e) {console.error("Error:", e); }
		  )
	  }).bind(this)
	);
	App.Util.SetMsg("error", "events created will be displayed below");
  }

  Controller.prototype.ShowLastEvent = function(e) {
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
			  obj.this.contentHolder.innerHTML = obj.this.view.CreatePage(GetCreatePageParams());
			  obj.this.contentHolder.innerHTML += obj.this.view.Header(
			    {
				  "textId" : "textblock",
				  "text"   : "last event created"
				}
		      );
			  obj.this.contentHolder.innerHTML += obj.this.view.DispEvent(
			    {
				  "textId" : "textblock",
				  "text"   : Date(obj.data.timestamp) + '<br>' + obj.data.description,
				  "imgUrl" : file
				}
			  );
			  $("a")[0].addEventListener('click', obj.this.EventHook.bind(obj.this));
			}).bind(obj),
			function (e) {console.error("Error:", e); }
		  )
		}).bind(this)
	  )
	  this.eventName = undefined;
	}
  }

  window.App.Controller = Controller;
})(window);