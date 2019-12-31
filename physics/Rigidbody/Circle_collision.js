
Circle.prototype.collisionTest = function (otherShape, collisionInfo) {
    var status = false;
    if (otherShape.mType === 'Circle') {
        status = this.collidedCircCirc(this, otherShape, collisionInfo);
    } else {
        status = false;
    }
    return status;
};

Circle.prototype.collidedCircCirc = function (c1, c2, collisionInfo) {
    var vFrom1to2 = c2.mCenter.subtract(c1.mCenter);
    var rSum = c1.mRadius + c2.mRadius;
    var dist = vFrom1to2.length();
    if (dist > Math.sqrt(rSum * rSum)) {
        return false;
    }
    if (dist !== 0) {
        var normalFrom2to1 = vFrom1to2.scale(-1).normalize();
        var radiusC2 = normalFrom2to1.scale(c2.mRadius);
        collisionInfo.setInfo(rSum - dist, vFrom1to2.normalize(), c2.mCenter.add(radiusC2));
    } else {
        if (c1.mRadius > c2.mRadius) {
            collisionInfo.setInfo(rSum, new Vec2(0, -1), c1.mCenter.add(new Vec2(0, c1.mRadius)));
        } else {
            collisionInfo.setInfo(rSum, new Vec2(0, -1), c2.mCenter.add(new Vec2(0, c2.mRadius)));
        }
    }
};
