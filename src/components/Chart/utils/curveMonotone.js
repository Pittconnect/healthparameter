const sign = (x) => {
  return x < 0 ? -1 : 1;
};

const slope3 = (that, x2, y2) => {
  var h0 = that._x1 - that._x0,
    h1 = x2 - that._x1,
    s0 = (that._y1 - that._y0) / (h0 || (h1 < 0 && -0)),
    s1 = (y2 - that._y1) / (h1 || (h0 < 0 && -0)),
    p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (
    (sign(s0) + sign(s1)) *
      Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
  );
};

const slope2 = (that, t) => {
  var h = that._x1 - that._x0;
  return h ? ((3 * (that._y1 - that._y0)) / h - t) / 2 : t;
};

const point = (that, t0, t1) => {
  var x0 = that._x0,
    y0 = that._y0,
    x1 = that._x1,
    y1 = that._y1,
    dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(
    x0 + dx,
    y0 + dx * t0,
    x1 - dx,
    y1 - dx * t1,
    x1,
    y1
  );
};

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        point(this, this._t0, slope2(this, this._t0));
        break;
      default: break;
    }
    if (this._line || (this._line !== 0 && this._point === 1))
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    var t1 = NaN;

    x = +x;
    y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        point(this, slope2(this, (t1 = slope3(this, x, y))), t1);
        break;
      default:
        point(this, this._t0, (t1 = slope3(this, x, y)));
        break;
    }

    this._x0 = this._x1;
    this._x1 = x;
    this._y0 = this._y1;
    this._y1 = y;
    this._t0 = t1;
  },
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (
  x,
  y
) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function (x, y) {
    this._context.moveTo(y, x);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (x, y) {
    this._context.lineTo(y, x);
  },
  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
    this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
  },
};

export const monotoneX = (context) => new MonotoneX(context);

export const monotoneY = (context) => new MonotoneY(context);
