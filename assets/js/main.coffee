life = require "./life.coffee"
util = require "./util.coffee"

$ ->
  canvas = document.getElementById("life-canvas")
  ctx = canvas.getContext("2d")
  view = new util.View(ctx)

  h = window.innerHeight - $("nav").height() - 50
  $("#life-canvas").height(h)
  ctx.canvas.height = h

  grid = new life.Grid(view, $(".main").width()/5, Math.floor(h/5))
  press = false
  paused = false

  view.e.on "mousedown", (e) ->
    paused = true
    grid.current[Math.floor(e.mouse.y/5)][Math.floor(e.mouse.x/5)].alive = true

  view.e.on "mouseup", (e) ->
    paused = false

  view.e.on "mousemove", (e) ->
    if e.mouse.down
      grid.current[Math.floor(e.mouse.y/5)][Math.floor(e.mouse.x/5)].alive = true

  $(".pause").click (e) ->
    if paused
      paused = false
      $(e.target).removeClass("glyphicon-play").addClass("glyphicon-pause")
    else
      paused = true
      $(e.target).removeClass("glyphicon-pause").addClass("glyphicon-play")

  $(".clear-board").click (e) ->
    grid = new life.Grid(view, $(".main").width()/5, 80)

  $(window).bind 'mousewheel DOMMouseScroll', (e) ->
    if e.originalEvent.wheelDelta > 0 or e.originalEvent.detail < 0
      view.scale.x += 0.2
      view.scale.y += 0.2
    else
      view.scale.x -= 0.2
      view.scale.y -= 0.2

  window.setInterval ->

    ctx.canvas.width = $(".main").width()
    ctx.clearRect 0, 0, canvas.width, canvas.height

    unless press or paused
      grid.update(life.algorithms.life)
    grid.draw(5, 5, 1)
  ,
    50