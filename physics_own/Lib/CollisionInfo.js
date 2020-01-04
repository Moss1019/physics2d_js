
class CollisionInfo {
    constructor() {
        this.normal = new Vec2(0, 0);
        this.start = new Vec2(0, 0);
        this.end = new Vec2(0, 0);
        this.depth = 0;
    }

    setInfo(n, s, d) {
        this.normal = n;
        this.start = s;
        this.depth = d;
        this.end = this.start.add(n.scale(d));
    }

    changeDir() {
        this.normal = this.normal.scale(-1);
        const t = this.end;
        this.end = this.start;
        this.start = t;
    }
}