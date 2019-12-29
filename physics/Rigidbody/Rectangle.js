
var Rectangle = function (center, width, height) {
    RigidShape.all(this, center);
    this.mType = 'Rectangle';
    this.mWidth = width;
    this.mHeight = height;
    this.mVertex = [];
    this.mFaceNormal = [];
    
    this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
    this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
    this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
    this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);
    
    this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]).normalize();
    this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]).normalize();
    this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[4]).normalize();
    this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]).normalize();
    
    var prototype = Object.create(RigidShape.prototype);
    prototype.constructor = Rectangle;
    Rectangle.prototype = prototype;
}

Rectangle.prototype.draw = function(context) {
    context.save();
    context.translate(this.mVertex[0], this.mVertex[1]);
    context.rotate(this.mAngle);
    context.strokeRect(0, 0, this.mWidth, this.mHeight);
    context.restore();
}
