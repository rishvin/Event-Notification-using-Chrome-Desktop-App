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

})(window);