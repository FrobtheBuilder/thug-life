life = require "./life.coffee"

$ ->
  canvas = document.getElementById("life-canvas")
  ctx = canvas.getContext("2d")
  ctx.canvas.height = 800

  grid = new life.Grid(ctx, $(".main").width()/5, 80)
  press = false
  paused = false

  $("#life-canvas").on "mousedown", (e) ->
    press = true
  $("#life-canvas").on "mouseup", ->
    press = false

  $("#life-canvas").mousemove (e) ->
    if press
      x = Math.floor (e.pageX - $("#life-canvas").offset().left)/5
      y = Math.floor (e.pageY - $("#life-canvas").offset().top)/5
      grid.current[y][x].alive = true

  $(".pause").click (e) ->
    if paused then paused = false else paused = true

  $(".clear-board").click ->
    grid = new life.Grid(ctx, $(".main").width()/5, 80)


  $("#life-canvas").click (e) ->
    x = Math.floor (e.pageX - $("#life-canvas").offset().left)/5
    y = Math.floor (e.pageY - $("#life-canvas").offset().top)/5

    grid.current[y][x].alive = true

  window.setInterval ->

    ctx.canvas.width = $(".main").width()
    ctx.clearRect 0, 0, canvas.width, canvas.height

    unless press or paused
      grid.update(life.algorithms.life)
    grid.draw(5, 5, 1)
  ,
    50