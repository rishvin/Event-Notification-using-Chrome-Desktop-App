(function(window) {
  window.$ = document.querySelectorAll.bind(document);
  window.$$ = document.querySelector.bind(document);
  
  window.App.Util = {};
  
  App.Util.GetTimeStamp = function(datetime) {
    if(datetime == ""){
      return new Date().getTime();
    }

    var date = new Date(datetime);
    return date.getTime() + date.getTimezoneOffset() * 60000;
  }

  App.Util.TimestampValid = function(t1) {
    return t1 >= (new Date()).getTime();
  }

  App.Util.GetSource= function(src) {
    return src.substring(src.lastIndexOf("/") + 1);
  }

  App.Util.ReturnBlob = function(data) {
    return new Blob([data], {type: "image/png"});
  }

  App.Util.GetValue = function(id) {
    return $$("#" + id).value;
  }

  App.Util.SetValue = function(id, value) {
    $$("#" + id).value = value;
  }

  App.Util.SetMsg = function(id, innerHTML) {
    $$("#" + id).innerHTML = "<strong>" + innerHTML + "</strong>";
  }

  App.Util.Replace = function(str, opts) {
    var temp = str;
    for(prop in opts) {
      temp = temp.replace(prop, opts[prop]);
    }
    return temp;
  }

  App.Util.AddListenerToType = function(eleType, evType, range, callback) {
    for(var i = range[0]; i <= range[1]; ++i) {
      $(eleType)[i].addEventListener(evType, callback);
    }
  }

  App.Util.GetLink = function(target) {
    var ele = target;
    while(ele.href == undefined) {
      ele = ele.parentElement;
    }
    return ele.href;
  }

  App.Util.GetElementFromIdRule = function(target, rule) {
    var ele = target;
    while(ele == undefined || rule(ele.id) == false) {
      ele = ele.parentElement;
    }
    return ele;
  }

  App.Util.GenerateCanvas = function() {
    var canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 100, 100);
    return canvas;
  }

})(window);