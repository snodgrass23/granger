(function() {
  var CanvasRenderer, DomRenderer, Granger, Renderer, fireEvent, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Granger = (function() {
    Granger.version = '0.1.0';

    function Granger(element, options) {
      this.element = element;
      this.options = options != null ? options : {};
      if (typeof this.element === 'string') {
        this.element = document.getElementById(this.element);
      }
      this.data = {
        min: Number(this.element.getAttribute('min')),
        max: Number(this.element.getAttribute('max'))
      };
      if (this.options.renderer === 'canvas') {
        this.renderer = new CanvasRenderer(this, this.element.value);
      } else {
        this.renderer = new DomRenderer(this, this.element.value);
      }
    }

    Granger.prototype.sync = function(value) {
      this.element.value = Math.round(value);
      fireEvent(this.element, 'change');
      return this;
    };

    return Granger;

  })();

  fireEvent = (function() {
    if (__indexOf.call(Element.prototype, 'fireEvent') >= 0) {
      return function(element, event) {
        return element.fireEvent("on" + event);
      };
    }
    return function(element, event) {
      var e;
      e = document.createEvent("HTMLEvents");
      e.initEvent(event, true, true);
      return element.dispatchEvent(e);
    };
  })();

  window.Granger = Granger;

  window.emit = fireEvent;

  Renderer = (function() {
    function Renderer(granger, startValue) {
      var start,
        _this = this;
      this.granger = granger;
      this.options = this.granger.options;
      this._createElements();
      this._bindEvents();
      start = this.pointByValue(startValue);
      this.draw(start.x, start.y);
      this.sync(start.x, start.y);
      this.granger.element.addEventListener('change', function(e) {
        var point;
        point = _this.pointByValue(_this.granger.element.value);
        return _this.draw(point.x, point.y);
      }, false);
    }

    Renderer.prototype._createElements = function() {
      return console.log('Error: _createElements not available. Renderer should not be instantiated directly');
    };

    Renderer.prototype._bindEvents = function() {
      return console.log('Error: _bindEvents not available. Renderer should not be instantiated directly');
    };

    Renderer.prototype.sync = function(x, y) {
      var value;
      value = this.valueByPoint(x, y);
      this.granger.sync(value);
      return this;
    };

    Renderer.prototype.valueByPoint = function(x, y) {
      var abs, offset, percentage, radians, value;
      abs = this.pointByAngle(x, y);
      offset = -Math.PI / 2;
      radians = Math.atan2(this.dim.centerY - abs.y, this.dim.centerX - abs.x);
      if (radians < Math.PI / 2) {
        radians = Math.PI * 2 + radians;
      }
      percentage = (radians + offset) / (Math.PI * 2);
      this.granger.data.min / percentage;
      return value = percentage * (this.granger.data.max - this.granger.data.min) + this.granger.data.min;
    };

    Renderer.prototype.pointByValue = function(value) {
      var percentage, radians, x, y;
      percentage = (value - this.granger.data.min) / (this.granger.data.max - this.granger.data.min);
      radians = (percentage * 2 + 0.5) * Math.PI;
      x = -1 * this.dim.radius * Math.cos(radians) + this.dim.centerX;
      y = -1 * this.dim.radius * Math.sin(radians) + this.dim.centerY;
      return {
        x: x,
        y: y
      };
    };

    Renderer.prototype.pointByAngle = function(x, y) {
      var radians;
      radians = Math.atan2(this.dim.centerY - y, this.dim.centerX - x);
      x = -1 * this.dim.radius * Math.cos(radians) + this.dim.centerX;
      y = -1 * this.dim.radius * Math.sin(radians) + this.dim.centerY;
      return {
        x: x,
        y: y
      };
    };

    Renderer.prototype.pointByLimit = function(x, y) {
      var distance, distanceSquared, dx, dy, ratio;
      dx = x - this.dim.centerX;
      dy = y - this.dim.centerY;
      distanceSquared = (dx * dx) + (dy * dy);
      if (distanceSquared <= this.dim.radius * this.dim.radius) {
        return {
          x: x,
          y: y
        };
      }
      distance = Math.sqrt(distanceSquared);
      ratio = this.dim.radius / distance;
      x = dx * ratio + this.dim.centerX;
      y = dy * ratio + this.dim.centerY;
      return {
        x: x,
        y: y
      };
    };

    Renderer.prototype.getPoint = function(x, y) {
      if (this.options.freeBounds || this.isSingleVector()) {
        return this.pointByLimit(x, y);
      }
      return this.pointByAngle(x, y);
    };

    Renderer.prototype.isSingleVector = function() {
      return /^(x|y)/.test(this.options.type);
    };

    return Renderer;

  })();

  DomRenderer = (function(_super) {
    __extends(DomRenderer, _super);

    function DomRenderer() {
      _ref = DomRenderer.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DomRenderer.prototype._createElements = function() {
      var borderWidth;
      this.canvas = document.createElement('div');
      this.pointer = document.createElement('div');
      this.canvas.setAttribute('class', 'granger');
      this.pointer.setAttribute('class', 'granger-pointer');
      this.granger.element.style.display = 'none';
      this.canvas.style.cursor = 'pointer';
      this.canvas.style.mozUserSelect = 'none';
      this.canvas.style.webkitUserSelect = 'none';
      this.granger.element.parentNode.insertBefore(this.canvas, this.element);
      this.canvas.appendChild(this.pointer);
      borderWidth = parseInt(getComputedStyle(this.canvas)['border-width']);
      this.dim = {
        width: this.canvas.offsetWidth + borderWidth,
        height: this.canvas.offsetHeight + borderWidth,
        offset: this.pointer.offsetWidth
      };
      this.dim.centerX = (this.dim.width - borderWidth) / 2;
      this.dim.centerY = (this.dim.height - borderWidth) / 2;
      this.dim.radius = this.dim.width / 2 - this.dim.offset;
      this.draw(this.dim.centerX, this.dim.centerY);
      return this;
    };

    DomRenderer.prototype._bindEvents = function() {
      var onDrag, onEnd, onStart,
        _this = this;
      onStart = function(e) {
        _this.isDragging = true;
        return false;
      };
      onDrag = function(e) {
        var result, x, y;
        if (!_this.isDragging) {
          return;
        }
        if (e.type === 'touchmove') {
          x = e.touches[0].pageX - e.touches[0].target.offsetLeft;
          y = e.touches[0].pageY - e.touches[0].target.offsetTop;
        } else {
          x = e.offsetX;
          y = e.offsetY;
        }
        result = _this.getPoint(x, y);
        _this.sync(result.x, result.y);
        _this.draw(result.x, result.y);
        e.preventDefault();
        return false;
      };
      onEnd = function(e) {
        _this.isDragging = false;
        return false;
      };
      this.canvas.addEventListener('mousedown', onStart, false);
      this.canvas.addEventListener('mousemove', onDrag, false);
      this.canvas.addEventListener('mouseup', onEnd, false);
      this.pointer.addEventListener('mousedown', onStart, false);
      this.pointer.addEventListener('mousemove', onDrag, false);
      this.pointer.addEventListener('mouseup', onEnd, false);
      this.canvas.addEventListener('touchstart', onStart, false);
      this.canvas.addEventListener('touchmove', onDrag, false);
      return this.canvas.addEventListener('touchend', onEnd, false);
    };

    DomRenderer.prototype.draw = function(x, y) {
      this.pointer.style.left = x + 'px';
      if (this.isSingleVector()) {
        y = 0;
      } else {
        y = y - this.dim.offset;
      }
      return this.pointer.style.top = y + 'px';
    };

    return DomRenderer;

  })(Renderer);

  CanvasRenderer = (function(_super) {
    __extends(CanvasRenderer, _super);

    function CanvasRenderer() {
      _ref1 = CanvasRenderer.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    CanvasRenderer.prototype._createElements = function() {
      var fontSize;
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('class', 'granger');
      this.ctx = this.canvas.getContext('2d');
      fontSize = parseInt(getComputedStyle(this.granger.element).getPropertyValue('font-size'), 10);
      console.log(this.options.width, this.options.height);
      this.canvas.width = this.options.width || 15 * fontSize;
      this.canvas.height = this.options.height || 15 * fontSize;
      this.granger.element.style.display = 'none';
      this.canvas.style.cursor = 'pointer';
      this.canvas.style.mozUserSelect = 'none';
      this.canvas.style.webkitUserSelect = 'none';
      this.granger.element.parentNode.insertBefore(this.canvas, this.element);
      this.dim = {
        width: this.canvas.width,
        height: this.canvas.height,
        top: this.canvas.offsetTop,
        left: this.canvas.offsetLeft
      };
      this.dim.centerX = this.dim.width / 2;
      this.dim.centerY = this.dim.height / 2;
      this.dim.radius = this.dim.width / 2 - 6;
      this.draw(this.dim.centerX, this.dim.centerY);
      return this;
    };

    CanvasRenderer.prototype._bindEvents = function() {
      var onDrag, onEnd, onStart,
        _this = this;
      onStart = function(e) {
        _this.isDragging = true;
        return false;
      };
      onDrag = function(e) {
        var result, x, y;
        if (!_this.isDragging) {
          return;
        }
        if (e.type === 'touchmove') {
          x = e.touches[0].pageX - e.touches[0].target.offsetLeft;
          y = e.touches[0].pageY - e.touches[0].target.offsetTop;
        } else {
          x = e.offsetX;
          y = e.offsetY;
        }
        result = _this.getPoint(x, y);
        _this.sync(result.x, result.y);
        _this.draw(result.x, result.y);
        e.preventDefault();
        return false;
      };
      onEnd = function(e) {
        _this.isDragging = false;
        return false;
      };
      this.canvas.addEventListener('mousedown', onStart, false);
      this.canvas.addEventListener('mousemove', onDrag, false);
      this.canvas.addEventListener('mouseup', onEnd, false);
      this.canvas.addEventListener('touchstart', onStart, false);
      this.canvas.addEventListener('touchmove', onDrag, false);
      return this.canvas.addEventListener('touchend', onEnd, false);
    };

    CanvasRenderer.prototype.draw = function(x, y) {
      this.canvas.width = this.canvas.width;
      this.ctx.strokeStyle = '#cccccc';
      this.ctx.lineWidth = 12;
      if (this.isSingleVector()) {
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(this.dim.centerX - this.dim.radius, this.ctx.lineWidth / 2);
        this.ctx.lineTo(this.dim.centerX + this.dim.radius, this.ctx.lineWidth / 2);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 12;
        this.ctx.beginPath();
        this.ctx.arc(x, this.ctx.lineWidth / 2, this.ctx.lineWidth / 2, 0, Math.PI * 2, true);
        return this.ctx.fill();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(this.dim.centerX, this.dim.centerY, this.dim.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 12;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.ctx.lineWidth / 2, 0, Math.PI * 2, true);
        return this.ctx.fill();
      }
    };

    return CanvasRenderer;

  })(Renderer);

}).call(this);