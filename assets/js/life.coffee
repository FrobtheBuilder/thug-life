


goodAlgorithm = (surrounding, alive) ->
  neighbors = surrounding.length
  if (alive and (neighbors is 2 or neighbors is 3)) or (not alive and neighbors is 3)
    true
  else
    false


class Cell
  constructor: (@location) ->
    @alive = true
    @age = 0

  clone: -> new Cell({x: @location.x, y: @location.y})


class Grid
  constructor: (@context) ->
    @current = []
    @nextx = []

    @initialize(@current)
    #@initialize(@nextx)


  livingCellAtLocation: (loc) =>
    for cell in @current
      if cell.location.x is loc.x and cell.location.y is loc.y
        return true
    return false

  update: (algo) =>

    @nextx = []
    for cell in @current
      surrounding = @getSurrounding cell.location
      cell.alive = algo(surrounding.filter(@livingCellAtLocation), true)
      if cell.alive
        @nextx.push cell

      deadSurrounding = surrounding.filter (x) => not (@livingCellAtLocation x)
      for location in deadSurrounding
        if algo((@getSurrounding location).filter(@livingCellAtLocation), false)
          @nextx.push new Cell(location)

    @current = []
    # @current = (cell.clone() for cell in @nextx)
    @current = @nextx

  getSurrounding: (l) ->
    return [
      {x: l.x-1, y: l.y-1}
      {x: l.x, y: l.y-1}
      {x: l.x+1, y: l.y-1}
      {x: l.x-1, y: l.y}
      {x: l.x+1, y: l.y}
      {x: l.x-1, y: l.y+1}
      {x: l.x, y: l.y+1}
      {x: l.x+1, y: l.y-1}
    ]

  initialize: (cells) ->
    for i in [0..400]
      where =
        x: Math.floor(Math.random()*40)
        y: Math.floor(Math.random()*40)
      cells.push new Cell({x: where.x, y: where.y})



  draw: (cWidth, cHeight, cSpacing) ->
    ctx = @context
    ctx.fillStyle = "#FFFFFF"

    for cell in @current
      ctx.fillRect (cell.location.x*cWidth)*cSpacing, (cell.location.y*cHeight)*cSpacing, cWidth, cHeight

$ ->
  canvas = document.getElementById("life-canvas")
  ctx = canvas.getContext("2d")
  ctx.canvas.height = 500

  grid = new Grid(ctx)
  press = false

  $("#life-canvas").on "mousedown", (e) ->
    press = true
  $("#life-canvas").on "mouseup", ->
    press = false

  $("#life-canvas").mousemove (e) ->
    if press
      x = Math.floor (e.pageX - $("#life-canvas").offset().left)/5
      y = Math.floor (e.pageY - $("#life-canvas").offset().top)/5
      grid.current.push new Cell({x: x, y: y})

  $("#life-canvas").click (e) ->
    x = Math.floor (e.pageX - $("#life-canvas").offset().left)/5
    y = Math.floor (e.pageY - $("#life-canvas").offset().top)/5

    grid.current.push new Cell({x: x, y: y})

  window.setInterval ->
    ctx.canvas.width = $(".main").width()
    ctx.clearRect 0, 0, canvas.width, canvas.height
    unless press
      grid.update(goodAlgorithm)
    grid.draw(5, 5, 1)
  ,
    60