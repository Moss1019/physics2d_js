'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gk_gravity = new Vec2(0, 10);

var Engine = function () {
    function Engine() {
        _classCallCheck(this, Engine);

        this.width = 800;
        this.height = 600;
        this.canvas = document.getElementById('draw-space');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.fps = 30;
        this.frameTime = 1 / this.fps;
        this.updateIntervalsInSecods = this.frameTime;
        this.millisecodsPerFrame = 1000 * this.frameTime;

        this.currentTime = Date.now();
        this.previousTime = Date.now();
        this.lagTime = 0;

        this.enabledMovement = false;

        this.gameObjects = [];
        this.currentGameObject = 0;

        this.relaxationSteps = 15;
        this.positionCorrectionRate = 0.8;

        this.spawnPoint = new Vec2(this.width / 2, 300);
    }

    _createClass(Engine, [{
        key: 'addGameObject',
        value: function addGameObject(newGO) {
            this.gameObjects.push(newGO);
        }
    }, {
        key: 'spawnNewGameObject',
        value: function spawnNewGameObject() {
            var newGO = new GameObject(this.spawnPoint, Math.random(), Math.random(), Math.random(), Math.random() * 100 + 10, Math.random() * 100 + 10);
            this.addGameObject(newGO);
        }
    }, {
        key: 'removeLastAddedGameObject',
        value: function removeLastAddedGameObject() {
            if (this.gameObjects.length === 4) {
                return;
            }
            this.gameObjects.pop();
        }
    }, {
        key: 'moveSpawnPoint',
        value: function moveSpawnPoint(displacement) {
            var newX = displacement.x + this.spawnPoint.x;
            var newY = displacement.y + this.spawnPoint.y;
            if (newX > 0 && newX < this.width && newY > 0 && newY < this.height) {
                this.spawnPoint = this.spawnPoint.add(displacement);
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this = this;

            this.context.clearRect(0, 0, this.width, this.height);
            this.context.strokeStyle = 'red';
            this.context.moveTo(this.spawnPoint.x, this.spawnPoint.y);
            this.context.beginPath();
            this.context.arc(this.spawnPoint.x, this.spawnPoint.y, 3, 0, Math.PI * 2, true);
            this.context.closePath();
            this.context.stroke();
            this.context.strokeStyle = 'blue';
            this.gameObjects.forEach(function (go, i) {
                go.draw(_this.context);
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this.gameObjects.forEach(function (go) {
                go.update();
            });
        }
    }, {
        key: 'runGameLoop',
        value: function runGameLoop() {
            var _this2 = this;

            requestAnimationFrame(function () {
                _this2.runGameLoop();
            });
            this.currentTime = Date.now();
            var elapsedTime = this.currentTime - this.previousTime;
            this.previousTime = this.currentTime;
            this.lagTime += elapsedTime;
            this.draw();
            while (this.lagTime > this.millisecodsPerFrame) {
                this.update();
                this.physicsUpdate();
                this.lagTime -= this.millisecodsPerFrame;
            }
        }
    }, {
        key: 'positionalCorrection',
        value: function positionalCorrection(go1, go2, collisionInfo) {
            var m1 = go1.invMass;
            var m2 = go2.invMass;
            var scaleAmount = collisionInfo.depth / (m1 + m2) * this.positionCorrectionRate;
            var correctionAmount = collisionInfo.normal.scale(scaleAmount);
            go1.move(correctionAmount.scale(-m1));
            go2.move(correctionAmount.scale(m2));
        }
    }, {
        key: 'resolveCollision',
        value: function resolveCollision(go1, go2, colInfo) {
            if (go1.invMass === 0 && go2.invMass === 0) {
                return;
            }

            this.positionalCorrection(go1, go2, colInfo);

            var n = colInfo.normal;
            var start = colInfo.start.scale(go2.invMass / (go1.invMass + go2.invMass));
            var end = colInfo.end.scale(go1.invMass / (go1.invMass + go2.invMass));
            var p = start.add(end);

            var r1 = p.subtract(go1.center);
            var r2 = p.subtract(go2.center);

            var v1 = go1.velocity.add(new Vec2(-1 * go1.angularVelocity * r1.y, go1.angularVelocity * r1.x));
            var v2 = go2.velocity.add(new Vec2(-1 * go2.angularVelocity * r2.y, go2.angularVelocity * r2.x));

            var relativeVelocity = v2.subtract(v1);
            var velocityInNormal = relativeVelocity.dot(n);

            if (velocityInNormal > 0) {
                return;
            }

            var newRestitution = Math.min(go1.restitution, go2.restitution);
            var newFriction = Math.min(go1.friction, go2.friction);

            var r1CrossN = r1.cross(n);
            var r2CrossN = r2.cross(n);
            var jN = -(1 + newRestitution) * velocityInNormal / (go1.invMass + go2.invMass + r1CrossN * r1CrossN * go1.inertia + r2CrossN * r2CrossN * go2.inertia);
            go1.angularVelocity -= r1CrossN * jN * go1.inertia;
            go2.angularVelocity += r2CrossN * jN * go2.inertia;

            var impulse = n.scale(jN);
            go1.velocity = go1.velocity.subtract(impulse.scale(go1.invMass));
            go2.velocity = go2.velocity.add(impulse.scale(go2.invMass));

            var t = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n))).normalize().scale(-1);

            // const r1CrossT = r1.cross(t);
            // const r2CrossT = r2.cross(t);

            // let jT = (-(1 + newRestitution) * relativeVelocity.dot(t) * newFriction) / (go1.invMass + go2.invMass + r1CrossT * r1CrossT * go1.inertia + r2CrossT * r2CrossT * go2.inertia);
            var jT = jN;
            if (jT > jN) {
                jT = jN;
            }

            // go1.angularVelocity -= r1CrossT * jT * go1.inertia;
            // go2.angularVelocity += r2CrossT * jT * go2.inertia;

            impulse = n.scale(jT);

            go1.velocity = go1.velocity.subtract(impulse.scale(go1.invMass));
            go2.velocity = go2.velocity.add(impulse.scale(go2.invMass));
        }
    }, {
        key: 'physicsUpdate',
        value: function physicsUpdate() {
            var colInfo = new CollisionInfo();
            for (var k = 0; k < this.relaxationSteps; ++k) {
                for (var i = 0; i < this.gameObjects.length; ++i) {
                    for (var j = i + 1; j < this.gameObjects.length; ++j) {
                        var go1 = this.gameObjects[i];
                        var go2 = this.gameObjects[j];
                        if (go1.boundTest(go2)) {
                            if (go1.collisionTest(go2, colInfo)) {
                                if (colInfo.normal.dot(go2.center.subtract(go1.center)) < 0) {
                                    colInfo.changeDir();
                                }
                                this.resolveCollision(go1, go2, colInfo);
                            }
                        }
                    }
                }
            }
        }
    }]);

    return Engine;
}();

var g_engine = new Engine();