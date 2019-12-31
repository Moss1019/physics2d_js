
Rectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
    var status = false;
    if (otherShape.mType === 'Circle') {
        status = this.collidedRectCirc(otherShape, collisionInfo);
    } else {
        status = this.collidedRectRect(this, otherShape, collisionInfo);
    }
    return status;
}

Rectangle.prototype.collidedRectCirc = function (otherCirc, collisionInfo) {
    var inside = true;
    var bestDistance = -99999;
    var nearestEdge = 0;
    var i, v;
    var circ2Pos, projection;
    for (i = 0; i < 4; i++) {
        circ2Pos = otherCirc.mCenter;
        v = circ2Pos.subtract(this.mVertex[i]);
        projection = v.dot(this.mFaceNormal[i]);
        if (projection > 0) {
            bestDistance = projection;
            nearestEdge = i;
            inside = false;
            break;
        }
        if (projection > bestDistance) {
            bestDistance = projection;
            nearestEdge = i;
        }
    }
    var dis, normal, radiusVec;
    if (!inside) {
        var v1 = circ2Pos.subtract(this.mVertex[nearestEdge]);
        var v2 = this.mVertex[(nearestEdge + 1) % 4].subtract(this.mVertex[nearestEdge]);
        var dot = v1.dot(v2);
        if (dot < 0) {
            dis = v1.length();
            if (dis > otherCirc.mRadius) {
                return false;
            }
            normal = v1.normalize();
            radiusVec = normal.scale(-otherCirc.mRadius);
            collisionInfo.setInfo(otherCirc.mRadius - dis, normal, circ2Pos.add(radiusVec));
        } else {
            v1 = circ2Pos.subtract(this.mVertex[(nearestEdge + 1) % 4]);
            v2 = v2.scale(-1);
            dot = v1.dot(v2);
            if (dot < 0) {
                dis = v1.length();
                if (dis > otherCirc.mRadius) {
                    return false;
                }
                normal = v1.normalize();
                radiusVec = normal.scale(-otherCirc.mRadius);
                collisionInfo.setInfo(otherCirc.mRadius - dis, normal, circ2Pos.add(radiusVec));
            } else {
                if (bestDistance < otherCirc.mRadius) {
                    radiusVec = this.mFaceNormal[nearestEdge].scale(otherCirc.mRadius);
                    collisionInfo.setInfo(otherCirc.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
                } else {
                    return false;
                }
            }
        }
    } else {
        radiusVec = this.mFaceNormal[nearestEdge].scale(otherCirc.mRadius);
        collisionInfo.setInfo(otherCirc.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
    }
    return true;
}

var SupportStruct = function () {
    this.mSupportPoint = null;
    this.mSupportPointDist = 0;
};
var tmpSupport = new SupportStruct();

var collisionInfoR1 = new CollisionInfo();
var collisionInfoR2 = new CollisionInfo();
Rectangle.prototype.collidedRectRect = function (r1, r2, collisionInfo) {
    var status1 = false;
    var status2 = false;
    status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);
    if (status1) {
        status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
        if (status2) {
            if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth()) {
                var depthVec = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
                collisionInfo.setInfo(collisionInfoR1.getDepth(), collisionInfoR1.getNormal(), collisionInfoR1.mStart.subtract(depthVec));
            } else {
                collisionInfo.setInfo(collisionInfoR2.getDepth(), collisionInfoR2.getNormal().scale(-1), collisionInfoR2.mStart);
            }
        }
    }
    return status1 && status2;
}

Rectangle.prototype.findSupportPoint = function (dir, ptOnEdge, tmpSupport) {
    var vToEdge;
    var projection;
    tmpSupport.mSupportPointDist = -9999999;
    tmpSupport.mSupportPoint = null;
    var i;
    for (i = 0; i < this.mVertex.length; ++i) {
        vToEdge = this.mVertex[i].subtract(ptOnEdge);
        projection = vToEdge.dot(dir);
        if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
            tmpSupport.mSupportPoint = this.mVertex[i];
            tmpSupport.mSupportPointDist = projection;
        }
    }
}

Rectangle.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {
    var n;
    var supportPoint;
    var bestDistance = 999999;
    var bestIndex = null;
    var hasSupport = true;
    var i = 0;
    var tmpSupport = new TmpSupport();
    while((hasSupport) && (i < this.mFaceNormal.length)) {
        n = this.mFaceNormal[i];
        var dir = n.scale(-1);
        var ptOnEdge = this.mVertex[i];
        otherRect.findSupportPoint(dir, ptOnEdge, tmpSupport);
        hasSupport = tmpSupport.mSupportPoint !== null;
        if ((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance)) {
            bestDistance = tmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = tmpSupport.mSupportPoint;
        }
        i += 1;
    }
    if (hasSupport) {
        var bestVec = this.mFaceNormal[bestIndex].scale(bestDistance);
        collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
    }
    return supportPoint;
}
