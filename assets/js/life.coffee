


goodAlgorithm = (c) ->
  #[[x, x, x],
  # [x, x, x],
  # [x, x, x]]
  surrounding = [
    c[0][0], c[0][1], c[0][2],
    c[1][0],          c[1][2],
    c[2][0], c[2][1], c[2][2]
  ]
  livingNeighbors = surrounding.filter((x) -> x.alive).length
  self = c[1][1].alive

  if (self and (livingNeighbors is 2 or livingNeighbors is 3)) or (not self and livingNeighbors is 3)
    true
  else
    false


class Cell
  constructor: (@alive, @location) ->

  clone: -> new Cell(@alive, {x: @location.x, y: @location.y})


class Grid
  constructor: (@context, @gWidth, @gHeight) ->
    @current = []
    @next = []

    @initialize(@current)
    @initialize(@next)

  update: (algo) ->

    for row in @current
      for cell in row
        loc = cell.location
        n =
          left: (if loc.x > 1 then loc.x - 1 else @gWidth)
          right: (loc.x + 1) % (@gWidth)
          above: (if loc.y > 1 then loc.y - 1 else @gHeight)
          below: (loc.y + 1) % (@gHeight)

        chunk = [
          [@current[n.above][n.left], @current[n.above][loc.x], @current[n.above][n.right]],
          [@current[loc.y][n.left], cell, @current[loc.y][n.right]],
          [@current[n.below][n.left], @current[n.below][loc.x], @current[n.below][n.right]]
        ]

        @next[loc.y][loc.x].alive = algo(chunk)

    @current = []
    for r in [0..@gHeight]
      @current.push (cell.clone() for cell in @next[r])




  initialize: (cells) ->
    for r in [0..@gHeight]
      cells.push []
      for c in [0..@gWidth]
        cells[r].push new Cell(Math.random() > 0.2, {x: c, y: r})



  draw: (cWidth, cHeight, cSpacing) ->
    ctx = @context
    ctx.fillStyle = "#FFFFFF"

    for row in @current
      for cell in row
        if cell.alive
          ctx.fillRect (cell.location.x*cWidth)*cSpacing, (cell.location.y*cHeight)*cSpacing, cWidth, cHeight

$ ->
  canvas = document.getElementById("life-canvas")
  ctx = canvas.getContext("2d")
  ctx.canvas.height = 500

  grid = new Grid(ctx, $(".main").width()/5, 40)
  press = false

  $("#life-canvas").on "mousedown", (e) ->
    press = true
  $("#life-canvas").on "mouseup", ->
    press = false

  $("#life-canvas").mousemove (e) ->
    if press
      x = Math.floor (e.pageX - $("#life-canvas").offset().left)/5
      y = Math.floor (e.pageY - $("#life-canvas").offset().top)/5
      grid.current[y][x].alive = true

  $("#life-canvas").click (e) ->
    x = Math.floor (e.pageX - $("#life-canvas").offset().left)/5
    y = Math.floor (e.pageY - $("#life-canvas").offset().top)/5

    grid.current[y][x].alive = true

  window.setInterval ->

    ctx.canvas.width = $(".main").width()
    ctx.clearRect 0, 0, canvas.width, canvas.height

    unless press
      grid.update(goodAlgorithm)
    grid.draw(5, 5, 1)
  ,
    60