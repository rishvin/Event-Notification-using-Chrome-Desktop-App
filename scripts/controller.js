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
		App.Util.SetMsg("error", "date and time are invalid");
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
	var image = $$("#upload").files[0];
	if(image == undefined) {
      /*
        var obj = {"alarmId": alarmId, "this": this};
	    var canvas = App.Util.GenerateCanvas();
	    image = new Image();
	    image.src = canvas.toDataURL("image/png");
	    image.onload = (function() {
		  var blob = App.Util.ReturnBlob(image);
		  obj.this.fs.SaveFile(obj.alarmId, blob)
	    }).bind(obj);
	  */
	  App.Util.SetMsg("error", "image not selected");
	  return;
	}
	chrome.alarms.create(alarmId, {when: tstamp});
	var blob = App.Util.ReturnBlob(image);
	this.fs.SaveFile(alarmId, blob);
  	this.storage.SaveData(alarmId, {"name":alarmId, "timestamp":tstamp, "description":desc});
	App.Util.SetMsg("error", "event can be removed by clicking on [X] button");
  }

  Controller.prototype.CbRemoveEvent = function() {
	chrome.alarms.clear(this.ele.id, function(isCleared){ console.log("Alarm cleared :", isCleared); });
	this.obj.fs.RemoveFile(this.ele.id);
	var divEle = App.Util.GetElementFromIdRule(this.ele, function(id) { return id.indexOf("divALM") != -1 });
	divEle.parentElement.removeChild(divEle);
  }

  Controller.prototype.EventHook = function(e){
	var src = App.Util.GetSource(App.Util.GetLink(e.target));
	if(src == "create") {
	  App.Util.SetMsg("error", "errors and messages will be displayed here");
	  this.contentHolder.innerHTML = this.view.CreatePage(GetCreatePageParams());
	  App.Util.AddListenerToType("a", "click", [0, $("a").length - 3], this.EventHook.bind(this));
	}
	else if(src == "done") {
	  this.CreateEvent();
	}
	else if(src == "show") {
	  this.ShowAllEvents();
	}
	else if(src == "delete") {
	  var ele = App.Util.GetElementFromIdRule(e.target, function(id) { return id.indexOf("ALM") != -1 });
	  this.storage.RemoveData(
		ele.id,
		this.CbRemoveEvent.bind(
		  {
		    "ele"  : ele,
		    "obj" : this
		  }
		)
	  )
	}
	e.preventDefault();
  }

  Controller.prototype.CbGetData = function(data) {

	if(data.length) {
	  App.Util.SetMsg("error", "event can be removed by clicking on [X] button");
	}
	else {
      App.Util.SetMsg("error", "no event to show");
	}

	for (var i = 0; i < data.length; ++i) {
	  this.contentHolder.innerHTML += this.view.DispEvent(
	    {
		  "divId"   : "div" + data[i].name,
		  "textId"  : "textblock",
		  "text"    : Date(data[i].timestamp) + '<br>' + data[i].description,
		  "imgUrl"  : "",
		  "imgId"   : "img" + data[i].name,
		  "linkId"  : data[i].name,
		  "linkUrl" : "#/delete"
		}
	  );
	}

	App.Util.AddListenerToType("a", "click", [0, $("a").length - 3], this.EventHook.bind(this));

	for(var i = 0; i < data.length; ++i) {
	  this.fs.GetFile(
	    data[i].name,
		(function (file) {
		  $$("#img" + this.name).src = file;
		}).bind(data[i]),
		function (e) { console.error("Error:", e); }
	  )
	}

  }

  Controller.prototype.ShowAllEvents = function() {
	this.contentHolder.innerHTML = "";
	this.storage.DumpData(this.CbGetData.bind(this));
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
	  this.contentHolder.innerHTML = this.view.CreatePage(GetCreatePageParams());
	  this.contentHolder.innerHTML += this.view.Header(
	    {
	      "textId" : "textblock",
		  "text"   : "last event created"
	   }
	  );
	  this.storage.GetData(this.eventName, this.CbGetData.bind(this));
	  this.eventName = undefined;
	}
  }

  Controller.prototype.DeleteEvent = function (e) {
		App.Util.SetMsg("error", "Clicked");
  }
  window.App.Controller = Controller;
})(window);