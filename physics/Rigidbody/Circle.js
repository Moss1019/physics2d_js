
var Circle = function(center, radius, fix) {
    RigidShape.call(this, center);
    this.mType = 'Circle';
    this.mRadius = radius;
    this.mStartPoint = new Vec2(center.x, center.y - radius);
    this.mFix = fix;
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
