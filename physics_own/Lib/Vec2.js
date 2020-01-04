
class Vec2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    scale(n) {
        return new Vec2(this.x * n, this.y * n);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    rotate(center, angle) {
        const x = this.x - center.x;
        const y = this.y - center.y;
        return new Vec2(
            (x * Math.cos(angle) - y * Math.sin(angle)) + center.x,
            (x * Math.sin(angle) + y * Math.cos(angle)) + center.y
        );
    }

    normalize() {
        const l = this.length();
        return new Vec2(this.x / l, this.y / l);
    }

    distance(other) {
        const x = this.x - other.x;
        const y = this.y - other.y;
        return Math.sqrt(x * x + y * y);
    }
}
