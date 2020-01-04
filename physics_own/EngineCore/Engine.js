
const gk_gravity = new Vec2(0, 10);

class Engine {
    constructor() {
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

    addGameObject(newGO) {
        this.gameObjects.push(newGO);
    }

    spawnNewGameObject() {
        const newGO = new GameObject(this.spawnPoint, Math.random(), Math.random(), Math.random(), 
        Math.random() * 100 + 10, Math.random() * 100 + 10);
        this.addGameObject(newGO);
    }

    removeLastAddedGameObject() {
        if (this.gameObjects.length === 4) {
            return;
        }
        this.gameObjects.pop();
    }

    moveSpawnPoint(displacement) {
        const newX = displacement.x + this.spawnPoint.x;
        const newY = displacement.y + this.spawnPoint.y;
        if (newX > 0 && newX < this.width && newY > 0 && newY < this.height) {
            this.spawnPoint = this.spawnPoint.add(displacement);
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.strokeStyle = 'red';
        this.context.moveTo(this.spawnPoint.x, this.spawnPoint.y);
        this.context.beginPath();
        this.context.arc(this.spawnPoint.x, this.spawnPoint.y, 3, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.stroke();
        this.context.strokeStyle ='blue';
        this.gameObjects.forEach((go, i) => {
            go.draw(this.context);
        });
    }

    update() {
        this.gameObjects.forEach((go) => {
            go.update();
        })
    }

    runGameLoop() {
        requestAnimationFrame(() => {
            this.runGameLoop();
        });
        this.currentTime = Date.now();
        const elapsedTime = this.currentTime - this.previousTime;
        this.previousTime = this.currentTime;
        this.lagTime += elapsedTime;
        this.draw();
        while (this.lagTime > this.millisecodsPerFrame) {
            this.update();
            this.physicsUpdate();
            this.lagTime -= this.millisecodsPerFrame;
        }
    }

    positionalCorrection(go1, go2, collisionInfo) {
        const m1 = go1.invMass;
        const m2 = go2.invMass;
        const scaleAmount = collisionInfo.depth / (m1 + m2) * this.positionCorrectionRate;
        const correctionAmount = collisionInfo.normal.scale(scaleAmount);
        go1.move(correctionAmount.scale(-m1));
        go2.move(correctionAmount.scale(m2));
    }

    resolveCollision(go1, go2, colInfo) {
        if (go1.invMass === 0 && go2.invMass === 0) {
            return;
        }

        this.positionalCorrection(go1, go2, colInfo);

        const n = colInfo.normal;
        const start = colInfo.start.scale(go2.invMass / (go1.invMass + go2.invMass));
        const end = colInfo.end.scale(go1.invMass / (go1.invMass + go2.invMass));
        const p = start.add(end);

        const r1 = p.subtract(go1.center);
        const r2 = p.subtract(go2.center);

        const v1 = go1.velocity.add(new Vec2(-1 * go1.angularVelocity * r1.y, go1.angularVelocity * r1.x));
        const v2 = go2.velocity.add(new Vec2(-1 * go2.angularVelocity * r2.y, go2.angularVelocity * r2.x));

        const relativeVelocity = v2.subtract(v1);
        const velocityInNormal = relativeVelocity.dot(n);

        if (velocityInNormal > 0) {
            return;
        }

        const newRestitution = Math.min(go1.restitution, go2.restitution);
        const newFriction = Math.min(go1.friction, go2.friction);

        const r1CrossN = r1.cross(n);
        const r2CrossN = r2.cross(n);
        const jN = (-(1 + newRestitution) * velocityInNormal) / (go1.invMass + go2.invMass + r1CrossN * r1CrossN * go1.inertia + r2CrossN * r2CrossN * go2.inertia);
        go1.angularVelocity -= r1CrossN * jN * go1.inertia;
        go2.angularVelocity += r2CrossN * jN * go2.inertia;

        let impulse = n.scale(jN);
        go1.velocity = go1.velocity.subtract(impulse.scale(go1.invMass));
        go2.velocity = go2.velocity.add(impulse.scale(go2.invMass));
        
        const t = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n))).normalize().scale(-1);

        // const r1CrossT = r1.cross(t);
        // const r2CrossT = r2.cross(t);

        // let jT = (-(1 + newRestitution) * relativeVelocity.dot(t) * newFriction) / (go1.invMass + go2.invMass + r1CrossT * r1CrossT * go1.inertia + r2CrossT * r2CrossT * go2.inertia);
        let jT = jN;
        if (jT > jN) {
            jT = jN;
        }

        // go1.angularVelocity -= r1CrossT * jT * go1.inertia;
        // go2.angularVelocity += r2CrossT * jT * go2.inertia;

        impulse = n.scale(jT);

        go1.velocity = go1.velocity.subtract(impulse.scale(go1.invMass));
        go2.velocity = go2.velocity.add(impulse.scale(go2.invMass));
    }

    physicsUpdate() {
        const colInfo = new CollisionInfo();
        for (let k = 0; k < this.relaxationSteps; ++k) {
            for (let i = 0; i < this.gameObjects.length; ++i) {
                for (let j = i + 1; j < this.gameObjects.length; ++j) {
                    const go1 = this.gameObjects[i];
                    const go2 = this.gameObjects[j];
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
}

const g_engine = new Engine();
