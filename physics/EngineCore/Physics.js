
var gEngine = gEngine || {};

gEngine.Physics = (function () {
                   var mPositionaCorrectionFlag = true;
                   var mRelaxationCount = 15;
                   var mPosCorrectionRate = 0.8;
                   
    var collision = function () {
        var i, j, k;
        var collisionInfo = new CollisionInfo();
                   for (k = 0; k < mRelaxationCount; ++k) {
        for(i = 4; i < gEngine.Core.mAllObjects.length; ++i) {
            for(j = i + 1; j < gEngine.Core.mAllObjects.length; ++j) {
                if (gEngine.Core.mAllObjects[i].boundTest(gEngine.Core.mAllObjects[j])) {
                    if(gEngine.Core.mAllObjects[i].collisionTest(gEngine.Core.mAllObjects[j], collisionInfo)) {
                        if (collisionInfo.getNormal().dot(gEngine.Core.mAllObjects[j].mCenter.subtract(gEngine.Core.mAllObjects[i].mCenter)) < 0) {
                            collisionInfo.changeDir();
                        }
                    }
                    drawCollisionInfo(collisionInfo, gEngine.Core.mContext);
                   resolveCollision(gEngine.Core.mAllObjects[i], gEngine.Core.mAllObjects[j], collisionInfo);
                }
            }
        }
                   }
    };
                   
                   var positionalCorrection = function (s1, s2, collisionInfo) {
                    var s1InvMass = s1.mInvMass;
                    var s2InvMass = s2.mInvMass;
                   
                   var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
                   var correctionAmount = collisionInfo.getNormal().scale(num);
                   
                   s1.move(correctionAmount.scale(-s1InvMass));
                   s2.move(correctionAmount.scale(s2InvMass));
                   }
                   
                   var resolveCollision = function (s1, s2, collisionInfo) {
                   if ((s1.mInMass === 0) && (s2.mInMass === 0)) {
                   return;
                   }
                   if (mPositionaCorrectionFlag) {
                   positionalCorrection(s1, s2, collisionInfo);
                   }
                   }
    
    var drawCollisionInfo = function (collisionInfo, context) {
        context.beginPath();
        context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
        context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
        context.closePath();
        context.strokeStyle = 'orange';
        context.stroke();
    };

    var mPublic = {
        collision: collision,
                   mPositionaCorrectionFlag: mPositionaCorrectionFlag
    };
    
    return mPublic;
}());
