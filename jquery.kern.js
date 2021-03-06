(function() {
  'use strict';
  var $, defaults, kern;

  $ = jQuery;

  defaults = {
    letters: true,
    words: true,
    transform: true,
    tag: '<span/>',
    prefix: 'kern',
    undo: true,
    filter: function() {
      return this.nodeType === 3 && /\S/.test(this.nodeValue);
    }
  };

  kern = function(options) {
    var letters, settings, split, words;
    settings = $.extend({}, this.kern.defaults, options);
    kern = function() {
      var text;
      text = $(this);
      if (settings.words) {
        text = text.map(function() {
          return words(this);
        });
      }
      if (settings.letters) {
        text = text.map(function() {
          return letters(this);
        });
      }
      return text;
    };
    words = function(node) {
      var index, match, whitespace, _results;
      $(node).wrap($(settings.tag, {
        "class": "" + settings.prefix + "-words"
      }));
      _results = [];
      while ((match = /\S+(\s+)?$/.exec(node.nodeValue)) != null) {
        index = match.index, whitespace = match[1];
        if (whitespace != null) {
          node.splitText(node.nodeValue.length - whitespace.length);
        }
        _results.push(split(node, index, "" + settings.prefix + "-word"));
      }
      return _results;
    };
    letters = function(node) {
      var index, _results;
      $(node).wrap($(settings.tag, {
        "class": "" + settings.prefix + "-letters"
      }));
      index = node.nodeValue.length;
      _results = [];
      while (--index >= 0) {
        _results.push(split(node, index, "" + settings.prefix + "-letter"));
      }
      return _results;
    };
    split = function(node, index, prefix) {
      var wrapper;
      node = node.splitText(index);
      if (settings.transform) {
        wrapper = $(node).wrap($(settings.tag)).parent();
        wrapper.attr('class', "" + prefix + " " + prefix + "-" + (wrapper.prop('outerText')));
      } else {
        $(node).wrap($(settings.tag, {
          "class": "" + prefix + " " + prefix + "-" + node.nodeValue
        }));
      }
      return node;
    };
    if (settings.undo) {
      this.find("." + settings.prefix + "-words, ." + settings.prefix + "-letters").replaceWith(function() {
        return $(this).text();
      });
    }
    this.addClass("" + settings.prefix + "-kerned").find(":not(iframe)").addBack().contents().filter(settings.filter).map(kern);
    return this;
  };

  $.extend(kern, {
    defaults: defaults
  });

  $.fn.extend({
    kern: kern
  });

}).call(this);