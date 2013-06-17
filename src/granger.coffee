
# @param {Object} options options object
# @prop {Boolean} [options.freeBounds] if true, will draw target anywhere within the bounds
class Granger
  @version: '0.1.0'

  constructor: (@element, @options = {}) ->
    @data = {
      min: Number @element.getAttribute('min')
      max: Number @element.getAttribute('max')
    }

    if @options.renderer is 'canvas'
      @renderer = new CanvasRenderer @, @element.value

    else @renderer = new DomRenderer @, @element.value

  sync: (value) ->
    @element.value = Math.round value
    fireEvent(@element, 'change')
    @

fireEvent = (() ->
  if 'fireEvent' in Element.prototype
    #todo. make sure this propagates in oldIE
    return (element, event) ->
      element.fireEvent("on#{ event }")

  (element, event) ->
    e = document.createEvent("HTMLEvents")
    e.initEvent(event, true, true)
    element.dispatchEvent(e)
)()

window.Granger = Granger
window.emit = fireEvent

