
var Circle = function(center, radius, mass, friction, restitution) {
    RigidShape.call(this, center, mass, friction, restitution);
    this.mType = 'Circle';
    this.mRadius = radius;
    this.mStartPoint = new Vec2(center.x, center.y - radius);
    this.mBoundRadius = radius;
    this.updateInertia();
}

var prototype = Object.create(RigidShape.prototype);
prototype.constructor = Circle;
Circle.prototype = prototype;

Circle.prototype.draw = function (context) {
    context.beginPath();
    context.arc(this.mCenter.x, this.mCenter.y, this.mRadius, 0, Math.PI * 2, true);
    context.moveTo(this.mStartPoint.x, this.mStartPoint.y);
    context.lineTo(this.mCenter.x, this.mCenter.y);
    context.stroke();
}

Circle.prototype.move = function (s) {
    this.mStartPoint = this.mStartPoint.add(s);
    this.mCenter = this.mCenter.add(s);
    return this;
}

Circle.prototype.rotate = function (angle) {
    this.mAngle += angle;
    this.mStartPoint = this.mStartPoint.rotate(this.mCenter, angle);
    return this;
}

Circle.prototype.updateInertia = function () {
    if (this.mInvMass === 0) {
        this.mInertia = 0;
    } else {
        this.mInertia = (1 / this.mInvMass) * (this.mRadius * this.mRadius) / 12;
    }
}
