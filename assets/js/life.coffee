util = require './util.coffee'

algorithms =
  life: (c, alive) ->
    #livingNeighbors = c.reduce ((acc, e) -> if e then acc+1 else acc), 0
    livingNeighbors = 0

    for cell in c
      if cell then livingNeighbors += 1

    if (alive and (livingNeighbors is 2 or livingNeighbors is 3)) or (not alive and livingNeighbors is 3)
      true
    else
      false

class Cell
  constructor: ->
    @alive = false
    @age = 0

  copyTo: (target) ->
    target.alive = @alive
    target.age = @age

class Grid
  constructor: (@context, width, height, cellWidth=5, cellHeight=5, cellSpacing=1.2) ->
    @info =
      rows: height
      columns: width
      cell:
        width: cellWidth
        height: cellHeight
        spacing: cellSpacing

    @current = []
    @next = []

    @initialize(@current)
    @initialize(@next)
    console.log @current

  update: (algo) ->
    for row in [0..@info.rows]
      for col in [0..@info.columns]
        cell = @current[row][col]
        n =
          left: (if col > 1 then col - 1 else @info.columns)
          right: (col + 1) % (@info.columns)
          above: (if row > 1 then row - 1 else @info.rows)
          below: (row + 1) % (@info.rows)

        chunk = [
          @current[n.above][n.left].alive, @current[n.above][col].alive, @current[n.above][n.right].alive,
          @current[row][n.left].alive,                             @current[row][n.right].alive,
          @current[n.below][n.left].alive, @current[n.below][col].alive, @current[n.below][n.right].alive
        ]
        @next[row][col].alive = algo(chunk, cell.alive)
        if @current[row][col].alive and @current[row][col].alive is @next[row][col].alive
          @next[row][col].age += 1
        else
          @next[row][col].age = 0

    for r in [0..@info.rows]
      for c in [0..@info.columns]
        @next[r][c].copyTo @current[r][c]

  initialize: (cells) =>
    for row in [0..@info.rows]
      cells.push []
      for col in [0..@info.columns]
        cells[row].push new Cell()

  draw: (cWidth, cHeight, cSpacing) ->
    ctx = @context

    for row in [0..@info.rows]
      for col in [0..@info.columns]
        if @current[row][col].alive
          cellcolor = [0, 0, 0]
          cellcolor = util.color(@current[row][col].age/5)
          ctx.fillStyle = "rgb(#{String(cellcolor[0])}, #{String(cellcolor[1])}, #{String(cellcolor[2])})"
          ctx.fillRect (col*cWidth)*cSpacing, (row*cHeight)*cSpacing, cWidth, cHeight

module.exports =
  algorithms: algorithms
  Cell: Cell
  Grid: Grid