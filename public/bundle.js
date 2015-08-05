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
            ctx.context.fillStyle = "rgb(" + (255 - String(this.current[row][col].age * 5)) + ", " + (String(this.current[row][col].age * 20)) + ", " + (String(this.current[row][col].age * 10)) + ")";
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
var life, util;

life = require("./life.coffee");

util = require("./util.coffee");

$(function() {
  var canvas, ctx, grid, h, paused, press, view;
  canvas = document.getElementById("life-canvas");
  ctx = canvas.getContext("2d");
  view = new util.View(ctx);
  h = window.innerHeight - $("nav").height() - 50;
  $("#life-canvas").height(h);
  ctx.canvas.height = h;
  grid = new life.Grid(view, $(".main").width() / 5, Math.floor(h / 5));
  press = false;
  paused = false;
  view.e.on("mousedown", function(e) {
    paused = true;
    return grid.current[Math.floor(e.mouse.y / 5)][Math.floor(e.mouse.x / 5)].alive = true;
  });
  view.e.on("mouseup", function(e) {
    return paused = false;
  });
  view.e.on("mousemove", function(e) {
    if (e.mouse.down) {
      return grid.current[Math.floor(e.mouse.y / 5)][Math.floor(e.mouse.x / 5)].alive = true;
    }
  });
  $(".pause").click(function(e) {
    if (paused) {
      paused = false;
      return $(e.target).removeClass("glyphicon-play").addClass("glyphicon-pause");
    } else {
      paused = true;
      return $(e.target).removeClass("glyphicon-pause").addClass("glyphicon-play");
    }
  });
  $(".clear-board").click(function(e) {
    return grid = new life.Grid(view, $(".main").width() / 5, 80);
  });
  $(window).bind('mousewheel DOMMouseScroll', function(e) {
    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
      view.scale.x += 0.2;
      return view.scale.y += 0.2;
    } else {
      view.scale.x -= 0.2;
      return view.scale.y -= 0.2;
    }
  });
  return window.setInterval(function() {
    ctx.canvas.width = $(".main").width();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!(press || paused)) {
      grid.update(life.algorithms.life);
    }
    return grid.draw(5, 5, 1);
  }, 50);
});


},{"./life.coffee":1,"./util.coffee":3}],3:[function(require,module,exports){
var View, events,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

events = require("events");

View = (function() {
  function View(context) {
    var $ctx;
    this.context = context;
    this.updateMouse = bind(this.updateMouse, this);
    this.mousedown = false;
    this.mouse = {
      down: false,
      x: 0,
      y: 0
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
  }

  View.prototype.updateMouse = function(jqe) {
    this.mouse.x = ((jqe.pageX - $(this.context.canvas).offset().left) / this.scale.x) + this.location.x;
    return this.mouse.y = ((jqe.pageY - $(this.context.canvas).offset().top) / this.scale.y) + this.location.y;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjOlxcVXNlcnNcXEZyb2JcXERyb3Bib3hcXHByb2plY3RzXFx0aHVnLWxpZmVcXGFzc2V0c1xcanNcXGxpZmUuY29mZmVlIiwiYzpcXFVzZXJzXFxGcm9iXFxEcm9wYm94XFxwcm9qZWN0c1xcdGh1Zy1saWZlXFxhc3NldHNcXGpzXFxtYWluLmNvZmZlZSIsImM6XFxVc2Vyc1xcRnJvYlxcRHJvcGJveFxccHJvamVjdHNcXHRodWctbGlmZVxcYXNzZXRzXFxqc1xcdXRpbC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsc0JBQUE7RUFBQTs7QUFBQSxVQUFBLEdBQ0U7RUFBQSxJQUFBLEVBQU0sU0FBQyxDQUFELEVBQUksS0FBSjtBQUVKLFFBQUE7SUFBQSxlQUFBLEdBQWtCO0FBRWxCLFNBQUEsbUNBQUE7O01BQ0UsSUFBRyxJQUFIO1FBQWEsZUFBQSxJQUFtQixFQUFoQzs7QUFERjtJQUdBLElBQUcsQ0FBQyxLQUFBLElBQVUsQ0FBQyxlQUFBLEtBQW1CLENBQW5CLElBQXdCLGVBQUEsS0FBbUIsQ0FBNUMsQ0FBWCxDQUFBLElBQThELENBQUMsQ0FBSSxLQUFKLElBQWMsZUFBQSxLQUFtQixDQUFsQyxDQUFqRTthQUNFLEtBREY7S0FBQSxNQUFBO2FBR0UsTUFIRjs7RUFQSSxDQUFOOzs7QUFZSTtFQUNTLGNBQUE7SUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEdBQUQsR0FBTztFQUZJOztpQkFJYixNQUFBLEdBQVEsU0FBQyxNQUFEO0lBQ04sTUFBTSxDQUFDLEtBQVAsR0FBZSxJQUFDLENBQUE7V0FDaEIsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFDLENBQUE7RUFGUjs7Ozs7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhbGdvcml0aG1zID1cclxuICBsaWZlOiAoYywgYWxpdmUpIC0+XHJcbiAgICAjbGl2aW5nTmVpZ2hib3JzID0gYy5yZWR1Y2UgKChhY2MsIGUpIC0+IGlmIGUgdGhlbiBhY2MrMSBlbHNlIGFjYyksIDBcclxuICAgIGxpdmluZ05laWdoYm9ycyA9IDBcclxuXHJcbiAgICBmb3IgY2VsbCBpbiBjXHJcbiAgICAgIGlmIGNlbGwgdGhlbiBsaXZpbmdOZWlnaGJvcnMgKz0gMVxyXG5cclxuICAgIGlmIChhbGl2ZSBhbmQgKGxpdmluZ05laWdoYm9ycyBpcyAyIG9yIGxpdmluZ05laWdoYm9ycyBpcyAzKSkgb3IgKG5vdCBhbGl2ZSBhbmQgbGl2aW5nTmVpZ2hib3JzIGlzIDMpXHJcbiAgICAgIHRydWVcclxuICAgIGVsc2VcclxuICAgICAgZmFsc2VcclxuXHJcbmNsYXNzIENlbGxcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBhbGl2ZSA9IGZhbHNlXHJcbiAgICBAYWdlID0gMFxyXG5cclxuICBjb3B5VG86ICh0YXJnZXQpIC0+XHJcbiAgICB0YXJnZXQuYWxpdmUgPSBAYWxpdmVcclxuICAgIHRhcmdldC5hZ2UgPSBAYWdlXHJcblxyXG5jbGFzcyBHcmlkXHJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VsbFdpZHRoPTUsIGNlbGxIZWlnaHQ9NSwgY2VsbFNwYWNpbmc9MS4yKSAtPlxyXG4gICAgQGluZm8gPVxyXG4gICAgICByb3dzOiBoZWlnaHRcclxuICAgICAgY29sdW1uczogd2lkdGhcclxuICAgICAgY2VsbDpcclxuICAgICAgICB3aWR0aDogY2VsbFdpZHRoXHJcbiAgICAgICAgaGVpZ2h0OiBjZWxsSGVpZ2h0XHJcbiAgICAgICAgc3BhY2luZzogY2VsbFNwYWNpbmdcclxuXHJcbiAgICBAY3VycmVudCA9IFtdXHJcbiAgICBAbmV4dCA9IFtdXHJcblxyXG4gICAgQGluaXRpYWxpemUoQGN1cnJlbnQpXHJcbiAgICBAaW5pdGlhbGl6ZShAbmV4dClcclxuICAgIGNvbnNvbGUubG9nIEBjdXJyZW50XHJcblxyXG4gIHVwZGF0ZTogKGFsZ28pIC0+XHJcbiAgICBmb3Igcm93IGluIFswLi5AaW5mby5yb3dzXVxyXG4gICAgICBmb3IgY29sIGluIFswLi5AaW5mby5jb2x1bW5zXVxyXG4gICAgICAgIGNlbGwgPSBAY3VycmVudFtyb3ddW2NvbF1cclxuICAgICAgICBuID1cclxuICAgICAgICAgIGxlZnQ6IChpZiBjb2wgPiAxIHRoZW4gY29sIC0gMSBlbHNlIEBpbmZvLmNvbHVtbnMpXHJcbiAgICAgICAgICByaWdodDogKGNvbCArIDEpICUgKEBpbmZvLmNvbHVtbnMpXHJcbiAgICAgICAgICBhYm92ZTogKGlmIHJvdyA+IDEgdGhlbiByb3cgLSAxIGVsc2UgQGluZm8ucm93cylcclxuICAgICAgICAgIGJlbG93OiAocm93ICsgMSkgJSAoQGluZm8ucm93cylcclxuXHJcbiAgICAgICAgY2h1bmsgPSBbXHJcbiAgICAgICAgICBAY3VycmVudFtuLmFib3ZlXVtuLmxlZnRdLmFsaXZlLCBAY3VycmVudFtuLmFib3ZlXVtjb2xdLmFsaXZlLCBAY3VycmVudFtuLmFib3ZlXVtuLnJpZ2h0XS5hbGl2ZSxcclxuICAgICAgICAgIEBjdXJyZW50W3Jvd11bbi5sZWZ0XS5hbGl2ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBjdXJyZW50W3Jvd11bbi5yaWdodF0uYWxpdmUsXHJcbiAgICAgICAgICBAY3VycmVudFtuLmJlbG93XVtuLmxlZnRdLmFsaXZlLCBAY3VycmVudFtuLmJlbG93XVtjb2xdLmFsaXZlLCBAY3VycmVudFtuLmJlbG93XVtuLnJpZ2h0XS5hbGl2ZVxyXG4gICAgICAgIF1cclxuICAgICAgICBAbmV4dFtyb3ddW2NvbF0uYWxpdmUgPSBhbGdvKGNodW5rLCBjZWxsLmFsaXZlKVxyXG4gICAgICAgIGlmIEBjdXJyZW50W3Jvd11bY29sXS5hbGl2ZSBhbmQgQGN1cnJlbnRbcm93XVtjb2xdLmFsaXZlIGlzIEBuZXh0W3Jvd11bY29sXS5hbGl2ZVxyXG4gICAgICAgICAgQG5leHRbcm93XVtjb2xdLmFnZSArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQG5leHRbcm93XVtjb2xdLmFnZSA9IDBcclxuXHJcbiAgICBmb3IgciBpbiBbMC4uQGluZm8ucm93c11cclxuICAgICAgZm9yIGMgaW4gWzAuLkBpbmZvLmNvbHVtbnNdXHJcbiAgICAgICAgQG5leHRbcl1bY10uY29weVRvIEBjdXJyZW50W3JdW2NdXHJcblxyXG4gIGluaXRpYWxpemU6IChjZWxscykgPT5cclxuICAgIGZvciByb3cgaW4gWzAuLkBpbmZvLnJvd3NdXHJcbiAgICAgIGNlbGxzLnB1c2ggW11cclxuICAgICAgZm9yIGNvbCBpbiBbMC4uQGluZm8uY29sdW1uc11cclxuICAgICAgICBjZWxsc1tyb3ddLnB1c2ggbmV3IENlbGwoKVxyXG5cclxuICBkcmF3OiAoY1dpZHRoLCBjSGVpZ2h0LCBjU3BhY2luZykgLT5cclxuICAgIGN0eCA9IEBjb250ZXh0XHJcblxyXG4gICAgZm9yIHJvdyBpbiBbMC4uQGluZm8ucm93c11cclxuICAgICAgZm9yIGNvbCBpbiBbMC4uQGluZm8uY29sdW1uc11cclxuICAgICAgICBpZiBAY3VycmVudFtyb3ddW2NvbF0uYWxpdmVcclxuICAgICAgICAgIGN0eC5jb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiKCN7MjU1LVN0cmluZyhAY3VycmVudFtyb3ddW2NvbF0uYWdlKjUpfSwgI3tTdHJpbmcoQGN1cnJlbnRbcm93XVtjb2xdLmFnZSoyMCl9LCAje1N0cmluZyhAY3VycmVudFtyb3ddW2NvbF0uYWdlKjEwKX0pXCJcclxuICAgICAgICAgIGN0eC5maWxsUmVjdCAoY29sKmNXaWR0aCkqY1NwYWNpbmcsIChyb3cqY0hlaWdodCkqY1NwYWNpbmcsIGNXaWR0aCwgY0hlaWdodFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG4gIGFsZ29yaXRobXM6IGFsZ29yaXRobXNcclxuICBDZWxsOiBDZWxsXHJcbiAgR3JpZDogR3JpZCIsImxpZmUgPSByZXF1aXJlIFwiLi9saWZlLmNvZmZlZVwiXHJcbnV0aWwgPSByZXF1aXJlIFwiLi91dGlsLmNvZmZlZVwiXHJcblxyXG4kIC0+XHJcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaWZlLWNhbnZhc1wiKVxyXG4gIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICB2aWV3ID0gbmV3IHV0aWwuVmlldyhjdHgpXHJcblxyXG4gIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAkKFwibmF2XCIpLmhlaWdodCgpIC0gNTBcclxuICAkKFwiI2xpZmUtY2FudmFzXCIpLmhlaWdodChoKVxyXG4gIGN0eC5jYW52YXMuaGVpZ2h0ID0gaFxyXG5cclxuICBncmlkID0gbmV3IGxpZmUuR3JpZCh2aWV3LCAkKFwiLm1haW5cIikud2lkdGgoKS81LCBNYXRoLmZsb29yKGgvNSkpXHJcbiAgcHJlc3MgPSBmYWxzZVxyXG4gIHBhdXNlZCA9IGZhbHNlXHJcblxyXG4gIHZpZXcuZS5vbiBcIm1vdXNlZG93blwiLCAoZSkgLT5cclxuICAgIHBhdXNlZCA9IHRydWVcclxuICAgIGdyaWQuY3VycmVudFtNYXRoLmZsb29yKGUubW91c2UueS81KV1bTWF0aC5mbG9vcihlLm1vdXNlLngvNSldLmFsaXZlID0gdHJ1ZVxyXG5cclxuICB2aWV3LmUub24gXCJtb3VzZXVwXCIsIChlKSAtPlxyXG4gICAgcGF1c2VkID0gZmFsc2VcclxuXHJcbiAgdmlldy5lLm9uIFwibW91c2Vtb3ZlXCIsIChlKSAtPlxyXG4gICAgaWYgZS5tb3VzZS5kb3duXHJcbiAgICAgIGdyaWQuY3VycmVudFtNYXRoLmZsb29yKGUubW91c2UueS81KV1bTWF0aC5mbG9vcihlLm1vdXNlLngvNSldLmFsaXZlID0gdHJ1ZVxyXG5cclxuICAkKFwiLnBhdXNlXCIpLmNsaWNrIChlKSAtPlxyXG4gICAgaWYgcGF1c2VkXHJcbiAgICAgIHBhdXNlZCA9IGZhbHNlXHJcbiAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKFwiZ2x5cGhpY29uLXBsYXlcIikuYWRkQ2xhc3MoXCJnbHlwaGljb24tcGF1c2VcIilcclxuICAgIGVsc2VcclxuICAgICAgcGF1c2VkID0gdHJ1ZVxyXG4gICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcyhcImdseXBoaWNvbi1wYXVzZVwiKS5hZGRDbGFzcyhcImdseXBoaWNvbi1wbGF5XCIpXHJcblxyXG4gICQoXCIuY2xlYXItYm9hcmRcIikuY2xpY2sgKGUpIC0+XHJcbiAgICBncmlkID0gbmV3IGxpZmUuR3JpZCh2aWV3LCAkKFwiLm1haW5cIikud2lkdGgoKS81LCA4MClcclxuXHJcbiAgJCh3aW5kb3cpLmJpbmQgJ21vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwnLCAoZSkgLT5cclxuICAgIGlmIGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhID4gMCBvciBlLm9yaWdpbmFsRXZlbnQuZGV0YWlsIDwgMFxyXG4gICAgICB2aWV3LnNjYWxlLnggKz0gMC4yXHJcbiAgICAgIHZpZXcuc2NhbGUueSArPSAwLjJcclxuICAgIGVsc2VcclxuICAgICAgdmlldy5zY2FsZS54IC09IDAuMlxyXG4gICAgICB2aWV3LnNjYWxlLnkgLT0gMC4yXHJcblxyXG4gIHdpbmRvdy5zZXRJbnRlcnZhbCAtPlxyXG5cclxuICAgIGN0eC5jYW52YXMud2lkdGggPSAkKFwiLm1haW5cIikud2lkdGgoKVxyXG4gICAgY3R4LmNsZWFyUmVjdCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHRcclxuXHJcbiAgICB1bmxlc3MgcHJlc3Mgb3IgcGF1c2VkXHJcbiAgICAgIGdyaWQudXBkYXRlKGxpZmUuYWxnb3JpdGhtcy5saWZlKVxyXG4gICAgZ3JpZC5kcmF3KDUsIDUsIDEpXHJcbiAgLFxyXG4gICAgNTAiLCJldmVudHMgPSByZXF1aXJlIFwiZXZlbnRzXCJcclxuXHJcbmNsYXNzIFZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBjb250ZXh0KSAtPlxyXG4gICAgQG1vdXNlZG93biA9IGZhbHNlXHJcblxyXG4gICAgQG1vdXNlID1cclxuICAgICAgZG93bjogZmFsc2VcclxuICAgICAgeDogMFxyXG4gICAgICB5OiAwXHJcblxyXG4gICAgQGxvY2F0aW9uID1cclxuICAgICAgeDogMFxyXG4gICAgICB5OiAwXHJcblxyXG4gICAgQHNjYWxlID1cclxuICAgICAgeDogMVxyXG4gICAgICB5OiAxXHJcblxyXG4gICAgQGUgPSBuZXcgZXZlbnRzLkV2ZW50RW1pdHRlcigpXHJcbiAgICAkY3R4ID0gJChAY29udGV4dC5jYW52YXMpXHJcblxyXG4gICAgJGN0eC5vbiBcIm1vdXNlZG93blwiLCAoanFlKSA9PlxyXG4gICAgICBAbW91c2UuZG93biA9IHRydWVcclxuICAgICAgQHVwZGF0ZU1vdXNlKGpxZSlcclxuICAgICAgQGUuZW1pdCBcIm1vdXNlZG93blwiLCB7anE6IGpxZSwgbW91c2U6IEBtb3VzZX1cclxuXHJcbiAgICAkY3R4Lm9uIFwibW91c2V1cFwiLCAoanFlKSA9PlxyXG4gICAgICBAbW91c2UuZG93biA9IGZhbHNlXHJcbiAgICAgIEBlLmVtaXQgXCJtb3VzZXVwXCIsIHtqcToganFlLCBtb3VzZTogQG1vdXNlfVxyXG5cclxuICAgICRjdHgub24gXCJtb3VzZW1vdmVcIiwgKGpxZSkgPT5cclxuICAgICAgQHVwZGF0ZU1vdXNlKGpxZSlcclxuICAgICAgQGUuZW1pdCBcIm1vdXNlbW92ZVwiLCB7anE6IGpxZSwgbW91c2U6IEBtb3VzZX1cclxuXHJcblxyXG4gIHVwZGF0ZU1vdXNlOiAoanFlKSA9PlxyXG4gICAgQG1vdXNlLnggPSAoKGpxZS5wYWdlWCAtICQoQGNvbnRleHQuY2FudmFzKS5vZmZzZXQoKS5sZWZ0KSAvIEBzY2FsZS54KSArIEBsb2NhdGlvbi54XHJcbiAgICBAbW91c2UueSA9ICgoanFlLnBhZ2VZIC0gJChAY29udGV4dC5jYW52YXMpLm9mZnNldCgpLnRvcCkgLyBAc2NhbGUueSkgKyBAbG9jYXRpb24ueVxyXG5cclxuICBmaWxsUmVjdDogKHgsIHksIHcsIGgpIC0+XHJcbiAgICBAY29udGV4dC5maWxsUmVjdCgoeCAtIEBsb2NhdGlvbi54KSpAc2NhbGUueCwgKHkgLSBAbG9jYXRpb24ueSkqQHNjYWxlLnksIHcgKiBAc2NhbGUueCwgaCAqIEBzY2FsZS55KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG4gIFZpZXc6IFZpZXciLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
