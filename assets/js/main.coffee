life = require "./life.coffee"
util = require "./util.coffee"

class App
  constructor: ->

    @paused = false
    @dom = @getDomElements()

    @canvas = document.getElementById("life-canvas")
    @context = @canvas.getContext("2d")

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

  initializeGrid: (rows, cols) ->
    return new life.Grid(@context, @context.canvas.width/cols, Math.floor(@context.canvas.height/rows))

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
      @grid.current[Math.floor(e.mouse.y/5)][Math.floor(e.mouse.x/5)].alive = true

    viewEvents.on "mousemove", (e) =>
      if e.mouse.down
        @grid.current[Math.floor(e.mouse.y/5)][Math.floor(e.mouse.x/5)].alive = true

    viewEvents.on "mousewheel", (e) =>
      if e.up
        @view.zoom (e.mouse.x + @view.viewport().center.x)/2, (e.mouse.y + @view.viewport().center.y)/2, 0.05
      else
        @view.zoom @view.viewport().width - (e.mouse.x + @view.viewport().center.x)/2, @view.viewport().height - (e.mouse.y + @view.viewport().center.y)/2, -0.2

  initializeLoop: (ms) ->
    window.setInterval =>
      @context.clearRect 0, 0, @context.canvas.width, @context.canvas.height

      unless @view.mouse.down or @paused
        @grid.update(life.algorithms.life)
      @grid.draw(5, 5, 1)
    ,
      ms

$ ->
  app = new App()
  app.start()