events = require "events"

# adapted from http://phrogz.net/tmp/canvas_zoom_to_cursor.html
augmentContext = (ctx) ->
  svg = document.createElementNS "http://www.w3.org/2000/svg",'svg'
  xform = svg.createSVGMatrix()
  ctx.getTransform = -> xform
  savedTransforms = []
  save = ctx.save
  ctx.save = ->
    savedTransforms.push xform.translate 0,0
    return save.call(ctx)

  restore = ctx.restore
  ctx.restore = ->
    xform = savedTransforms.pop()
    return restore.call(ctx)

  scale = ctx.scale
  ctx.scale = (sx, sy) ->
    xform = xform.scaleNonUniform(sx, sy)
    return scale.call(ctx, sx, sy)

  rotate = ctx.rotate
  ctx.rotate = (radians) ->
    xform = xform.rotate(radians*180/Math.PI)
    return rotate.call(ctx, radians)

  translate = ctx.translate
  ctx.translate = (dx, dy) ->
    xform = xform.translate(dx, dy)
    return translate.call(ctx, dx, dy)

  transform = ctx.transform
  ctx.transform = (a, b, c, d, e, f) ->
    m2 = svg.createSVGMatrix()
    [m2.a, m2.b, m2.c, m2.d, m2.e, m2.f] = [a, b, c, d, e, f]
    xform = xform.multiply m2
    return transform.call(ctx, a, b, c, d, e, f)

  setTransform = ctx.setTransform
  ctx.setTransform = (a, b, c, d, e, f) ->
    xform.a = a
    xform.b = b
    xform.c = c
    xform.d = d
    xform.e = e
    xform.f = f
    return setTransform.call(ctx, a, b, c, d, e, f)

  pt = svg.createSVGPoint()
  ctx.transformedPoint = (x, y) ->
    [pt.x, pt.y] = [x, y]
    return pt.matrixTransform(xform.inverse())

  ctx.unTransformedPoint = (x, y) ->
    [pt.x, pt.y] = [x, y]
    return pt.matrixTransform(xform)

zoom = (e) ->
  ctx = e.jq.target.getContext("2d")
  pt = ctx.transformedPoint(Math.round(e.mouse.x)*1.0, Math.round(e.mouse.y)*1.0)
  ctx.translate(pt.x, pt.y)
  factor = Math.pow(1.1, e.delta)
  ctx.scale(factor, factor)
  ctx.translate(-pt.x, -pt.y)

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

    @e = @wrapEvents $(@context.canvas)

  wrapEvents: ($ctx, emitter) ->
    emitter = new events.EventEmitter()
    $ctx.on "mousedown", (jqe) =>
      @mouse.down = true
      @updateMouse(jqe)
      emitter.emit "mousedown", {jq: jqe, mouse: @mouse}

    $ctx.on "mouseup", (jqe) =>
      @mouse.down = false
      emitter.emit "mouseup", {jq: jqe, mouse: @mouse}

    $ctx.on "mousemove", (jqe) =>
      @updateMouse(jqe)
      emitter.emit "mousemove", {jq: jqe, mouse: @mouse}

    $ctx.bind 'mousewheel DOMMouseScroll', (jqe) =>
      #@updateMouse(jqe)
      oEvt = jqe.originalEvent
      delta = if oEvt.wheelDelta?
        oEvt.wheelDelta/40
      else if oEvt.detail?
        -oEvt.detail
      else
        0
      emitter.emit "mousewheel", {jq: jqe, mouse: @mouse, delta: delta}
      return oEvt.preventDefault() and false

    return emitter

  updateMouse: (jqe) =>
    @mouse.x = (jqe.pageX - $(@context.canvas).offset().left)
    @mouse.y = (jqe.pageY - $(@context.canvas).offset().top)
    @mouse.local.x = (jqe.pageX - $(@context.canvas).offset().left)
    @mouse.local.y = (jqe.pageY - $(@context.canvas).offset().top)


lerp = (a, b, t) -> a + t * (b - a)
color = (x) ->
  colors = [
    [255, 24, 24]
    [255, 150, 24]
    [255, 255, 24]
    [24, 255, 24]
    [24, 24, 255]
    [72, 24, 150]
    [150, 24, 124]
  ]

  x = Math.pow x, 0.5
  if x > colors.length-1
    x = colors.length-1

  prev = Math.floor(x)
  next = Math.ceil(x)

  t = x - prev

  result = []
  for i in [0..2]
    result[i] = if prev < next
      Math.floor(lerp colors[prev][i], colors[next][i], t)
    else
      colors[prev][i]
  return result

module.exports =
  View: View
  augmentContext: augmentContext
  zoom: zoom
  color: color