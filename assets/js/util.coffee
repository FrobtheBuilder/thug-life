events = require "events"

class View
  constructor: (@context) ->
    @mousedown = false

    @mouse =
      down: false
      x: 0
      y: 0

    @location =
      x: 0
      y: 0

    @scale =
      x: 1
      y: 1

    @e = new events.EventEmitter()
    $ctx = $(@context.canvas)

    $ctx.on "mousedown", (jqe) =>
      @mouse.down = true
      @updateMouse(jqe)
      @e.emit "mousedown", {jq: jqe, mouse: @mouse}

    $ctx.on "mouseup", (jqe) =>
      @mouse.down = false
      @e.emit "mouseup", {jq: jqe, mouse: @mouse}

    $ctx.on "mousemove", (jqe) =>
      @updateMouse(jqe)
      @e.emit "mousemove", {jq: jqe, mouse: @mouse}


  updateMouse: (jqe) =>
    @mouse.x = ((jqe.pageX - $(@context.canvas).offset().left) / @scale.x) + @location.x
    @mouse.y = ((jqe.pageY - $(@context.canvas).offset().top) / @scale.y) + @location.y

  fillRect: (x, y, w, h) ->
    @context.fillRect((x - @location.x)*@scale.x, (y - @location.y)*@scale.y, w * @scale.x, h * @scale.y)

module.exports =
  View: View