
var Circle = function(center, radius) {
    RigidShape.call(this, center);
    this.mType = 'Circle';
    this.mRadius = radius;
    this.mStartPoint = new Vec2(center.x, center.y - radius);
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
