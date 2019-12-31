
var gObjectNum = 0;

function userControl(event) {
    var keycode;
    if (window.event) {
        keycode = event.keyCode;
    } else if (event.which) {
        keycode = event.which
    }

    var width = gEngine.Core.mWidth;
    var height = gEngine.Core.mHeight;
    var context = gEngine.Core.mContext;
    
    if (keycode === 70) {
        var r1 = new Rectangle(new Vec2(gEngine.Core.mWidth / 2, gEngine.Core.mHeight / 2), Math.random() * 30 + 10, Math.random() * 30 + 10, Math.random(), Math.random());
    } else if (keycode === 71) {
        var c1 = new Circle(new Vec2(gEngine.Core.mWidth / 2, gEngine.Core.mHeight / 2), Math.random() * 10 + 20, Math.random(), Math.random());
    }
    
    if (keycode >= 48 && keycode <= 57) {
        if(keycode - 48 < gEngine.Core.mAllObjects.length) {
            gObjectNum = keycode - 48;
        }
    }
    
    if (keycode === 38) {
        if(gObjectNum > 0) {
            --gObjectNum;
        }
    } else if (keycode === 40) {
        if(gObjectNum < gEngine.Core.mAllObjects.length - 1) {
            ++gObjectNum;
        }
    }
    
    if(keycode === 87) {
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(0, -10));
    } else if (keycode === 83) {
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(0, 10));
    } else if (keycode === 65) {
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(-10, 0));
    } else if (keycode === 68) {
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(10, 0));
    }

    if (keycode === 81) {
        gEngine.Core.mAllObjects[gObjectNum].rotate(-0.1);
    } else if (keycode === 69) {
        gEngine.Core.mAllObjects[gObjectNum].rotate(0.1);
    }

    if (keycode === 72) {
        gEngine.Core.mMovement = !gEngine.Core.mMovement;
    }

    if (keycode === 82) {
        gEngine.Core.mAllObjects = gEngine.Core.mAllObjects.splice(4, gEngine.Core.mAllObjects.length);
        gObjectNum = 0;
    }
    
    if (keycode === 73) {
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.y -= 1;
    } else if (keycode === 75) {
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.y += 1;
    }
    if (keycode === 74) {
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.x -= 1;
    } else if (keycode === 76) {
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.x += 1;
    }
    
    if (keycode === 85) {
        gEngine.Core.mAllObjects[gObjectNum].mAngularVelocity -= 0.1;
    } else if (keycode === 79) {
        gEngine.Core.mAllObjects[gObjectNum].mAngularVelocity += 0.1;
    }
    
    if (keycode === 90) {
        gEngine.Core.mAllObjects[gObjectNum].updateMass(-1);
    } else if (keycode === 88) {
        gEngine.Core.mAllObjects[gObjectNum].updateMass(1);
    }
}
