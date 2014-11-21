(function(window) {
  function EvNotifier() {
    this.view = new App.View();
    this.storage = new App.Storage();
    this.fs = new App.Fs();
    this.controller = new App.Controller(this.storage, this.fs, this.view);
  };
  var app = new EvNotifier();
  function EvHook(e) {
    app.controller.EventHook(e);
  };

  for (var i = 0; i < $("a").length; ++i) {
    $("a")[i].addEventListener('click', EvHook);
  }
})(window);
