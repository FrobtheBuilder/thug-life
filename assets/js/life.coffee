conway = (c, alive) ->
  livingNeighbors = c.filter((x) -> x).length
  if (alive and (livingNeighbors is 2 or livingNeighbors is 3)) or (not alive and livingNeighbors is 3)
    true
  else
    false

class Grid
  constructor: (@context, width, height) ->
    @info =
      rows: height
      columns: width
    @current = []
    @next = []
    @ages = []

    @initialize(@current, false)
    @initialize(@next, false)
    for row in [0..@info.rows]
      @ages.push(new Array(@info.columns + 1).join('0').split(''))

  update: (algo) ->
    for row in [2..@info.rows-2]
      for col in [2..@info.columns-15]
        cell = @current[row][col]
        n =
          left: (if col > 1 then col - 1 else @info.columns)
          right: (col + 1) % (@info.columns)
          above: (if row > 1 then row - 1 else @info.rows)
          below: (row + 1) % (@info.rows)

        chunk = [
          @current[n.above][n.left], @current[n.above][col], @current[n.above][n.right],
          @current[row][n.left],                             @current[row][n.right],
          @current[n.below][n.left], @current[n.below][col], @current[n.below][n.right]
        ]

        @next[row][col] = algo(chunk, cell)
        if @current[row][col] and @current[row][col] is @next[row][col]
          @ages[row][col] += 1
        else
          @ages[row][col] = 0


    @current = []
    for r in [0..@info.rows]
      @current.push []
      for c in [0..@info.columns]
        @current[r].push @next[r][c]

  initialize: (cells, withwhat) ->
    for r in [0..@info.rows]
      cells.push []
      for c in [0..@info.cols]
        cells[r][c] = withwhat

  draw: (cWidth, cHeight, cSpacing) ->
    ctx = @context
    #ctx.fillStyle ="#FFFFFF"

    for row in [0..@info.rows]
      for col in [0..@info.columns]
        if @current[row][col]
          ctx.fillStyle = "rgb(#{255-String(@ages[row][col]*5)}, #{String(@ages[row][col]*20)}, #{String(@ages[row][col]*10)})"
          ctx.fillRect (col*cWidth)*cSpacing, (row*cHeight)*cSpacing, cWidth, cHeight

$ ->
  canvas = document.getElementById("life-canvas")
  ctx = canvas.getContext("2d")
  ctx.canvas.height = 800

  grid = new Grid(ctx, $(".main").width()/5, 80)
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
      grid.current[y][x] = true
  $(".pause").click (e) ->
    if paused then paused = false else paused = true

  $("#life-canvas").click (e) ->
    x = Math.floor (e.pageX - $("#life-canvas").offset().left)/5
    y = Math.floor (e.pageY - $("#life-canvas").offset().top)/5

    grid.current[y][x] = true

  window.setInterval ->

    ctx.canvas.width = $(".main").width()
    ctx.clearRect 0, 0, canvas.width, canvas.height

    unless press or paused
      grid.update(conway)
    grid.draw(5, 5, 1)
  ,
    60