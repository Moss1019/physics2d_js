"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CollisionInfo = function () {
    function CollisionInfo() {
        _classCallCheck(this, CollisionInfo);

        this.normal = new Vec2(0, 0);
        this.start = new Vec2(0, 0);
        this.end = new Vec2(0, 0);
        this.depth = 0;
    }

    _createClass(CollisionInfo, [{
        key: "setInfo",
        value: function setInfo(n, s, d) {
            this.normal = n;
            this.start = s;
            this.depth = d;
            this.end = this.start.add(n.scale(d));
        }
    }, {
        key: "changeDir",
        value: function changeDir() {
            this.normal = this.normal.scale(-1);
            var t = this.end;
            this.end = this.start;
            this.start = t;
        }
    }]);

    return CollisionInfo;
}();