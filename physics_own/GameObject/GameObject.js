
const g_colInfo1 = new CollisionInfo();
const g_colInfo2 = new CollisionInfo();
const g_tmpSupport = new SupportPoint();

class GameObject {
    constructor(center, mass, friction, restitution, width, height) {
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

        this.verts = [
            new Vec2(center.x - width / 2, center.y - height / 2),
            new Vec2(center.x + width / 2, center.y - height / 2),
            new Vec2(center.x + width / 2, center.y + height / 2),
            new Vec2(center.x - width / 2, center.y + height / 2)
        ];
        this.faceNormals = [
            this.verts[1].subtract(this.verts[2]).normalize(),
            this.verts[2].subtract(this.verts[3]).normalize(),
            this.verts[3].subtract(this.verts[0]).normalize(),
            this.verts[0].subtract(this.verts[1]).normalize()
        ];

        this.updateInertia();
    }

    update() {
        const dt = g_engine.updateIntervalsInSecods;
        this.velocity = this.velocity.add(this.acceleration.scale(dt));
        if (this.velocity.length() > this.maxVelocity) {
            this.velocity = this.velocity.normalize().scale(this.maxVelocity);
        }
        this.move(this.velocity.scale(dt));

        this.angularVelocity += this.angularAcceleration * dt;
        this.rotate(this.angularVelocity * dt);
    }

    boundTest(other) {
        const vector1to2 = other.center.subtract(this.center);
        const radiusSum = this.boundingRadius + other.boundingRadius;
        const distance = vector1to2.length();
        return radiusSum > distance;
    }

    findSupportPoint(dir, pointOnEdge) {
        let vectorToEdge = null;
        let projection = null;
        g_tmpSupport.supportPoint = null;
        g_tmpSupport.supportPointDist = -999999;
        this.verts.forEach((vert, i) => {
            vectorToEdge = this.verts[i].subtract(pointOnEdge);
            projection = vectorToEdge.dot(dir);
            if ((projection > 0) && (projection > g_tmpSupport.supportPointDist)) {
                g_tmpSupport.supportPoint = vert;
                g_tmpSupport.supportPointDist = projection;
            }
        });
    }

    findAxisLeastPenetration(r, colInfo) {
        let n = null;
        let supportPoint = null;
        let bestDistance = 999999;
        let bestIndex = null;
        let hasSupport = true;
        for (let i = 0; i < this.faceNormals.length && hasSupport; ++i) {
            n = this.faceNormals[i];
            const dir = n.scale(-1);
            const pointOnEdge = this.verts[i];
            r.findSupportPoint(dir, pointOnEdge);
            hasSupport = g_tmpSupport.supportPoint !== null;
            if ((hasSupport) && (g_tmpSupport.supportPointDist < bestDistance)) {
                supportPoint = g_tmpSupport.supportPoint;
                bestDistance = g_tmpSupport.supportPointDist;
                bestIndex = i;
            }
        }
        if (hasSupport) {
            const bestVec = this.faceNormals[bestIndex].scale(bestDistance);
            colInfo.setInfo(this.faceNormals[bestIndex], supportPoint.add(bestVec), bestDistance);
        }
        return hasSupport;
    }

    collisionTest(go, colInfo) {
        const s1 = this.findAxisLeastPenetration(go, g_colInfo1);
        if (s1) {
            const s2 = go.findAxisLeastPenetration(this, g_colInfo2);
            if (s2) {
                if (g_colInfo1.depth < g_colInfo2.depth) {
                    const depthVec = g_colInfo1.normal.scale(g_colInfo1.depth);
                    colInfo.setInfo(g_colInfo1.normal, g_colInfo1.start.subtract(depthVec), g_colInfo1.depth);
                } else {
                    colInfo.setInfo(g_colInfo2.normal.scale(-1), g_colInfo2.start, g_colInfo2.depth);
                }
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.verts[0].x, this.verts[0].y);
        ctx.rotate(this.angle);
        ctx.strokeRect(0, 0, this.width, this.height);
        ctx.restore();
        const v = this.velocity.length();
        if (v === 0) {
            return;
        }
        ctx.font = '10px serif';
        ctx.fillText(`${Math.round(v, 2)}`, this.center.x, this.center.y);
    }

    move(displacement) {
        for (let i = 0; i < this.verts.length; ++i) {
            this.verts[i] = this.verts[i].add(displacement);
        }
        this.center = this.center.add(displacement);
    }

    rotate(angle) {
        this.angle += angle;
        for (let i = 0; i < this.verts.length; ++i) {
            this.verts[i] = this.verts[i].rotate(this.center, angle);
        }
        this.faceNormals = [
            this.verts[1].subtract(this.verts[2]).normalize(),
            this.verts[2].subtract(this.verts[3]).normalize(),
            this.verts[3].subtract(this.verts[0]).normalize(),
            this.verts[0].subtract(this.verts[1]).normalize()
        ];
    }

    updateInertia() {
        if (this.invMass === 0) {
            this.inertia = 0;
        } else {
            this.inertia = 1 / ((1 / this.invMass) * (this.width * this.width + this.height * this.height) / 12);
        }
    }
}
