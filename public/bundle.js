(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cell, Grid, life,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

life = function(c, alive) {
  var livingNeighbors;
  livingNeighbors = c.reduce((function(acc, e) {
    if (e) {
      return acc + 1;
    } else {
      return acc;
    }
  }), 0);
  if ((alive && (livingNeighbors === 2 || livingNeighbors === 3)) || (!alive && livingNeighbors === 3)) {
    return true;
  } else {
    return false;
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
        chunk = [this.current[n.above][n.left], this.current[n.above][col], this.current[n.above][n.right], this.current[row][n.left], this.current[row][n.right], this.current[n.below][n.left], this.current[n.below][col], this.current[n.below][n.right]];
        this.next[row][col].alive = algo(chunk.map(function(x) {
          return x.alive;
        }), cell.alive);
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
  algorithms: {
    life: life
  },
  Cell: Cell,
  Grid: Grid
};


},{}],2:[function(require,module,exports){
var life;

life = require("./life.coffee");

$(function() {
  var canvas, ctx, grid, paused, press;
  canvas = document.getElementById("life-canvas");
  ctx = canvas.getContext("2d");
  ctx.canvas.height = 800;
  grid = new life.Grid(ctx, $(".main").width() / 5, 80);
  press = false;
  paused = false;
  $("#life-canvas").on("mousedown", function(e) {
    return press = true;
  });
  $("#life-canvas").on("mouseup", function() {
    return press = false;
  });
  $("#life-canvas").mousemove(function(e) {
    var x, y;
    if (press) {
      x = Math.floor((e.pageX - $("#life-canvas").offset().left) / 5);
      y = Math.floor((e.pageY - $("#life-canvas").offset().top) / 5);
      return grid.current[y][x].alive = true;
    }
  });
  $(".pause").click(function(e) {
    if (paused) {
      return paused = false;
    } else {
      return paused = true;
    }
  });
  $(".clear-board").click(function() {
    return grid = new life.Grid(ctx, $(".main").width() / 5, 80);
  });
  $("#life-canvas").click(function(e) {
    var x, y;
    x = Math.floor((e.pageX - $("#life-canvas").offset().left) / 5);
    y = Math.floor((e.pageY - $("#life-canvas").offset().top) / 5);
    return grid.current[y][x].alive = true;
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


},{"./life.coffee":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXEZyb2JcXERyb3Bib3hcXHByb2plY3RzXFx0aHVnLWxpZmVcXGFzc2V0c1xcanNcXGxpZmUuY29mZmVlIiwiQzpcXFVzZXJzXFxGcm9iXFxEcm9wYm94XFxwcm9qZWN0c1xcdGh1Zy1saWZlXFxhc3NldHNcXGpzXFxtYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsZ0JBQUE7RUFBQTs7QUFBQSxJQUFBLEdBQU8sU0FBQyxDQUFELEVBQUksS0FBSjtBQUNMLE1BQUE7RUFBQSxlQUFBLEdBQWtCLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBQyxTQUFDLEdBQUQsRUFBTSxDQUFOO0lBQVksSUFBRyxDQUFIO2FBQVUsR0FBQSxHQUFJLEVBQWQ7S0FBQSxNQUFBO2FBQXFCLElBQXJCOztFQUFaLENBQUQsQ0FBVCxFQUFpRCxDQUFqRDtFQUNsQixJQUFHLENBQUMsS0FBQSxJQUFVLENBQUMsZUFBQSxLQUFtQixDQUFuQixJQUF3QixlQUFBLEtBQW1CLENBQTVDLENBQVgsQ0FBQSxJQUE4RCxDQUFDLENBQUksS0FBSixJQUFjLGVBQUEsS0FBbUIsQ0FBbEMsQ0FBakU7V0FDRSxLQURGO0dBQUEsTUFBQTtXQUdFLE1BSEY7O0FBRks7O0FBT0Q7RUFDUyxjQUFBO0lBQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxHQUFELEdBQU87RUFGSTs7aUJBSWIsTUFBQSxHQUFRLFNBQUMsTUFBRDtJQUNOLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBQyxDQUFBO1dBQ2hCLE1BQU0sQ0FBQyxHQUFQLEdBQWEsSUFBQyxDQUFBO0VBRlI7Ozs7OztBQUlKO0VBQ1MsY0FBQyxPQUFELEVBQVcsS0FBWCxFQUFrQixNQUFsQixFQUEwQixTQUExQixFQUF1QyxVQUF2QyxFQUFxRCxXQUFyRDtJ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QUMsTUFBbEIsQ0FBQSxDQUEwQixDQUFDLElBQXRDLENBQUEsR0FBNEMsQ0FBdkQ7SUFDSixDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQSxDQUFFLGNBQUYsQ0FBaUIsQ0FBQyxNQUFsQixDQUFBLENBQTBCLENBQUMsR0FBdEMsQ0FBQSxHQUEyQyxDQUF0RDtXQUVKLElBQUksQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBbkIsR0FBMkI7RUFKTCxDQUF4QjtTQU1BLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFNBQUE7SUFFakIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFYLEdBQW1CLENBQUEsQ0FBRSxPQUFGLENBQVUsQ0FBQyxLQUFYLENBQUE7SUFDbkIsR0FBRyxDQUFDLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLE1BQU0sQ0FBQyxLQUEzQixFQUFrQyxNQUFNLENBQUMsTUFBekM7SUFFQSxJQUFBLENBQUEsQ0FBTyxLQUFBLElBQVMsTUFBaEIsQ0FBQTtNQUNFLElBQUksQ0FBQyxNQUFMLENBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUE1QixFQURGOztXQUVBLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEI7RUFQaUIsQ0FBbkIsRUFTRSxFQVRGO0FBakNBLENBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGlmZSA9IChjLCBhbGl2ZSkgLT5cclxuICBsaXZpbmdOZWlnaGJvcnMgPSBjLnJlZHVjZSAoKGFjYywgZSkgLT4gaWYgZSB0aGVuIGFjYysxIGVsc2UgYWNjKSwgMFxyXG4gIGlmIChhbGl2ZSBhbmQgKGxpdmluZ05laWdoYm9ycyBpcyAyIG9yIGxpdmluZ05laWdoYm9ycyBpcyAzKSkgb3IgKG5vdCBhbGl2ZSBhbmQgbGl2aW5nTmVpZ2hib3JzIGlzIDMpXHJcbiAgICB0cnVlXHJcbiAgZWxzZVxyXG4gICAgZmFsc2VcclxuXHJcbmNsYXNzIENlbGxcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBhbGl2ZSA9IGZhbHNlXHJcbiAgICBAYWdlID0gMFxyXG5cclxuICBjb3B5VG86ICh0YXJnZXQpIC0+XHJcbiAgICB0YXJnZXQuYWxpdmUgPSBAYWxpdmVcclxuICAgIHRhcmdldC5hZ2UgPSBAYWdlXHJcblxyXG5jbGFzcyBHcmlkXHJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgd2lkdGgsIGhlaWdodCwgY2VsbFdpZHRoPTUsIGNlbGxIZWlnaHQ9NSwgY2VsbFNwYWNpbmc9MS4yKSAtPlxyXG4gICAgQGluZm8gPVxyXG4gICAgICByb3dzOiBoZWlnaHRcclxuICAgICAgY29sdW1uczogd2lkdGhcclxuICAgICAgY2VsbDpcclxuICAgICAgICB3aWR0aDogY2VsbFdpZHRoXHJcbiAgICAgICAgaGVpZ2h0OiBjZWxsSGVpZ2h0XHJcbiAgICAgICAgc3BhY2luZzogY2VsbFNwYWNpbmdcclxuXHJcbiAgICBAY3VycmVudCA9IFtdXHJcbiAgICBAbmV4dCA9IFtdXHJcblxyXG4gICAgQGluaXRpYWxpemUoQGN1cnJlbnQpXHJcbiAgICBAaW5pdGlhbGl6ZShAbmV4dClcclxuICAgIGNvbnNvbGUubG9nIEBjdXJyZW50XHJcblxyXG4gIHVwZGF0ZTogKGFsZ28pIC0+XHJcbiAgICBmb3Igcm93IGluIFswLi5AaW5mby5yb3dzXVxyXG4gICAgICBmb3IgY29sIGluIFswLi5AaW5mby5jb2x1bW5zXVxyXG4gICAgICAgIGNlbGwgPSBAY3VycmVudFtyb3ddW2NvbF1cclxuICAgICAgICBuID1cclxuICAgICAgICAgIGxlZnQ6IChpZiBjb2wgPiAxIHRoZW4gY29sIC0gMSBlbHNlIEBpbmZvLmNvbHVtbnMpXHJcbiAgICAgICAgICByaWdodDogKGNvbCArIDEpICUgKEBpbmZvLmNvbHVtbnMpXHJcbiAgICAgICAgICBhYm92ZTogKGlmIHJvdyA+IDEgdGhlbiByb3cgLSAxIGVsc2UgQGluZm8ucm93cylcclxuICAgICAgICAgIGJlbG93OiAocm93ICsgMSkgJSAoQGluZm8ucm93cylcclxuXHJcbiAgICAgICAgY2h1bmsgPSBbXHJcbiAgICAgICAgICBAY3VycmVudFtuLmFib3ZlXVtuLmxlZnRdLCBAY3VycmVudFtuLmFib3ZlXVtjb2xdLCBAY3VycmVudFtuLmFib3ZlXVtuLnJpZ2h0XSxcclxuICAgICAgICAgIEBjdXJyZW50W3Jvd11bbi5sZWZ0XSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBjdXJyZW50W3Jvd11bbi5yaWdodF0sXHJcbiAgICAgICAgICBAY3VycmVudFtuLmJlbG93XVtuLmxlZnRdLCBAY3VycmVudFtuLmJlbG93XVtjb2xdLCBAY3VycmVudFtuLmJlbG93XVtuLnJpZ2h0XVxyXG4gICAgICAgIF1cclxuXHJcbiAgICAgICAgQG5leHRbcm93XVtjb2xdLmFsaXZlID0gYWxnbyhjaHVuay5tYXAoKHgpIC0+IHguYWxpdmUpLCBjZWxsLmFsaXZlKVxyXG4gICAgICAgIGlmIEBjdXJyZW50W3Jvd11bY29sXS5hbGl2ZSBhbmQgQGN1cnJlbnRbcm93XVtjb2xdLmFsaXZlIGlzIEBuZXh0W3Jvd11bY29sXS5hbGl2ZVxyXG4gICAgICAgICAgQG5leHRbcm93XVtjb2xdLmFnZSArPSAxXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQG5leHRbcm93XVtjb2xdLmFnZSA9IDBcclxuXHJcbiAgICBmb3IgciBpbiBbMC4uQGluZm8ucm93c11cclxuICAgICAgZm9yIGMgaW4gWzAuLkBpbmZvLmNvbHVtbnNdXHJcbiAgICAgICAgQG5leHRbcl1bY10uY29weVRvIEBjdXJyZW50W3JdW2NdXHJcblxyXG4gIGluaXRpYWxpemU6IChjZWxscykgPT5cclxuICAgIGZvciByb3cgaW4gWzAuLkBpbmZvLnJvd3NdXHJcbiAgICAgIGNlbGxzLnB1c2ggW11cclxuICAgICAgZm9yIGNvbCBpbiBbMC4uQGluZm8uY29sdW1uc11cclxuICAgICAgICBjZWxsc1tyb3ddLnB1c2ggbmV3IENlbGwoKVxyXG5cclxuICBkcmF3OiAoY1dpZHRoLCBjSGVpZ2h0LCBjU3BhY2luZykgLT5cclxuICAgIGN0eCA9IEBjb250ZXh0XHJcblxyXG4gICAgZm9yIHJvdyBpbiBbMC4uQGluZm8ucm93c11cclxuICAgICAgZm9yIGNvbCBpbiBbMC4uQGluZm8uY29sdW1uc11cclxuICAgICAgICBpZiBAY3VycmVudFtyb3ddW2NvbF0uYWxpdmVcclxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigjezI1NS1TdHJpbmcoQGN1cnJlbnRbcm93XVtjb2xdLmFnZSo1KX0sICN7U3RyaW5nKEBjdXJyZW50W3Jvd11bY29sXS5hZ2UqMjApfSwgI3tTdHJpbmcoQGN1cnJlbnRbcm93XVtjb2xdLmFnZSoxMCl9KVwiXHJcbiAgICAgICAgICBjdHguZmlsbFJlY3QgKGNvbCpjV2lkdGgpKmNTcGFjaW5nLCAocm93KmNIZWlnaHQpKmNTcGFjaW5nLCBjV2lkdGgsIGNIZWlnaHRcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBhbGdvcml0aG1zOlxyXG4gICAgbGlmZTogbGlmZVxyXG4gIENlbGw6IENlbGxcclxuICBHcmlkOiBHcmlkIiwibGlmZSA9IHJlcXVpcmUgXCIuL2xpZmUuY29mZmVlXCJcclxuXHJcbiQgLT5cclxuICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpZmUtY2FudmFzXCIpXHJcbiAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gIGN0eC5jYW52YXMuaGVpZ2h0ID0gODAwXHJcblxyXG4gIGdyaWQgPSBuZXcgbGlmZS5HcmlkKGN0eCwgJChcIi5tYWluXCIpLndpZHRoKCkvNSwgODApXHJcbiAgcHJlc3MgPSBmYWxzZVxyXG4gIHBhdXNlZCA9IGZhbHNlXHJcblxyXG4gICQoXCIjbGlmZS1jYW52YXNcIikub24gXCJtb3VzZWRvd25cIiwgKGUpIC0+XHJcbiAgICBwcmVzcyA9IHRydWVcclxuICAkKFwiI2xpZmUtY2FudmFzXCIpLm9uIFwibW91c2V1cFwiLCAtPlxyXG4gICAgcHJlc3MgPSBmYWxzZVxyXG5cclxuICAkKFwiI2xpZmUtY2FudmFzXCIpLm1vdXNlbW92ZSAoZSkgLT5cclxuICAgIGlmIHByZXNzXHJcbiAgICAgIHggPSBNYXRoLmZsb29yIChlLnBhZ2VYIC0gJChcIiNsaWZlLWNhbnZhc1wiKS5vZmZzZXQoKS5sZWZ0KS81XHJcbiAgICAgIHkgPSBNYXRoLmZsb29yIChlLnBhZ2VZIC0gJChcIiNsaWZlLWNhbnZhc1wiKS5vZmZzZXQoKS50b3ApLzVcclxuICAgICAgZ3JpZC5jdXJyZW50W3ldW3hdLmFsaXZlID0gdHJ1ZVxyXG5cclxuICAkKFwiLnBhdXNlXCIpLmNsaWNrIChlKSAtPlxyXG4gICAgaWYgcGF1c2VkIHRoZW4gcGF1c2VkID0gZmFsc2UgZWxzZSBwYXVzZWQgPSB0cnVlXHJcblxyXG4gICQoXCIuY2xlYXItYm9hcmRcIikuY2xpY2sgLT5cclxuICAgIGdyaWQgPSBuZXcgbGlmZS5HcmlkKGN0eCwgJChcIi5tYWluXCIpLndpZHRoKCkvNSwgODApXHJcblxyXG5cclxuICAkKFwiI2xpZmUtY2FudmFzXCIpLmNsaWNrIChlKSAtPlxyXG4gICAgeCA9IE1hdGguZmxvb3IgKGUucGFnZVggLSAkKFwiI2xpZmUtY2FudmFzXCIpLm9mZnNldCgpLmxlZnQpLzVcclxuICAgIHkgPSBNYXRoLmZsb29yIChlLnBhZ2VZIC0gJChcIiNsaWZlLWNhbnZhc1wiKS5vZmZzZXQoKS50b3ApLzVcclxuXHJcbiAgICBncmlkLmN1cnJlbnRbeV1beF0uYWxpdmUgPSB0cnVlXHJcblxyXG4gIHdpbmRvdy5zZXRJbnRlcnZhbCAtPlxyXG5cclxuICAgIGN0eC5jYW52YXMud2lkdGggPSAkKFwiLm1haW5cIikud2lkdGgoKVxyXG4gICAgY3R4LmNsZWFyUmVjdCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHRcclxuXHJcbiAgICB1bmxlc3MgcHJlc3Mgb3IgcGF1c2VkXHJcbiAgICAgIGdyaWQudXBkYXRlKGxpZmUuYWxnb3JpdGhtcy5saWZlKVxyXG4gICAgZ3JpZC5kcmF3KDUsIDUsIDEpXHJcbiAgLFxyXG4gICAgNTAiXX0=
