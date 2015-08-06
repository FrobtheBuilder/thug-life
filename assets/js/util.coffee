events = require "events"

class View
  constructor: (@app) ->
    @context = @app.context

    @mousedown = false

    @mouse =
      down: false
      x: 0
      y: 0
      local:
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

    $(window).bind 'mousewheel DOMMouseScroll', (jqe) =>
      @updateMouse(jqe)
      @e.emit "mousewheel", {jq: jqe, mouse: @mouse, up: (jqe.originalEvent.wheelDelta > 0 or jqe.originalEvent.detail < 0)}

  setRectangle: (x, y, w, h) ->
    [@location.x, @location.y] = [x, y]
    oldWidth = @context.canvas.width / @scale.x
    oldHeight = @context.canvas.height / @scale.y
    @scale.x = oldWidth / w
    @scale.y = oldHeight / h

  zoom: (x, y, factor) ->
    @scale.x += factor
    @scale.y += factor

    width = @context.canvas.width / @scale.x
    height = @context.canvas.height / @scale.y

    @location.x = Math.floor(x - (width/2))
    @location.y = Math.floor(y - (height/2))


  viewport: ->
    x: @location.x
    y: @location.y
    width: @context.canvas.width / @scale.x
    height: @context.canvas.height / @scale.y
    center:
      x: @location.x + ((@context.canvas.width / @scale.x)/2)
      y: @location.y + ((@context.canvas.height / @scale.y)/2)

  updateMouse: (jqe) =>
    @mouse.x = ((jqe.pageX - $(@context.canvas).offset().left) / @scale.x) + @location.x
    @mouse.y = ((jqe.pageY - $(@context.canvas).offset().top) / @scale.y) + @location.y
    @mouse.local.x = (jqe.pageX - $(@context.canvas).offset().left)
    @mouse.local.y = (jqe.pageY - $(@context.canvas).offset().top)

  fillRect: (x, y, w, h) ->
    @context.fillRect((x - @location.x)*@scale.x, (y - @location.y)*@scale.y, w * @scale.x, h * @scale.y)

module.exports =
  View: View