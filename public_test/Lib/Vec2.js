"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vec2 = function () {
    function Vec2(x, y) {
        _classCallCheck(this, Vec2);

        this.x = x;
        this.y = y;
    }

    _createClass(Vec2, [{
        key: "length",
        value: function length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    }, {
        key: "add",
        value: function add(v) {
            return new Vec2(this.x + v.x, this.y + v.y);
        }
    }, {
        key: "subtract",
        value: function subtract(v) {
            return new Vec2(this.x - v.x, this.y - v.y);
        }
    }, {
        key: "scale",
        value: function scale(n) {
            return new Vec2(this.x * n, this.y * n);
        }
    }, {
        key: "dot",
        value: function dot(v) {
            return this.x * v.x + this.y * v.y;
        }
    }, {
        key: "cross",
        value: function cross(v) {
            return this.x * v.y - this.y * v.x;
        }
    }, {
        key: "rotate",
        value: function rotate(center, angle) {
            var x = this.x - center.x;
            var y = this.y - center.y;
            return new Vec2(x * Math.cos(angle) - y * Math.sin(angle) + center.x, x * Math.sin(angle) + y * Math.cos(angle) + center.y);
        }
    }, {
        key: "normalize",
        value: function normalize() {
            var l = this.length();
            return new Vec2(this.x / l, this.y / l);
        }
    }, {
        key: "distance",
        value: function distance(other) {
            var x = this.x - other.x;
            var y = this.y - other.y;
            return Math.sqrt(x * x + y * y);
        }
    }]);

    return Vec2;
}();