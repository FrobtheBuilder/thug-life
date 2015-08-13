life = require "./life.coffee"
util = require "./util.coffee"

class App
  constructor: ->
    @paused = false
    @dom = @getDomElements()

    @canvas = document.getElementById("life-canvas")
    @context = @canvas.getContext("2d")
    util.augmentContext(@context)

    @view = new util.View(this)

    @resizeCanvas()
    @grid = @initializeGrid(5, 5)

  start: ->
    @bindViewEvents(@view.e)
    @bindButtonEvents(@dom.buttons)
    @initializeLoop(50)

  resizeCanvas: ->
    h = window.innerHeight - @dom.toolbar.height() - 50
    @dom.canvas.height(h)
    @context.canvas.width = @dom.container.width()
    @context.canvas.height = h

  initializeGrid: (cellWidth, cellHeight) ->
    return new life.Grid(@context, @context.canvas.width/cellWidth, Math.floor(@context.canvas.height/cellHeight))

  getDomElements: ->
    container: $(".main")
    toolbar: $("nav")
    canvas: $("#life-canvas")
    buttons:
      pause: $(".pause")
      clear: $(".clear-board")

  bindButtonEvents: (buttons) ->
    buttons.pause.click (e) =>
      if @paused
        @paused = false
        $(e.target).removeClass("glyphicon-play").addClass("glyphicon-pause")
      else
        @paused = true
        $(e.target).removeClass("glyphicon-pause").addClass("glyphicon-play")

    buttons.clear.click =>
      @resizeCanvas()
      @grid = @initializeGrid(5, 5) #grid = new life.Grid(ctx, $(".main").width()/5, 80)

  bindViewEvents: (viewEvents) ->
    viewEvents.on "mousedown", (e) =>
      #paused = true
      pt = @context.transformedPoint(e.mouse.x, e.mouse.y)
      @grid.current[Math.floor(pt.y/5)][Math.floor(pt.x/5)].alive = true

    viewEvents.on "mousemove", (e) =>
      if e.mouse.down
        pt = @context.transformedPoint(e.mouse.x, e.mouse.y)
        @grid.current[Math.floor(pt.y/5)][Math.floor(pt.x/5)].alive = true

    viewEvents.on "mousewheel", util.zoom

  initializeLoop: (ms) ->
    window.setInterval =>
      p1 = @context.transformedPoint(0, 0)
      p2 = @context.transformedPoint(@context.canvas.width, @context.canvas.height)
      @context.clearRect p1.x, p1.y, p2.x-p1.x, p2.y-p1.y

      unless @view.mouse.down or @paused
        @grid.update(life.algorithms.life)
      @grid.draw(5, 5, 1)
    ,
      ms

$ ->
  app = new App()
  app.start()