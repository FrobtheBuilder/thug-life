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
    util.augmentContext(this.context);
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

  App.prototype.initializeGrid = function(cellWidth, cellHeight) {
    return new life.Grid(this.context, this.context.canvas.width / cellWidth, Math.floor(this.context.canvas.height / cellHeight));
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
        var pt;
        pt = _this.context.transformedPoint(e.mouse.x, e.mouse.y);
        return _this.grid.current[Math.floor(pt.y / 5)][Math.floor(pt.x / 5)].alive = true;
      };
    })(this));
    viewEvents.on("mousemove", (function(_this) {
      return function(e) {
        var pt;
        if (e.mouse.down) {
          pt = _this.context.transformedPoint(e.mouse.x, e.mouse.y);
          return _this.grid.current[Math.floor(pt.y / 5)][Math.floor(pt.x / 5)].alive = true;
        }
      };
    })(this));
    return viewEvents.on("mousewheel", util.zoom);
  };

  App.prototype.initializeLoop = function(ms) {
    return window.setInterval((function(_this) {
      return function() {
        var p1, p2;
        p1 = _this.context.transformedPoint(0, 0);
        p2 = _this.context.transformedPoint(_this.context.canvas.width, _this.context.canvas.height);
        _this.context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
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
var View, augmentContext, events, zoom,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

events = require("events");

augmentContext = function(ctx) {
  var pt, restore, rotate, save, savedTransforms, scale, setTransform, svg, transform, translate, xform;
  svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  xform = svg.createSVGMatrix();
  ctx.getTransform = function() {
    return xform;
  };
  savedTransforms = [];
  save = ctx.save;
  ctx.save = function() {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(ctx);
  };
  restore = ctx.restore;
  ctx.restore = function() {
    xform = savedTransforms.pop();
    return restore.call(ctx);
  };
  scale = ctx.scale;
  ctx.scale = function(sx, sy) {
    xform = xform.scaleNonUniform(sx, sy);
    return scale.call(ctx, sx, sy);
  };
  rotate = ctx.rotate;
  ctx.rotate = function(radians) {
    xform = xform.rotate(radians * 180 / Math.PI);
    return rotate.call(ctx, radians);
  };
  translate = ctx.translate;
  ctx.translate = function(dx, dy) {
    xform = xform.translate(dx, dy);
    return translate.call(ctx, dx, dy);
  };
  transform = ctx.transform;
  ctx.transform = function(a, b, c, d, e, f) {
    var m2, ref;
    m2 = svg.createSVGMatrix();
    ref = [a, b, c, d, e, f], m2.a = ref[0], m2.b = ref[1], m2.c = ref[2], m2.d = ref[3], m2.e = ref[4], m2.f = ref[5];
    xform = xform.multiply(m2);
    return transform.call(ctx, a, b, c, d, e, f);
  };
  setTransform = ctx.setTransform;
  ctx.setTransform = function(a, b, c, d, e, f) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    return setTransform.call(ctx, a, b, c, d, e, f);
  };
  pt = svg.createSVGPoint();
  ctx.transformedPoint = function(x, y) {
    var ref;
    ref = [x, y], pt.x = ref[0], pt.y = ref[1];
    return pt.matrixTransform(xform.inverse());
  };
  return ctx.unTransformedPoint = function(x, y) {
    var ref;
    ref = [x, y], pt.x = ref[0], pt.y = ref[1];
    return pt.matrixTransform(xform);
  };
};

zoom = function(e) {
  var ctx, factor, pt;
  ctx = e.jq.target.getContext("2d");
  pt = ctx.transformedPoint(Math.round(e.mouse.x) * 1.0, Math.round(e.mouse.y) * 1.0);
  ctx.translate(pt.x, pt.y);
  factor = Math.pow(1.1, e.delta);
  ctx.scale(factor, factor);
  return ctx.translate(-pt.x, -pt.y);
};

View = (function() {
  function View(app) {
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
    this.e = this.wrapEvents($(this.context.canvas));
  }

  View.prototype.wrapEvents = function($ctx, emitter) {
    emitter = new events.EventEmitter();
    $ctx.on("mousedown", (function(_this) {
      return function(jqe) {
        _this.mouse.down = true;
        _this.updateMouse(jqe);
        return emitter.emit("mousedown", {
          jq: jqe,
          mouse: _this.mouse
        });
      };
    })(this));
    $ctx.on("mouseup", (function(_this) {
      return function(jqe) {
        _this.mouse.down = false;
        return emitter.emit("mouseup", {
          jq: jqe,
          mouse: _this.mouse
        });
      };
    })(this));
    $ctx.on("mousemove", (function(_this) {
      return function(jqe) {
        _this.updateMouse(jqe);
        return emitter.emit("mousemove", {
          jq: jqe,
          mouse: _this.mouse
        });
      };
    })(this));
    $ctx.bind('mousewheel DOMMouseScroll', (function(_this) {
      return function(jqe) {
        var delta, oEvt;
        oEvt = jqe.originalEvent;
        delta = oEvt.wheelDelta != null ? oEvt.wheelDelta / 40 : oEvt.detail != null ? -oEvt.detail : 0;
        emitter.emit("mousewheel", {
          jq: jqe,
          mouse: _this.mouse,
          delta: delta
        });
        return oEvt.preventDefault() && false;
      };
    })(this));
    return emitter;
  };

  View.prototype.updateMouse = function(jqe) {
    this.mouse.x = jqe.pageX - $(this.context.canvas).offset().left;
    this.mouse.y = jqe.pageY - $(this.context.canvas).offset().top;
    this.mouse.local.x = jqe.pageX - $(this.context.canvas).offset().left;
    return this.mouse.local.y = jqe.pageY - $(this.context.canvas).offset().top;
  };

  return View;

})();

module.exports = {
  View: View,
  augmentContext: augmentContext,
  zoom: zoom
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjOlxcVXNlcnNcXEZyb2JcXERyb3Bib3hcXHByb2plY3RzXFx0aHVnLWxpZmVcXGFzc2V0c1xcanNcXGxpZmUuY29mZmVlIiwiYzpcXFVzZXJzXFxGcm9iXFxEcm9wYm94XFxwcm9qZWN0c1xcdGh1Zy1saWZlXFxhc3NldHNcXGpzXFxtYWluLmNvZmZlZSIsImM6XFxVc2Vyc1xcRnJvYlxcRHJvcGJveFxccHJvamVjdHNcXHRodWctbGlmZVxcYXNzZXRzXFxqc1xcdXRpbC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsc0JBQUE7RUFBQTs7QUFBQSxVQUFBLEdBQ0U7RUFBQSxJQUFBLEVBQU0sU0FBQyxDQUFELEVBQUksS0FBSjtBQUVKLFFBQUE7SUFBQSxlQUFBLEdBQWtCO0FBRWxCLFNBQUEsbUNBQUE7O01BQ0UsSUFBRyxJQUFIO1FBQWEsZUFBQSxJQUFtQixFQUFoQzs7QUFERjtJQUdBLElBQUcsQ0FBQyxLQUFBLElBQVUsQ0FBQyxlQUFBLEtBQW1CLENBQW5CLElBQXdCLGVBQUEsS0FBbUIsQ0FBNUMsQ0FBWCxDQUFBLElBQThELENBQUMsQ0FBSSxLQUFKLElBQWMsZUFBQSxLQUFtQixDQUFsQyxDQUFqRTthQUNFLEtBREY7S0FBQSxNQUFBO2FBR0UsTUFIRjs7RUFQSSxDQUFOOzs7QUFZSTtFQUNTLGNBQUE7SUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEdBQUQsR0FBTztFQUZJOztpQkFJYixNQUFBLEdBQVEsU0FBQyxNQUFEO0lBQ04sTUFBTSxDQUFDLEtBQVAsR0FBZSxJQUFDLENBQUE7V0FDaEIsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFDLENBQUE7RUFGUjs7Ozs7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYWxnb3JpdGhtcyA9XHJcbiAgbGlmZTogKGMsIGFsaXZlKSAtPlxyXG4gICAgI2xpdmluZ05laWdoYm9ycyA9IGMucmVkdWNlICgoYWNjLCBlKSAtPiBpZiBlIHRoZW4gYWNjKzEgZWxzZSBhY2MpLCAwXHJcbiAgICBsaXZpbmdOZWlnaGJvcnMgPSAwXHJcblxyXG4gICAgZm9yIGNlbGwgaW4gY1xyXG4gICAgICBpZiBjZWxsIHRoZW4gbGl2aW5nTmVpZ2hib3JzICs9IDFcclxuXHJcbiAgICBpZiAoYWxpdmUgYW5kIChsaXZpbmdOZWlnaGJvcnMgaXMgMiBvciBsaXZpbmdOZWlnaGJvcnMgaXMgMykpIG9yIChub3QgYWxpdmUgYW5kIGxpdmluZ05laWdoYm9ycyBpcyAzKVxyXG4gICAgICB0cnVlXHJcbiAgICBlbHNlXHJcbiAgICAgIGZhbHNlXHJcblxyXG5jbGFzcyBDZWxsXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAYWxpdmUgPSBmYWxzZVxyXG4gICAgQGFnZSA9IDBcclxuXHJcbiAgY29weVRvOiAodGFyZ2V0KSAtPlxyXG4gICAgdGFyZ2V0LmFsaXZlID0gQGFsaXZlXHJcbiAgICB0YXJnZXQuYWdlID0gQGFnZVxyXG5cclxuY2xhc3MgR3JpZFxyXG4gIGNvbnN0cnVjdG9yOiAoQGNvbnRleHQsIHdpZHRoLCBoZWlnaHQsIGNlbGxXaWR0aD01LCBjZWxsSGVpZ2h0PTUsIGNlbGxTcGFjaW5nPTEuMikgLT5cclxuICAgIEBpbmZvID1cclxuICAgICAgcm93czogaGVpZ2h0XHJcbiAgICAgIGNvbHVtbnM6IHdpZHRoXHJcbiAgICAgIGNlbGw6XHJcbiAgICAgICAgd2lkdGg6IGNlbGxXaWR0aFxyXG4gICAgICAgIGhlaWdodDogY2VsbEhlaWdodFxyXG4gICAgICAgIHNwYWNpbmc6IGNlbGxTcGFjaW5nXHJcblxyXG4gICAgQGN1cnJlbnQgPSBbXVxyXG4gICAgQG5leHQgPSBbXVxyXG5cclxuICAgIEBpbml0aWFsaXplKEBjdXJyZW50KVxyXG4gICAgQGluaXRpYWxpemUoQG5leHQpXHJcbiAgICBjb25zb2xlLmxvZyBAY3VycmVudFxyXG5cclxuICB1cGRhdGU6IChhbGdvKSAtPlxyXG4gICAgZm9yIHJvdyBpbiBbMC4uQGluZm8ucm93c11cclxuICAgICAgZm9yIGNvbCBpbiBbMC4uQGluZm8uY29sdW1uc11cclxuICAgICAgICBjZWxsID0gQGN1cnJlbnRbcm93XVtjb2xdXHJcbiAgICAgICAgbiA9XHJcbiAgICAgICAgICBsZWZ0OiAoaWYgY29sID4gMSB0aGVuIGNvbCAtIDEgZWxzZSBAaW5mby5jb2x1bW5zKVxyXG4gICAgICAgICAgcmlnaHQ6IChjb2wgKyAxKSAlIChAaW5mby5jb2x1bW5zKVxyXG4gICAgICAgICAgYWJvdmU6IChpZiByb3cgPiAxIHRoZW4gcm93IC0gMSBlbHNlIEBpbmZvLnJvd3MpXHJcbiAgICAgICAgICBiZWxvdzogKHJvdyArIDEpICUgKEBpbmZvLnJvd3MpXHJcblxyXG4gICAgICAgIGNodW5rID0gW1xyXG4gICAgICAgICAgQGN1cnJlbnRbbi5hYm92ZV1bbi5sZWZ0XS5hbGl2ZSwgQGN1cnJlbnRbbi5hYm92ZV1bY29sXS5hbGl2ZSwgQGN1cnJlbnRbbi5hYm92ZV1bbi5yaWdodF0uYWxpdmUsXHJcbiAgICAgICAgICBAY3VycmVudFtyb3ddW24ubGVmdF0uYWxpdmUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAY3VycmVudFtyb3ddW24ucmlnaHRdLmFsaXZlLFxyXG4gICAgICAgICAgQGN1cnJlbnRbbi5iZWxvd11bbi5sZWZ0XS5hbGl2ZSwgQGN1cnJlbnRbbi5iZWxvd11bY29sXS5hbGl2ZSwgQGN1cnJlbnRbbi5iZWxvd11bbi5yaWdodF0uYWxpdmVcclxuICAgICAgICBdXHJcbiAgICAgICAgQG5leHRbcm93XVtjb2xdLmFsaXZlID0gYWxnbyhjaHVuaywgY2VsbC5hbGl2ZSlcclxuICAgICAgICBpZiBAY3VycmVudFtyb3ddW2NvbF0uYWxpdmUgYW5kIEBjdXJyZW50W3Jvd11bY29sXS5hbGl2ZSBpcyBAbmV4dFtyb3ddW2NvbF0uYWxpdmVcclxuICAgICAgICAgIEBuZXh0W3Jvd11bY29sXS5hZ2UgKz0gMVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBuZXh0W3Jvd11bY29sXS5hZ2UgPSAwXHJcblxyXG4gICAgZm9yIHIgaW4gWzAuLkBpbmZvLnJvd3NdXHJcbiAgICAgIGZvciBjIGluIFswLi5AaW5mby5jb2x1bW5zXVxyXG4gICAgICAgIEBuZXh0W3JdW2NdLmNvcHlUbyBAY3VycmVudFtyXVtjXVxyXG5cclxuICBpbml0aWFsaXplOiAoY2VsbHMpID0+XHJcbiAgICBmb3Igcm93IGluIFswLi5AaW5mby5yb3dzXVxyXG4gICAgICBjZWxscy5wdXNoIFtdXHJcbiAgICAgIGZvciBjb2wgaW4gWzAuLkBpbmZvLmNvbHVtbnNdXHJcbiAgICAgICAgY2VsbHNbcm93XS5wdXNoIG5ldyBDZWxsKClcclxuXHJcbiAgZHJhdzogKGNXaWR0aCwgY0hlaWdodCwgY1NwYWNpbmcpIC0+XHJcbiAgICBjdHggPSBAY29udGV4dFxyXG5cclxuICAgIGZvciByb3cgaW4gWzAuLkBpbmZvLnJvd3NdXHJcbiAgICAgIGZvciBjb2wgaW4gWzAuLkBpbmZvLmNvbHVtbnNdXHJcbiAgICAgICAgaWYgQGN1cnJlbnRbcm93XVtjb2xdLmFsaXZlXHJcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoI3syNTUtU3RyaW5nKEBjdXJyZW50W3Jvd11bY29sXS5hZ2UqNSl9LCAje1N0cmluZyhAY3VycmVudFtyb3ddW2NvbF0uYWdlKjIwKX0sICN7U3RyaW5nKEBjdXJyZW50W3Jvd11bY29sXS5hZ2UqMTApfSlcIlxyXG4gICAgICAgICAgY3R4LmZpbGxSZWN0IChjb2wqY1dpZHRoKSpjU3BhY2luZywgKHJvdypjSGVpZ2h0KSpjU3BhY2luZywgY1dpZHRoLCBjSGVpZ2h0XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgYWxnb3JpdGhtczogYWxnb3JpdGhtc1xyXG4gIENlbGw6IENlbGxcclxuICBHcmlkOiBHcmlkIiwibGlmZSA9IHJlcXVpcmUgXCIuL2xpZmUuY29mZmVlXCJcclxudXRpbCA9IHJlcXVpcmUgXCIuL3V0aWwuY29mZmVlXCJcclxuXHJcbmNsYXNzIEFwcFxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQHBhdXNlZCA9IGZhbHNlXHJcbiAgICBAZG9tID0gQGdldERvbUVsZW1lbnRzKClcclxuXHJcbiAgICBAY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaWZlLWNhbnZhc1wiKVxyXG4gICAgQGNvbnRleHQgPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgdXRpbC5hdWdtZW50Q29udGV4dChAY29udGV4dClcclxuXHJcbiAgICBAdmlldyA9IG5ldyB1dGlsLlZpZXcodGhpcylcclxuXHJcbiAgICBAcmVzaXplQ2FudmFzKClcclxuICAgIEBncmlkID0gQGluaXRpYWxpemVHcmlkKDUsIDUpXHJcblxyXG4gIHN0YXJ0OiAtPlxyXG4gICAgQGJpbmRWaWV3RXZlbnRzKEB2aWV3LmUpXHJcbiAgICBAYmluZEJ1dHRvbkV2ZW50cyhAZG9tLmJ1dHRvbnMpXHJcbiAgICBAaW5pdGlhbGl6ZUxvb3AoNTApXHJcblxyXG4gIHJlc2l6ZUNhbnZhczogLT5cclxuICAgIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBAZG9tLnRvb2xiYXIuaGVpZ2h0KCkgLSA1MFxyXG4gICAgQGRvbS5jYW52YXMuaGVpZ2h0KGgpXHJcbiAgICBAY29udGV4dC5jYW52YXMud2lkdGggPSBAZG9tLmNvbnRhaW5lci53aWR0aCgpXHJcbiAgICBAY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gaFxyXG5cclxuICBpbml0aWFsaXplR3JpZDogKGNlbGxXaWR0aCwgY2VsbEhlaWdodCkgLT5cclxuICAgIHJldHVybiBuZXcgbGlmZS5HcmlkKEBjb250ZXh0LCBAY29udGV4dC5jYW52YXMud2lkdGgvY2VsbFdpZHRoLCBNYXRoLmZsb29yKEBjb250ZXh0LmNhbnZhcy5oZWlnaHQvY2VsbEhlaWdodCkpXHJcblxyXG4gIGdldERvbUVsZW1lbnRzOiAtPlxyXG4gICAgY29udGFpbmVyOiAkKFwiLm1haW5cIilcclxuICAgIHRvb2xiYXI6ICQoXCJuYXZcIilcclxuICAgIGNhbnZhczogJChcIiNsaWZlLWNhbnZhc1wiKVxyXG4gICAgYnV0dG9uczpcclxuICAgICAgcGF1c2U6ICQoXCIucGF1c2VcIilcclxuICAgICAgY2xlYXI6ICQoXCIuY2xlYXItYm9hcmRcIilcclxuXHJcbiAgYmluZEJ1dHRvbkV2ZW50czogKGJ1dHRvbnMpIC0+XHJcbiAgICBidXR0b25zLnBhdXNlLmNsaWNrIChlKSA9PlxyXG4gICAgICBpZiBAcGF1c2VkXHJcbiAgICAgICAgQHBhdXNlZCA9IGZhbHNlXHJcbiAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoXCJnbHlwaGljb24tcGxheVwiKS5hZGRDbGFzcyhcImdseXBoaWNvbi1wYXVzZVwiKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQHBhdXNlZCA9IHRydWVcclxuICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcyhcImdseXBoaWNvbi1wYXVzZVwiKS5hZGRDbGFzcyhcImdseXBoaWNvbi1wbGF5XCIpXHJcblxyXG4gICAgYnV0dG9ucy5jbGVhci5jbGljayA9PlxyXG4gICAgICBAcmVzaXplQ2FudmFzKClcclxuICAgICAgQGdyaWQgPSBAaW5pdGlhbGl6ZUdyaWQoNSwgNSkgI2dyaWQgPSBuZXcgbGlmZS5HcmlkKGN0eCwgJChcIi5tYWluXCIpLndpZHRoKCkvNSwgODApXHJcblxyXG4gIGJpbmRWaWV3RXZlbnRzOiAodmlld0V2ZW50cykgLT5cclxuICAgIHZpZXdFdmVudHMub24gXCJtb3VzZWRvd25cIiwgKGUpID0+XHJcbiAgICAgICNwYXVzZWQgPSB0cnVlXHJcbiAgICAgIHB0ID0gQGNvbnRleHQudHJhbnNmb3JtZWRQb2ludChlLm1vdXNlLngsIGUubW91c2UueSlcclxuICAgICAgQGdyaWQuY3VycmVudFtNYXRoLmZsb29yKHB0LnkvNSldW01hdGguZmxvb3IocHQueC81KV0uYWxpdmUgPSB0cnVlXHJcblxyXG4gICAgdmlld0V2ZW50cy5vbiBcIm1vdXNlbW92ZVwiLCAoZSkgPT5cclxuICAgICAgaWYgZS5tb3VzZS5kb3duXHJcbiAgICAgICAgcHQgPSBAY29udGV4dC50cmFuc2Zvcm1lZFBvaW50KGUubW91c2UueCwgZS5tb3VzZS55KVxyXG4gICAgICAgIEBncmlkLmN1cnJlbnRbTWF0aC5mbG9vcihwdC55LzUpXVtNYXRoLmZsb29yKHB0LngvNSldLmFsaXZlID0gdHJ1ZVxyXG5cclxuICAgIHZpZXdFdmVudHMub24gXCJtb3VzZXdoZWVsXCIsIHV0aWwuem9vbVxyXG5cclxuICBpbml0aWFsaXplTG9vcDogKG1zKSAtPlxyXG4gICAgd2luZG93LnNldEludGVydmFsID0+XHJcbiAgICAgIHAxID0gQGNvbnRleHQudHJhbnNmb3JtZWRQb2ludCgwLCAwKVxyXG4gICAgICBwMiA9IEBjb250ZXh0LnRyYW5zZm9ybWVkUG9pbnQoQGNvbnRleHQuY2FudmFzLndpZHRoLCBAY29udGV4dC5jYW52YXMuaGVpZ2h0KVxyXG4gICAgICBAY29udGV4dC5jbGVhclJlY3QgcDEueCwgcDEueSwgcDIueC1wMS54LCBwMi55LXAxLnlcclxuXHJcbiAgICAgIHVubGVzcyBAdmlldy5tb3VzZS5kb3duIG9yIEBwYXVzZWRcclxuICAgICAgICBAZ3JpZC51cGRhdGUobGlmZS5hbGdvcml0aG1zLmxpZmUpXHJcbiAgICAgIEBncmlkLmRyYXcoNSwgNSwgMSlcclxuICAgICxcclxuICAgICAgbXNcclxuXHJcbiQgLT5cclxuICBhcHAgPSBuZXcgQXBwKClcclxuICBhcHAuc3RhcnQoKSIsImV2ZW50cyA9IHJlcXVpcmUgXCJldmVudHNcIlxyXG5cclxuIyBhZGFwdGVkIGZyb20gaHR0cDovL3Bocm9nei5uZXQvdG1wL2NhbnZhc196b29tX3RvX2N1cnNvci5odG1sXHJcbmF1Z21lbnRDb250ZXh0ID0gKGN0eCkgLT5cclxuICBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCdzdmcnXHJcbiAgeGZvcm0gPSBzdmcuY3JlYXRlU1ZHTWF0cml4KClcclxuICBjdHguZ2V0VHJhbnNmb3JtID0gLT4geGZvcm1cclxuICBzYXZlZFRyYW5zZm9ybXMgPSBbXVxyXG4gIHNhdmUgPSBjdHguc2F2ZVxyXG4gIGN0eC5zYXZlID0gLT5cclxuICAgIHNhdmVkVHJhbnNmb3Jtcy5wdXNoIHhmb3JtLnRyYW5zbGF0ZSAwLDBcclxuICAgIHJldHVybiBzYXZlLmNhbGwoY3R4KVxyXG5cclxuICByZXN0b3JlID0gY3R4LnJlc3RvcmVcclxuICBjdHgucmVzdG9yZSA9IC0+XHJcbiAgICB4Zm9ybSA9IHNhdmVkVHJhbnNmb3Jtcy5wb3AoKVxyXG4gICAgcmV0dXJuIHJlc3RvcmUuY2FsbChjdHgpXHJcblxyXG4gIHNjYWxlID0gY3R4LnNjYWxlXHJcbiAgY3R4LnNjYWxlID0gKHN4LCBzeSkgLT5cclxuICAgIHhmb3JtID0geGZvcm0uc2NhbGVOb25Vbmlmb3JtKHN4LCBzeSlcclxuICAgIHJldHVybiBzY2FsZS5jYWxsKGN0eCwgc3gsIHN5KVxyXG5cclxuICByb3RhdGUgPSBjdHgucm90YXRlXHJcbiAgY3R4LnJvdGF0ZSA9IChyYWRpYW5zKSAtPlxyXG4gICAgeGZvcm0gPSB4Zm9ybS5yb3RhdGUocmFkaWFucyoxODAvTWF0aC5QSSlcclxuICAgIHJldHVybiByb3RhdGUuY2FsbChjdHgsIHJhZGlhbnMpXHJcblxyXG4gIHRyYW5zbGF0ZSA9IGN0eC50cmFuc2xhdGVcclxuICBjdHgudHJhbnNsYXRlID0gKGR4LCBkeSkgLT5cclxuICAgIHhmb3JtID0geGZvcm0udHJhbnNsYXRlKGR4LCBkeSlcclxuICAgIHJldHVybiB0cmFuc2xhdGUuY2FsbChjdHgsIGR4LCBkeSlcclxuXHJcbiAgdHJhbnNmb3JtID0gY3R4LnRyYW5zZm9ybVxyXG4gIGN0eC50cmFuc2Zvcm0gPSAoYSwgYiwgYywgZCwgZSwgZikgLT5cclxuICAgIG0yID0gc3ZnLmNyZWF0ZVNWR01hdHJpeCgpXHJcbiAgICBbbTIuYSwgbTIuYiwgbTIuYywgbTIuZCwgbTIuZSwgbTIuZl0gPSBbYSwgYiwgYywgZCwgZSwgZl1cclxuICAgIHhmb3JtID0geGZvcm0ubXVsdGlwbHkgbTJcclxuICAgIHJldHVybiB0cmFuc2Zvcm0uY2FsbChjdHgsIGEsIGIsIGMsIGQsIGUsIGYpXHJcblxyXG4gIHNldFRyYW5zZm9ybSA9IGN0eC5zZXRUcmFuc2Zvcm1cclxuICBjdHguc2V0VHJhbnNmb3JtID0gKGEsIGIsIGMsIGQsIGUsIGYpIC0+XHJcbiAgICB4Zm9ybS5hID0gYVxyXG4gICAgeGZvcm0uYiA9IGJcclxuICAgIHhmb3JtLmMgPSBjXHJcbiAgICB4Zm9ybS5kID0gZFxyXG4gICAgeGZvcm0uZSA9IGVcclxuICAgIHhmb3JtLmYgPSBmXHJcbiAgICByZXR1cm4gc2V0VHJhbnNmb3JtLmNhbGwoY3R4LCBhLCBiLCBjLCBkLCBlLCBmKVxyXG5cclxuICBwdCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpXHJcbiAgY3R4LnRyYW5zZm9ybWVkUG9pbnQgPSAoeCwgeSkgLT5cclxuICAgIFtwdC54LCBwdC55XSA9IFt4LCB5XVxyXG4gICAgcmV0dXJuIHB0Lm1hdHJpeFRyYW5zZm9ybSh4Zm9ybS5pbnZlcnNlKCkpXHJcblxyXG4gIGN0eC51blRyYW5zZm9ybWVkUG9pbnQgPSAoeCwgeSkgLT5cclxuICAgIFtwdC54LCBwdC55XSA9IFt4LCB5XVxyXG4gICAgcmV0dXJuIHB0Lm1hdHJpeFRyYW5zZm9ybSh4Zm9ybSlcclxuXHJcbnpvb20gPSAoZSkgLT5cclxuICBjdHggPSBlLmpxLnRhcmdldC5nZXRDb250ZXh0KFwiMmRcIilcclxuICBwdCA9IGN0eC50cmFuc2Zvcm1lZFBvaW50KE1hdGgucm91bmQoZS5tb3VzZS54KSoxLjAsIE1hdGgucm91bmQoZS5tb3VzZS55KSoxLjApXHJcbiAgY3R4LnRyYW5zbGF0ZShwdC54LCBwdC55KVxyXG4gIGZhY3RvciA9IE1hdGgucG93KDEuMSwgZS5kZWx0YSlcclxuICBjdHguc2NhbGUoZmFjdG9yLCBmYWN0b3IpXHJcbiAgY3R4LnRyYW5zbGF0ZSgtcHQueCwgLXB0LnkpXHJcblxyXG5jbGFzcyBWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwKSAtPlxyXG4gICAgQGNvbnRleHQgPSBAYXBwLmNvbnRleHRcclxuXHJcbiAgICBAbW91c2Vkb3duID0gZmFsc2VcclxuXHJcbiAgICBAbW91c2UgPVxyXG4gICAgICBkb3duOiBmYWxzZVxyXG4gICAgICB4OiAwXHJcbiAgICAgIHk6IDBcclxuICAgICAgbG9jYWw6XHJcbiAgICAgICAgeDogMFxyXG4gICAgICAgIHk6IDBcclxuXHJcbiAgICBAZSA9IEB3cmFwRXZlbnRzICQoQGNvbnRleHQuY2FudmFzKVxyXG5cclxuICB3cmFwRXZlbnRzOiAoJGN0eCwgZW1pdHRlcikgLT5cclxuICAgIGVtaXR0ZXIgPSBuZXcgZXZlbnRzLkV2ZW50RW1pdHRlcigpXHJcbiAgICAkY3R4Lm9uIFwibW91c2Vkb3duXCIsIChqcWUpID0+XHJcbiAgICAgIEBtb3VzZS5kb3duID0gdHJ1ZVxyXG4gICAgICBAdXBkYXRlTW91c2UoanFlKVxyXG4gICAgICBlbWl0dGVyLmVtaXQgXCJtb3VzZWRvd25cIiwge2pxOiBqcWUsIG1vdXNlOiBAbW91c2V9XHJcblxyXG4gICAgJGN0eC5vbiBcIm1vdXNldXBcIiwgKGpxZSkgPT5cclxuICAgICAgQG1vdXNlLmRvd24gPSBmYWxzZVxyXG4gICAgICBlbWl0dGVyLmVtaXQgXCJtb3VzZXVwXCIsIHtqcToganFlLCBtb3VzZTogQG1vdXNlfVxyXG5cclxuICAgICRjdHgub24gXCJtb3VzZW1vdmVcIiwgKGpxZSkgPT5cclxuICAgICAgQHVwZGF0ZU1vdXNlKGpxZSlcclxuICAgICAgZW1pdHRlci5lbWl0IFwibW91c2Vtb3ZlXCIsIHtqcToganFlLCBtb3VzZTogQG1vdXNlfVxyXG5cclxuICAgICRjdHguYmluZCAnbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCcsIChqcWUpID0+XHJcbiAgICAgICNAdXBkYXRlTW91c2UoanFlKVxyXG4gICAgICBvRXZ0ID0ganFlLm9yaWdpbmFsRXZlbnRcclxuICAgICAgZGVsdGEgPSBpZiBvRXZ0LndoZWVsRGVsdGE/XHJcbiAgICAgICAgb0V2dC53aGVlbERlbHRhLzQwXHJcbiAgICAgIGVsc2UgaWYgb0V2dC5kZXRhaWw/XHJcbiAgICAgICAgLW9FdnQuZGV0YWlsXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAwXHJcbiAgICAgIGVtaXR0ZXIuZW1pdCBcIm1vdXNld2hlZWxcIiwge2pxOiBqcWUsIG1vdXNlOiBAbW91c2UsIGRlbHRhOiBkZWx0YX1cclxuICAgICAgcmV0dXJuIG9FdnQucHJldmVudERlZmF1bHQoKSBhbmQgZmFsc2VcclxuXHJcbiAgICByZXR1cm4gZW1pdHRlclxyXG5cclxuICB1cGRhdGVNb3VzZTogKGpxZSkgPT5cclxuICAgIEBtb3VzZS54ID0gKGpxZS5wYWdlWCAtICQoQGNvbnRleHQuY2FudmFzKS5vZmZzZXQoKS5sZWZ0KVxyXG4gICAgQG1vdXNlLnkgPSAoanFlLnBhZ2VZIC0gJChAY29udGV4dC5jYW52YXMpLm9mZnNldCgpLnRvcClcclxuICAgIEBtb3VzZS5sb2NhbC54ID0gKGpxZS5wYWdlWCAtICQoQGNvbnRleHQuY2FudmFzKS5vZmZzZXQoKS5sZWZ0KVxyXG4gICAgQG1vdXNlLmxvY2FsLnkgPSAoanFlLnBhZ2VZIC0gJChAY29udGV4dC5jYW52YXMpLm9mZnNldCgpLnRvcClcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBWaWV3OiBWaWV3XHJcbiAgYXVnbWVudENvbnRleHQ6IGF1Z21lbnRDb250ZXh0XHJcbiAgem9vbTogem9vbSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiJdfQ==
