(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cell, Grid, algorithms,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

algorithms = {
  life: function(c, alive) {
    var cell, i, len, livingNeighbors;
    livingNeighbors = 0;
    for (i = 0, len = c.length; i < len; i++) {
      cell = c[i];
      if (cell) {
        livingNeighbors += 1;
      }
    }
    if ((alive && (livingNeighbors === 2 || livingNeighbors === 3)) || (!alive && livingNeighbors === 3)) {
      return true;
    } else {
      return false;
    }
  }
};

Cell = (function() {
  function Cell() {
    this.alive = false;
    this.age = 0;
  }

  Cell.prototype.copyTo = function(target) {
    target.alive = this.alive;
    return target.age = this.age;
  };

  return Cell;

})();

Grid = (function() {
  function Grid(context, width, height, cellWidth, cellHeight, cellSpacing) {
    this.context = context;
    if (cellWidth == null) {
      cellWidth = 5;
    }
    if (cellHeight == null) {
      cellHeight = 5;
    }
    if (cellSpacing == null) {
      cellSpacing = 1.2;
    }
    this.initialize = bind(this.initialize, this);
    this.info = {
      rows: height,
      columns: width,
      cell: {
        width: cellWidth,
        height: cellHeight,
        spacing: cellSpacing
      }
    };
    this.current = [];
    this.next = [];
    this.initialize(this.current);
    this.initialize(this.next);
    console.log(this.current);
  }

  Grid.prototype.update = function(algo) {
    var c, cell, chunk, col, i, j, k, n, r, ref, ref1, ref2, results, row;
    for (row = i = 0, ref = this.info.rows; 0 <= ref ? i <= ref : i >= ref; row = 0 <= ref ? ++i : --i) {
      for (col = j = 0, ref1 = this.info.columns; 0 <= ref1 ? j <= ref1 : j >= ref1; col = 0 <= ref1 ? ++j : --j) {
        cell = this.current[row][col];
        n = {
          left: (col > 1 ? col - 1 : this.info.columns),
          right: (col + 1) % this.info.columns,
          above: (row > 1 ? row - 1 : this.info.rows),
          below: (row + 1) % this.info.rows
        };
        chunk = [this.current[n.above][n.left].alive, this.current[n.above][col].alive, this.current[n.above][n.right].alive, this.current[row][n.left].alive, this.current[row][n.right].alive, this.current[n.below][n.left].alive, this.current[n.below][col].alive, this.current[n.below][n.right].alive];
        this.next[row][col].alive = algo(chunk, cell.alive);
        if (this.current[row][col].alive && this.current[row][col].alive === this.next[row][col].alive) {
          this.next[row][col].age += 1;
        } else {
          this.next[row][col].age = 0;
        }
      }
    }
    results = [];
    for (r = k = 0, ref2 = this.info.rows; 0 <= ref2 ? k <= ref2 : k >= ref2; r = 0 <= ref2 ? ++k : --k) {
      results.push((function() {
        var l, ref3, results1;
        results1 = [];
        for (c = l = 0, ref3 = this.info.columns; 0 <= ref3 ? l <= ref3 : l >= ref3; c = 0 <= ref3 ? ++l : --l) {
          results1.push(this.next[r][c].copyTo(this.current[r][c]));
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Grid.prototype.initialize = function(cells) {
    var col, i, ref, results, row;
    results = [];
    for (row = i = 0, ref = this.info.rows; 0 <= ref ? i <= ref : i >= ref; row = 0 <= ref ? ++i : --i) {
      cells.push([]);
      results.push((function() {
        var j, ref1, results1;
        results1 = [];
        for (col = j = 0, ref1 = this.info.columns; 0 <= ref1 ? j <= ref1 : j >= ref1; col = 0 <= ref1 ? ++j : --j) {
          results1.push(cells[row].push(new Cell()));
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Grid.prototype.draw = function(cWidth, cHeight, cSpacing) {
    var col, ctx, i, ref, results, row;
    ctx = this.context;
    results = [];
    for (row = i = 0, ref = this.info.rows; 0 <= ref ? i <= ref : i >= ref; row = 0 <= ref ? ++i : --i) {
      results.push((function() {
        var j, ref1, results1;
        results1 = [];
        for (col = j = 0, ref1 = this.info.columns; 0 <= ref1 ? j <= ref1 : j >= ref1; col = 0 <= ref1 ? ++j : --j) {
          if (this.current[row][col].alive) {
            ctx.fillStyle = "rgb(" + (255 - String(this.current[row][col].age * 5)) + ", " + (String(this.current[row][col].age * 20)) + ", " + (String(this.current[row][col].age * 10)) + ")";
            results1.push(ctx.fillRect((col * cWidth) * cSpacing, (row * cHeight) * cSpacing, cWidth, cHeight));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  return Grid;

})();

module.exports = {
  algorithms: algorithms,
  Cell: Cell,
  Grid: Grid
};


},{}],2:[function(require,module,exports){
var App, life, util;

life = require("./life.coffee");

util = require("./util.coffee");

App = (function() {
  function App() {
    this.paused = false;
    this.dom = this.getDomElements();
    this.canvas = document.getElementById("life-canvas");
    this.context = this.canvas.getContext("2d");
    this.view = new util.View(this);
    this.resizeCanvas();
    this.grid = this.initializeGrid(5, 5);
  }

  App.prototype.start = function() {
    this.bindViewEvents(this.view.e);
    this.bindButtonEvents(this.dom.buttons);
    return this.initializeLoop(50);
  };

  App.prototype.resizeCanvas = function() {
    var h;
    h = window.innerHeight - this.dom.toolbar.height() - 50;
    this.dom.canvas.height(h);
    this.context.canvas.width = this.dom.container.width();
    return this.context.canvas.height = h;
  };

  App.prototype.initializeGrid = function(rows, cols) {
    return new life.Grid(this.context, this.context.canvas.width / cols, Math.floor(this.context.canvas.height / rows));
  };

  App.prototype.getDomElements = function() {
    return {
      container: $(".main"),
      toolbar: $("nav"),
      canvas: $("#life-canvas"),
      buttons: {
        pause: $(".pause"),
        clear: $(".clear-board")
      }
    };
  };

  App.prototype.bindButtonEvents = function(buttons) {
    buttons.pause.click((function(_this) {
      return function(e) {
        if (_this.paused) {
          _this.paused = false;
          return $(e.target).removeClass("glyphicon-play").addClass("glyphicon-pause");
        } else {
          _this.paused = true;
          return $(e.target).removeClass("glyphicon-pause").addClass("glyphicon-play");
        }
      };
    })(this));
    return buttons.clear.click((function(_this) {
      return function() {
        _this.resizeCanvas();
        return _this.grid = _this.initializeGrid(5, 5);
      };
    })(this));
  };

  App.prototype.bindViewEvents = function(viewEvents) {
    viewEvents.on("mousedown", (function(_this) {
      return function(e) {
        return _this.grid.current[Math.floor(e.mouse.y / 5)][Math.floor(e.mouse.x / 5)].alive = true;
      };
    })(this));
    viewEvents.on("mousemove", (function(_this) {
      return function(e) {
        if (e.mouse.down) {
          return _this.grid.current[Math.floor(e.mouse.y / 5)][Math.floor(e.mouse.x / 5)].alive = true;
        }
      };
    })(this));
    return viewEvents.on("mousewheel", (function(_this) {
      return function(e) {
        if (e.up) {
          return _this.view.zoom((e.mouse.x + _this.view.viewport().center.x) / 2, (e.mouse.y + _this.view.viewport().center.y) / 2, 0.05);
        } else {
          return _this.view.zoom(_this.view.viewport().width - (e.mouse.x + _this.view.viewport().center.x) / 2, _this.view.viewport().height - (e.mouse.y + _this.view.viewport().center.y) / 2, -0.2);
        }
      };
    })(this));
  };

  App.prototype.initializeLoop = function(ms) {
    return window.setInterval((function(_this) {
      return function() {
        _this.context.clearRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
        if (!(_this.view.mouse.down || _this.paused)) {
          _this.grid.update(life.algorithms.life);
        }
        return _this.grid.draw(5, 5, 1);
      };
    })(this), ms);
  };

  return App;

})();

$(function() {
  var app;
  app = new App();
  return app.start();
});


},{"./life.coffee":1,"./util.coffee":3}],3:[function(require,module,exports){
var View, events,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

events = require("events");

View = (function() {
  function View(app) {
    var $ctx;
    this.app = app;
    this.updateMouse = bind(this.updateMouse, this);
    this.context = this.app.context;
    this.mousedown = false;
    this.mouse = {
      down: false,
      x: 0,
      y: 0,
      local: {
        x: 0,
        y: 0
      }
    };
    this.location = {
      x: 0,
      y: 0
    };
    this.scale = {
      x: 1,
      y: 1
    };
    this.e = new events.EventEmitter();
    $ctx = $(this.context.canvas);
    $ctx.on("mousedown", (function(_this) {
      return function(jqe) {
        _this.mouse.down = true;
        _this.updateMouse(jqe);
        return _this.e.emit("mousedown", {
          jq: jqe,
          mouse: _this.mouse
        });
      };
    })(this));
    $ctx.on("mouseup", (function(_this) {
      return function(jqe) {
        _this.mouse.down = false;
        return _this.e.emit("mouseup", {
          jq: jqe,
          mouse: _this.mouse
        });
      };
    })(this));
    $ctx.on("mousemove", (function(_this) {
      return function(jqe) {
        _this.updateMouse(jqe);
        return _this.e.emit("mousemove", {
          jq: jqe,
          mouse: _this.mouse
        });
      };
    })(this));
    $(window).bind('mousewheel DOMMouseScroll', (function(_this) {
      return function(jqe) {
        _this.updateMouse(jqe);
        return _this.e.emit("mousewheel", {
          jq: jqe,
          mouse: _this.mouse,
          up: jqe.originalEvent.wheelDelta > 0 || jqe.originalEvent.detail < 0
        });
      };
    })(this));
  }

  View.prototype.setRectangle = function(x, y, w, h) {
    var oldHeight, oldWidth, ref;
    ref = [x, y], this.location.x = ref[0], this.location.y = ref[1];
    oldWidth = this.context.canvas.width / this.scale.x;
    oldHeight = this.context.canvas.height / this.scale.y;
    this.scale.x = oldWidth / w;
    return this.scale.y = oldHeight / h;
  };

  View.prototype.zoom = function(x, y, factor) {
    var height, width;
    this.scale.x += factor;
    this.scale.y += factor;
    width = this.context.canvas.width / this.scale.x;
    height = this.context.canvas.height / this.scale.y;
    this.location.x = Math.floor(x - (width / 2));
    return this.location.y = Math.floor(y - (height / 2));
  };

  View.prototype.viewport = function() {
    return {
      x: this.location.x,
      y: this.location.y,
      width: this.context.canvas.width / this.scale.x,
      height: this.context.canvas.height / this.scale.y,
      center: {
        x: this.location.x + ((this.context.canvas.width / this.scale.x) / 2),
        y: this.location.y + ((this.context.canvas.height / this.scale.y) / 2)
      }
    };
  };

  View.prototype.updateMouse = function(jqe) {
    this.mouse.x = ((jqe.pageX - $(this.context.canvas).offset().left) / this.scale.x) + this.location.x;
    this.mouse.y = ((jqe.pageY - $(this.context.canvas).offset().top) / this.scale.y) + this.location.y;
    this.mouse.local.x = jqe.pageX - $(this.context.canvas).offset().left;
    return this.mouse.local.y = jqe.pageY - $(this.context.canvas).offset().top;
  };

  View.prototype.fillRect = function(x, y, w, h) {
    return this.context.fillRect((x - this.location.x) * this.scale.x, (y - this.location.y) * this.scale.y, w * this.scale.x, h * this.scale.y);
  };

  return View;

})();

module.exports = {
  View: View
};


},{"events":4}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjOlxcVXNlcnNcXEZyb2JcXERyb3Bib3hcXHByb2plY3RzXFx0aHVnLWxpZmVcXGFzc2V0c1xcanNcXGxpZmUuY29mZmVlIiwiYzpcXFVzZXJzXFxGcm9iXFxEcm9wYm94XFxwcm9qZWN0c1xcdGh1Zy1saWZlXFxhc3NldHNcXGpzXFxtYWluLmNvZmZlZSIsImM6XFxVc2Vyc1xcRnJvYlxcRHJvcGJveFxccHJvamVjdHNcXHRodWctbGlmZVxcYXNzZXRzXFxqc1xcdXRpbC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsc0JBQUE7RUFBQTs7QUFBQSxVQUFBLEdBQ0U7RUFBQSxJQUFBLEVBQU0sU0FBQyxDQUFELEVBQUksS0FBSjtBQUVKLFFBQUE7SUFBQSxlQUFBLEdBQWtCO0FBRWxCLFNBQUEsbUNBQUE7O01BQ0UsSUFBRyxJQUFIO1FBQWEsZUFBQSxJQUFtQixFQUFoQzs7QUFERjtJQUdBLElBQUcsQ0FBQyxLQUFBLElBQVUsQ0FBQyxlQUFBLEtBQW1CLENBQW5CLElBQXdCLGVBQUEsS0FBbUIsQ0FBNUMsQ0FBWCxDQUFBLElBQThELENBQUMsQ0FBSSxLQUFKLElBQWMsZUFBQSxLQUFtQixDQUFsQyxDQUFqRTthQUNFLEtBREY7S0FBQSxNQUFBO2FBR0UsTUFIRjs7RUFQSSxDQUFOOzs7QUFZSTtFQUNTLGNBQUE7SUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEdBQUQsR0FBTztFQUZJOztpQkFJYixNQUFBLEdBQVEsU0FBQyxNQUFEO0lBQ04sTUFBTSxDQUFDLEtBQVAsR0FBZSxJQUFDLENBQUE7V0FDaEIsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFDLENBQUE7RUFGUjs7Ozs7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYWxnb3JpdGhtcyA9XHJcbiAgbGlmZTogKGMsIGFsaXZlKSAtPlxyXG4gICAgI2xpdmluZ05laWdoYm9ycyA9IGMucmVkdWNlICgoYWNjLCBlKSAtPiBpZiBlIHRoZW4gYWNjKzEgZWxzZSBhY2MpLCAwXHJcbiAgICBsaXZpbmdOZWlnaGJvcnMgPSAwXHJcblxyXG4gICAgZm9yIGNlbGwgaW4gY1xyXG4gICAgICBpZiBjZWxsIHRoZW4gbGl2aW5nTmVpZ2hib3JzICs9IDFcclxuXHJcbiAgICBpZiAoYWxpdmUgYW5kIChsaXZpbmdOZWlnaGJvcnMgaXMgMiBvciBsaXZpbmdOZWlnaGJvcnMgaXMgMykpIG9yIChub3QgYWxpdmUgYW5kIGxpdmluZ05laWdoYm9ycyBpcyAzKVxyXG4gICAgICB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGZhbHNlXHJcblxyXG5jbGFzcyBDZWxsXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAYWxpdmUgPSBmYWxzZVxyXG4gICAgQGFnZSA9IDBcclxuXHJcbiAgY29weVRvOiAodGFyZ2V0KSAtPlxyXG4gICAgdGFyZ2V0LmFsaXZlID0gQGFsaXZlXHJcbiAgICB0YXJnZXQuYWdlID0gQGFnZVxyXG5cclxuY2xhc3MgR3JpZFxyXG4gIGNvbnN0cnVjdG9yOiAoQGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsIGNlbGxXaWR0aD01LCBjZWxsSGVpZ2h0PTUsIGNlbGxTcGFjaW5nPTEuMikgLT5cclxuICAgIEBpbmZvID1cclxuICAgICAgcm93czogaGVpZ2h0XHJcbiAgICAgIGNvbHVtbnM6IHdpZHRoXHJcbiAgICAgIGNlbGw6XHJcbiAgICAgICAgd2lkdGg6IGNlbGxXaWR0aFxyXG4gICAgICAgIGhlaWdodDogY2VsbEhlaWdodFxyXG4gICAgICAgIHNwYWNpbmc6IGNlbGxTcGFjaW5nXHJcblxyXG4gICAgQGN1cnJlbnQgPSBbXVxyXG4gICAgQG5leHQgPSBbXVxyXG5cclxuICAgIEBpbml0aWFsaXplKEBjdXJyZW50KVxyXG4gICAgQGluaXRpYWxpemUoQG5leHQpXHJcbiAgICBjb25zb2xlLmxvZyBAY3VycmVudFxyXG5cclxuICB1cGRhdGU6IChhbGdvKSAtPlxyXG4gICAgZm9yIHJvdyBpbiBbMC4uQGluZm8ucm93c11cclxuICAgICAgZm9yIGNvbCBpbiBbMC4uQGluZm8uY29sdW1uc11cclxuICAgICAgICBjZWxsID0gQGN1cnJlbnRbcm93XVtjb2xdXHJcbiAgICAgICAgbiA9XHJcbiAgICAgICAgICBsZWZ0OiAoaWYgY29sID4gMSB0aGVuIGNvbCAtIDEgZWxzZSBAaW5mby5jb2x1bW5zKVxyXG4gICAgICAgICAgcmlnaHQ6IChjb2wgKyAxKSAlIChAaW5mby5jb2x1bW5zKVxyXG4gICAgICAgICAgYWJvdmU6IChpZiByb3cgPiAxIHRoZW4gcm93IC0gMSBlbHNlIEBpbmZvLnJvd3MpXHJcbiAgICAgICAgICBiZWxvdzogKHJvdyArIDEpICUgKEBpbmZvLnJvd3MpXHJcblxyXG4gICAgICAgIGNodW5rID0gW1xyXG4gICAgICAgICAgQGN1cnJlbnRbbi5hYm92ZV1bbi5sZWZ0XS5hbGl2ZSwgQGN1cnJlbnRbbi5hYm92ZV1bY29sXS5hbGl2ZSwgQGN1cnJlbnRbbi5hYm92ZV1bbi5yaWdodF0uYWxpdmUsXHJcbiAgICAgICAgICBAY3VycmVudFtyb3ddW24ubGVmdF0uYWxpdmUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAY3VycmVudFtyb3ddW24ucmlnaHRdLmFsaXZlLFxyXG4gICAgICAgICAgQGN1cnJlbnRbbi5iZWxvd11bbi5sZWZ0XS5hbGl2ZSwgQGN1cnJlbnRbbi5iZWxvd11bY29sXS5hbGl2ZSwgQGN1cnJlbnRbbi5iZWxvd11bbi5yaWdodF0uYWxpdmVcclxuICAgICAgICBdXHJcbiAgICAgICAgQG5leHRbcm93XVtjb2xdLmFsaXZlID0gYWxnbyhjaHVuaywgY2VsbC5hbGl2ZSlcclxuICAgICAgICBpZiBAY3VycmVudFtyb3ddW2NvbF0uYWxpdmUgYW5kIEBjdXJyZW50W3Jvd11bY29sXS5hbGl2ZSBpcyBAbmV4dFtyb3ddW2NvbF0uYWxpdmVcclxuICAgICAgICAgIEBuZXh0W3Jvd11bY29sXS5hZ2UgKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBuZXh0W3Jvd11bY29sXS5hZ2UgPSAwXHJcblxyXG4gICAgZm9yIHIgaW4gWzAuLkBpbmZvLnJvd3NdXHJcbiAgICAgIGZvciBjIGluIFswLi5AaW5mby5jb2x1bW5zXVxyXG4gICAgICAgIEBuZXh0W3JdW2NdLmNvcHlUbyBAY3VycmVudFtyXVtjXVxyXG5cclxuICBpbml0aWFsaXplOiAoY2VsbHMpID0+XHJcbiAgICBmb3Igcm93IGluIFswLi5AaW5mby5yb3dzXVxyXG4gICAgICBjZWxscy5wdXNoIFtdXHJcbiAgICAgIGZvciBjb2wgaW4gWzAuLkBpbmZvLmNvbHVtbnNdXHJcbiAgICAgICAgY2VsbHNbcm93XS5wdXNoIG5ldyBDZWxsKClcclxuXHJcbiAgZHJhdzogKGNXaWR0aCwgY0hlaWdodCwgY1NwYWNpbmcpIC0+XHJcbiAgICBjdHggPSBAY29udGV4dFxyXG5cclxuICAgIGZvciByb3cgaW4gWzAuLkBpbmZvLnJvd3NdXHJcbiAgICAgIGZvciBjb2wgaW4gWzAuLkBpbmZvLmNvbHVtbnNdXHJcbiAgICAgICAgaWYgQGN1cnJlbnRbcm93XVtjb2xdLmFsaXZlXHJcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoI3syNTUtU3RyaW5nKEBjdXJyZW50W3Jvd11bY29sXS5hZ2UqNSl9LCAje1N0cmluZyhAY3VycmVudFtyb3ddW2NvbF0uYWdlKjIwKX0sICN7U3RyaW5nKEBjdXJyZW50W3Jvd11bY29sXS5hZ2UqMTApfSlcIlxyXG4gICAgICAgICAgY3R4LmZpbGxSZWN0IChjb2wqY1dpZHRoKSpjU3BhY2luZywgKHJvdypjSGVpZ2h0KSpjU3BhY2luZywgY1dpZHRoLCBjSGVpZ2h0XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgYWxnb3JpdGhtczogYWxnb3JpdGhtc1xyXG4gIENlbGw6IENlbGxcclxuICBHcmlkOiBHcmlkIiwibGlmZSA9IHJlcXVpcmUgXCIuL2xpZmUuY29mZmVlXCJcclxudXRpbCA9IHJlcXVpcmUgXCIuL3V0aWwuY29mZmVlXCJcclxuXHJcbmNsYXNzIEFwcFxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuICAgIEBwYXVzZWQgPSBmYWxzZVxyXG4gICAgQGRvbSA9IEBnZXREb21FbGVtZW50cygpXHJcblxyXG4gICAgQGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlmZS1jYW52YXNcIilcclxuICAgIEBjb250ZXh0ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuXHJcbiAgICBAdmlldyA9IG5ldyB1dGlsLlZpZXcodGhpcylcclxuXHJcbiAgICBAcmVzaXplQ2FudmFzKClcclxuICAgIEBncmlkID0gQGluaXRpYWxpemVHcmlkKDUsIDUpXHJcblxyXG4gIHN0YXJ0OiAtPlxyXG4gICAgQGJpbmRWaWV3RXZlbnRzKEB2aWV3LmUpXHJcbiAgICBAYmluZEJ1dHRvbkV2ZW50cyhAZG9tLmJ1dHRvbnMpXHJcbiAgICBAaW5pdGlhbGl6ZUxvb3AoNTApXHJcblxyXG4gIHJlc2l6ZUNhbnZhczogLT5cclxuICAgIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBAZG9tLnRvb2xiYXIuaGVpZ2h0KCkgLSA1MFxyXG4gICAgQGRvbS5jYW52YXMuaGVpZ2h0KGgpXHJcbiAgICBAY29udGV4dC5jYW52YXMud2lkdGggPSBAZG9tLmNvbnRhaW5lci53aWR0aCgpXHJcbiAgICBAY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gaFxyXG5cclxuICBpbml0aWFsaXplR3JpZDogKHJvd3MsIGNvbHMpIC0+XHJcbiAgICByZXR1cm4gbmV3IGxpZmUuR3JpZChAY29udGV4dCwgQGNvbnRleHQuY2FudmFzLndpZHRoL2NvbHMsIE1hdGguZmxvb3IoQGNvbnRleHQuY2FudmFzLmhlaWdodC9yb3dzKSlcclxuXHJcbiAgZ2V0RG9tRWxlbWVudHM6IC0+XHJcbiAgICBjb250YWluZXI6ICQoXCIubWFpblwiKVxyXG4gICAgdG9vbGJhcjogJChcIm5hdlwiKVxyXG4gICAgY2FudmFzOiAkKFwiI2xpZmUtY2FudmFzXCIpXHJcbiAgICBidXR0b25zOlxyXG4gICAgICBwYXVzZTogJChcIi5wYXVzZVwiKVxyXG4gICAgICBjbGVhcjogJChcIi5jbGVhci1ib2FyZFwiKVxyXG5cclxuICBiaW5kQnV0dG9uRXZlbnRzOiAoYnV0dG9ucykgLT5cclxuICAgIGJ1dHRvbnMucGF1c2UuY2xpY2sgKGUpID0+XHJcbiAgICAgIGlmIEBwYXVzZWRcclxuICAgICAgICBAcGF1c2VkID0gZmFsc2VcclxuICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcyhcImdseXBoaWNvbi1wbGF5XCIpLmFkZENsYXNzKFwiZ2x5cGhpY29uLXBhdXNlXCIpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAcGF1c2VkID0gdHJ1ZVxyXG4gICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKFwiZ2x5cGhpY29uLXBhdXNlXCIpLmFkZENsYXNzKFwiZ2x5cGhpY29uLXBsYXlcIilcclxuXHJcbiAgICBidXR0b25zLmNsZWFyLmNsaWNrID0+XHJcbiAgICAgIEByZXNpemVDYW52YXMoKVxyXG4gICAgICBAZ3JpZCA9IEBpbml0aWFsaXplR3JpZCg1LCA1KSAjZ3JpZCA9IG5ldyBsaWZlLkdyaWQoY3R4LCAkKFwiLm1haW5cIikud2lkdGgoKS81LCA4MClcclxuXHJcbiAgYmluZFZpZXdFdmVudHM6ICh2aWV3RXZlbnRzKSAtPlxyXG4gICAgdmlld0V2ZW50cy5vbiBcIm1vdXNlZG93blwiLCAoZSkgPT5cclxuICAgICAgI3BhdXNlZCA9IHRydWVcclxuICAgICAgQGdyaWQuY3VycmVudFtNYXRoLmZsb29yKGUubW91c2UueS81KV1bTWF0aC5mbG9vcihlLm1vdXNlLngvNSldLmFsaXZlID0gdHJ1ZVxyXG5cclxuICAgIHZpZXdFdmVudHMub24gXCJtb3VzZW1vdmVcIiwgKGUpID0+XHJcbiAgICAgIGlmIGUubW91c2UuZG93blxyXG4gICAgICAgIEBncmlkLmN1cnJlbnRbTWF0aC5mbG9vcihlLm1vdXNlLnkvNSldW01hdGguZmxvb3IoZS5tb3VzZS54LzUpXS5hbGl2ZSA9IHRydWVcclxuXHJcbiAgICB2aWV3RXZlbnRzLm9uIFwibW91c2V3aGVlbFwiLCAoZSkgPT5cclxuICAgICAgaWYgZS51cFxyXG4gICAgICAgIEB2aWV3Lnpvb20gKGUubW91c2UueCArIEB2aWV3LnZpZXdwb3J0KCkuY2VudGVyLngpLzIsIChlLm1vdXNlLnkgKyBAdmlldy52aWV3cG9ydCgpLmNlbnRlci55KS8yLCAwLjA1XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAdmlldy56b29tIEB2aWV3LnZpZXdwb3J0KCkud2lkdGggLSAoZS5tb3VzZS54ICsgQHZpZXcudmlld3BvcnQoKS5jZW50ZXIueCkvMiwgQHZpZXcudmlld3BvcnQoKS5oZWlnaHQgLSAoZS5tb3VzZS55ICsgQHZpZXcudmlld3BvcnQoKS5jZW50ZXIueSkvMiwgLTAuMlxyXG5cclxuICBpbml0aWFsaXplTG9vcDogKG1zKSAtPlxyXG4gICAgd2luZG93LnNldEludGVydmFsID0+XHJcbiAgICAgIEBjb250ZXh0LmNsZWFyUmVjdCAwLCAwLCBAY29udGV4dC5jYW52YXMud2lkdGgsIEBjb250ZXh0LmNhbnZhcy5oZWlnaHRcclxuXHJcbiAgICAgIHVubGVzcyBAdmlldy5tb3VzZS5kb3duIG9yIEBwYXVzZWRcclxuICAgICAgICBAZ3JpZC51cGRhdGUobGlmZS5hbGdvcml0aG1zLmxpZmUpXHJcbiAgICAgIEBncmlkLmRyYXcoNSwgNSwgMSlcclxuICAgICxcclxuICAgICAgbXNcclxuXHJcbiQgLT5cclxuICBhcHAgPSBuZXcgQXBwKClcclxuICBhcHAuc3RhcnQoKSIsImV2ZW50cyA9IHJlcXVpcmUgXCJldmVudHNcIlxyXG5cclxuY2xhc3MgVmlld1xyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCkgLT5cclxuICAgIEBjb250ZXh0ID0gQGFwcC5jb250ZXh0XHJcblxyXG4gICAgQG1vdXNlZG93biA9IGZhbHNlXHJcblxyXG4gICAgQG1vdXNlID1cclxuICAgICAgZG93bjogZmFsc2VcclxuICAgICAgeDogMFxyXG4gICAgICB5OiAwXHJcbiAgICAgIGxvY2FsOlxyXG4gICAgICAgIHg6IDBcclxuICAgICAgICB5OiAwXHJcblxyXG4gICAgQGxvY2F0aW9uID1cclxuICAgICAgeDogMFxyXG4gICAgICB5OiAwXHJcblxyXG4gICAgQHNjYWxlID1cclxuICAgICAgeDogMVxyXG4gICAgICB5OiAxXHJcblxyXG4gICAgQGUgPSBuZXcgZXZlbnRzLkV2ZW50RW1pdHRlcigpXHJcbiAgICAkY3R4ID0gJChAY29udGV4dC5jYW52YXMpXHJcblxyXG4gICAgJGN0eC5vbiBcIm1vdXNlZG93blwiLCAoanFlKSA9PlxyXG4gICAgICBAbW91c2UuZG93biA9IHRydWVcclxuICAgICAgQHVwZGF0ZU1vdXNlKGpxZSlcclxuICAgICAgQGUuZW1pdCBcIm1vdXNlZG93blwiLCB7anE6IGpxZSwgbW91c2U6IEBtb3VzZX1cclxuXHJcbiAgICAkY3R4Lm9uIFwibW91c2V1cFwiLCAoanFlKSA9PlxyXG4gICAgICBAbW91c2UuZG93biA9IGZhbHNlXHJcbiAgICAgIEBlLmVtaXQgXCJtb3VzZXVwXCIsIHtqcToganFlLCBtb3VzZTogQG1vdXNlfVxyXG5cclxuICAgICRjdHgub24gXCJtb3VzZW1vdmVcIiwgKGpxZSkgPT5cclxuICAgICAgQHVwZGF0ZU1vdXNlKGpxZSlcclxuICAgICAgQGUuZW1pdCBcIm1vdXNlbW92ZVwiLCB7anE6IGpxZSwgbW91c2U6IEBtb3VzZX1cclxuXHJcbiAgICAkKHdpbmRvdykuYmluZCAnbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCcsIChqcWUpID0+XHJcbiAgICAgIEB1cGRhdGVNb3VzZShqcWUpXHJcbiAgICAgIEBlLmVtaXQgXCJtb3VzZXdoZWVsXCIsIHtqcToganFlLCBtb3VzZTogQG1vdXNlLCB1cDogKGpxZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgPiAwIG9yIGpxZS5vcmlnaW5hbEV2ZW50LmRldGFpbCA8IDApfVxyXG5cclxuICBzZXRSZWN0YW5nbGU6ICh4LCB5LCB3LCBoKSAtPlxyXG4gICAgW0Bsb2NhdGlvbi54LCBAbG9jYXRpb24ueV0gPSBbeCwgeV1cclxuICAgIG9sZFdpZHRoID0gQGNvbnRleHQuY2FudmFzLndpZHRoIC8gQHNjYWxlLnhcclxuICAgIG9sZEhlaWdodCA9IEBjb250ZXh0LmNhbnZhcy5oZWlnaHQgLyBAc2NhbGUueVxyXG4gICAgQHNjYWxlLnggPSBvbGRXaWR0aCAvIHdcclxuICAgIEBzY2FsZS55ID0gb2xkSGVpZ2h0IC8gaFxyXG5cclxuICB6b29tOiAoeCwgeSwgZmFjdG9yKSAtPlxyXG4gICAgQHNjYWxlLnggKz0gZmFjdG9yXHJcbiAgICBAc2NhbGUueSArPSBmYWN0b3JcclxuXHJcbiAgICB3aWR0aCA9IEBjb250ZXh0LmNhbnZhcy53aWR0aCAvIEBzY2FsZS54XHJcbiAgICBoZWlnaHQgPSBAY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gQHNjYWxlLnlcclxuXHJcbiAgICBAbG9jYXRpb24ueCA9IE1hdGguZmxvb3IoeCAtICh3aWR0aC8yKSlcclxuICAgIEBsb2NhdGlvbi55ID0gTWF0aC5mbG9vcih5IC0gKGhlaWdodC8yKSlcclxuXHJcblxyXG4gIHZpZXdwb3J0OiAtPlxyXG4gICAgeDogQGxvY2F0aW9uLnhcclxuICAgIHk6IEBsb2NhdGlvbi55XHJcbiAgICB3aWR0aDogQGNvbnRleHQuY2FudmFzLndpZHRoIC8gQHNjYWxlLnhcclxuICAgIGhlaWdodDogQGNvbnRleHQuY2FudmFzLmhlaWdodCAvIEBzY2FsZS55XHJcbiAgICBjZW50ZXI6XHJcbiAgICAgIHg6IEBsb2NhdGlvbi54ICsgKChAY29udGV4dC5jYW52YXMud2lkdGggLyBAc2NhbGUueCkvMilcclxuICAgICAgeTogQGxvY2F0aW9uLnkgKyAoKEBjb250ZXh0LmNhbnZhcy5oZWlnaHQgLyBAc2NhbGUueSkvMilcclxuXHJcbiAgdXBkYXRlTW91c2U6IChqcWUpID0+XHJcbiAgICBAbW91c2UueCA9ICgoanFlLnBhZ2VYIC0gJChAY29udGV4dC5jYW52YXMpLm9mZnNldCgpLmxlZnQpIC8gQHNjYWxlLngpICsgQGxvY2F0aW9uLnhcclxuICAgIEBtb3VzZS55ID0gKChqcWUucGFnZVkgLSAkKEBjb250ZXh0LmNhbnZhcykub2Zmc2V0KCkudG9wKSAvIEBzY2FsZS55KSArIEBsb2NhdGlvbi55XHJcbiAgICBAbW91c2UubG9jYWwueCA9IChqcWUucGFnZVggLSAkKEBjb250ZXh0LmNhbnZhcykub2Zmc2V0KCkubGVmdClcclxuICAgIEBtb3VzZS5sb2NhbC55ID0gKGpxZS5wYWdlWSAtICQoQGNvbnRleHQuY2FudmFzKS5vZmZzZXQoKS50b3ApXHJcblxyXG4gIGZpbGxSZWN0OiAoeCwgeSwgdywgaCkgLT5cclxuICAgIEBjb250ZXh0LmZpbGxSZWN0KCh4IC0gQGxvY2F0aW9uLngpKkBzY2FsZS54LCAoeSAtIEBsb2NhdGlvbi55KSpAc2NhbGUueSwgdyAqIEBzY2FsZS54LCBoICogQHNjYWxlLnkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgVmlldzogVmlldyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiJdfQ==
