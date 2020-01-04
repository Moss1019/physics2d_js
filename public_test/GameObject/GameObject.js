'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var g_colInfo1 = new CollisionInfo();
var g_colInfo2 = new CollisionInfo();
var g_tmpSupport = new SupportPoint();

var GameObject = function () {
    function GameObject(center, mass, friction, restitution, width, height) {
        _classCallCheck(this, GameObject);

        this.center = center;
        this.friction = friction;
        this.restitution = restitution;

        this.width = width;
        this.height = height;

        this.boundingRadius = Math.sqrt(width * width + height * height) / 2;
        this.angle = 0;
        this.friction = !!friction ? friction : 0.8;
        this.restitution = !!restitution ? restitution : 0.2;

        this.invMass = !!mass && mass !== 0 ? 1 / mass : 0;
        this.velocity = new Vec2(0, 0);
        this.acceleration = this.invMass !== 0 ? gk_gravity : new Vec2(0, 0);
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.maxVelocity = 60;

        this.drag = 0.1;

        this.verts = [new Vec2(center.x - width / 2, center.y - height / 2), new Vec2(center.x + width / 2, center.y - height / 2), new Vec2(center.x + width / 2, center.y + height / 2), new Vec2(center.x - width / 2, center.y + height / 2)];
        this.faceNormals = [this.verts[1].subtract(this.verts[2]).normalize(), this.verts[2].subtract(this.verts[3]).normalize(), this.verts[3].subtract(this.verts[0]).normalize(), this.verts[0].subtract(this.verts[1]).normalize()];

        this.updateInertia();
    }

    _createClass(GameObject, [{
        key: 'update',
        value: function update() {
            var dt = g_engine.updateIntervalsInSecods;
            this.velocity = this.velocity.add(this.acceleration.scale(dt));
            if (this.velocity.length() > this.maxVelocity) {
                this.velocity = this.velocity.normalize().scale(this.maxVelocity);
            }
            this.move(this.velocity.scale(dt));

            this.angularVelocity += this.angularAcceleration * dt;
            this.rotate(this.angularVelocity * dt);
        }
    }, {
        key: 'boundTest',
        value: function boundTest(other) {
            var vector1to2 = other.center.subtract(this.center);
            var radiusSum = this.boundingRadius + other.boundingRadius;
            var distance = vector1to2.length();
            return radiusSum > distance;
        }
    }, {
        key: 'findSupportPoint',
        value: function findSupportPoint(dir, pointOnEdge) {
            var _this = this;

            var vectorToEdge = null;
            var projection = null;
            g_tmpSupport.supportPoint = null;
            g_tmpSupport.supportPointDist = -999999;
            this.verts.forEach(function (vert, i) {
                vectorToEdge = _this.verts[i].subtract(pointOnEdge);
                projection = vectorToEdge.dot(dir);
                if (projection > 0 && projection > g_tmpSupport.supportPointDist) {
                    g_tmpSupport.supportPoint = vert;
                    g_tmpSupport.supportPointDist = projection;
                }
            });
        }
    }, {
        key: 'findAxisLeastPenetration',
        value: function findAxisLeastPenetration(r, colInfo) {
            var n = null;
            var supportPoint = null;
            var bestDistance = 999999;
            var bestIndex = null;
            var hasSupport = true;
            for (var i = 0; i < this.faceNormals.length && hasSupport; ++i) {
                n = this.faceNormals[i];
                var dir = n.scale(-1);
                var pointOnEdge = this.verts[i];
                r.findSupportPoint(dir, pointOnEdge);
                hasSupport = g_tmpSupport.supportPoint !== null;
                if (hasSupport && g_tmpSupport.supportPointDist < bestDistance) {
                    supportPoint = g_tmpSupport.supportPoint;
                    bestDistance = g_tmpSupport.supportPointDist;
                    bestIndex = i;
                }
            }
            if (hasSupport) {
                var bestVec = this.faceNormals[bestIndex].scale(bestDistance);
                colInfo.setInfo(this.faceNormals[bestIndex], supportPoint.add(bestVec), bestDistance);
            }
            return hasSupport;
        }
    }, {
        key: 'collisionTest',
        value: function collisionTest(go, colInfo) {
            var s1 = this.findAxisLeastPenetration(go, g_colInfo1);
            if (s1) {
                var s2 = go.findAxisLeastPenetration(this, g_colInfo2);
                if (s2) {
                    if (g_colInfo1.depth < g_colInfo2.depth) {
                        var depthVec = g_colInfo1.normal.scale(g_colInfo1.depth);
                        colInfo.setInfo(g_colInfo1.normal, g_colInfo1.start.subtract(depthVec), g_colInfo1.depth);
                    } else {
                        colInfo.setInfo(g_colInfo2.normal.scale(-1), g_colInfo2.start, g_colInfo2.depth);
                    }
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {
            ctx.save();
            ctx.translate(this.verts[0].x, this.verts[0].y);
            ctx.rotate(this.angle);
            ctx.strokeRect(0, 0, this.width, this.height);
            ctx.restore();
            var v = this.velocity.length();
            if (v === 0) {
                return;
            }
            ctx.font = '10px serif';
            ctx.fillText('' + Math.round(v, 2), this.center.x, this.center.y);
        }
    }, {
        key: 'move',
        value: function move(displacement) {
            for (var i = 0; i < this.verts.length; ++i) {
                this.verts[i] = this.verts[i].add(displacement);
            }
            this.center = this.center.add(displacement);
        }
    }, {
        key: 'rotate',
        value: function rotate(angle) {
            this.angle += angle;
            for (var i = 0; i < this.verts.length; ++i) {
                this.verts[i] = this.verts[i].rotate(this.center, angle);
            }
            this.faceNormals = [this.verts[1].subtract(this.verts[2]).normalize(), this.verts[2].subtract(this.verts[3]).normalize(), this.verts[3].subtract(this.verts[0]).normalize(), this.verts[0].subtract(this.verts[1]).normalize()];
        }
    }, {
        key: 'updateInertia',
        value: function updateInertia() {
            if (this.invMass === 0) {
                this.inertia = 0;
            } else {
                this.inertia = 1 / (1 / this.invMass * (this.width * this.width + this.height * this.height) / 12);
            }
        }
    }]);

    return GameObject;
}();