(function(window) {

  function View() {
  }

  View.prototype.TextTemplate = function() {
    return '<span id="{{id}}"><strong>{{text}}</strong></span>';
  }

  View.prototype.InputTemplate = function() {
    return '<input type={{type}} id="{{id}}" {{opts}}>';
  }

  View.prototype.TextAreaTemplate = function() {
    return '<textarea id="{{id}}" {{opts}}></textarea>';
  }

  View.prototype.LinkTemplate = function() {
    return '<a href="{{link}}">{{content}}</a>'
  }

  View.prototype.ImageTemplate = function() {
    return '<img src="{{link}}" {{opts}}>';
  }

  View.prototype.CreatePage = function(opts) {
    var text = App.Util.Replace(this.TextTemplate(), {"{{id}}": opts["textId"]});

    var page =
    '<div class="row-block">' +
      App.Util.Replace
      (
        text,
        {
          "{{text}}":"fields marked as * are manditory"
        }
      ) +
    '</div>' +
    '<div class="row">' +
      '<div class="col-left">' +
        App.Util.Replace
        (
          text,
          {
            "{{text}}":"when*"}
        ) +
      '</div>' +
      '<div class="col-right">' +
        App.Util.Replace
        (
          this.InputTemplate(),
          {
            "{{type}}":"datetime-local",
            "{{id}}":opts["datetimeId"],
            "{{opts}}":"name='datetime' value=' '"
          }
         ) +
      '</div>' +
    '</div>' +
    '<div class="row">' +
      '<div class="col-left">' +
        App.Util.Replace
        (
          text,
          {"{{text}}":"describe*"}
        ) +
      '</div>' +
      '<div class="col-right">' +
        App.Util.Replace
        (
          this.TextAreaTemplate(),
          {
            "{{id}}":opts["descId"],
            "{{opts}":"rows='4' cols='40'"
          }
        ) +
      '</div>' +
    '</div>' +
    '<div class="row">' +
      '<div class="col-left">' +
        App.Util.Replace(
          text,
          {
            "{{text}}":"image"
          }
        ) +
      '</div>' +
      '<div class="col-right">' +
        App.Util.Replace(
          this.InputTemplate(),
          {
            "{{type}}":"file",
            "{{id}}":opts["uploadImageId"],
            "{{opts}}":"name='upload'"
          }
        ) +
      '</div>' +
    '</div>' +
    '<div class="row-block">' +
        App.Util.Replace
        (
          this.LinkTemplate(),
          {
            "{{link}}":opts["linkURL"],
            "{{content}}":App.Util.Replace
                         (
                           this.InputTemplate(),
                           {
                             "{{id}}":opts["linkId"],
                             "{{opts}}":"name='done' value='Done' disabled"
                           }
                         )
          }
        )  +
    '</div>';
    return page;
  }

  View.prototype.DispEvent = function(opts) {
    var page =
      '<div class="row fill">' +
      App.Util.Replace
      (
           this.InputTemplate(),
           {
              "{{id}}":opts["textId"],
              "{{opts}}":"value='last event created' disabled"
           }
      )  +
      '</div>'+
      '<div class="row fill">' +
        '<div class="col-left">' +
          App.Util.Replace
          (
            this.ImageTemplate(),
            {
              "{{link}}":opts["imgUrl"],
              "{{opts}}":"width='50%' height='50%'"
            }
          ) +
        '</div>' +
        '<div class="col-right">' +
          App.Util.Replace
          (
            this.TextTemplate(),
            {
              "{{id}}": opts["textId"],
              "{{text}}":opts["text"]
            }
          ) +
        '</div>' +
      '</div>';
    return page;
  }
  window.App.View = View;
})(window);
	