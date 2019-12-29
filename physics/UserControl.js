
var gObjectNum = 0;

function userControl(event) {
    var keycode;
    if(window.event) {
        keycode = event.keyCode;
    } else if (event.which) {
        keycode = event.which
    }

    var width = gEngine.Core.mWidth;
    var height = gEngine.Core.mHeight;
    var context = gEngine.Core.mContext;
    
    if(keycode === 70) {
        var r1 = new Rectangle(new Vec2(Math.random() * width * 0.80, Math.random() * height * 0.80), Math.random() * 30 + 10, Math.random() * 30 + 10);
    } else if (keycode === 71) {
        var c1 = new Circle(new Vec2(Math.random() * width * 0.80, Math.random() * height * 0.80), Math.random() * 10 + 20);
    }
    
    if (keycode >= 48 && keycode <= 57) {
        if(keycode - 48 < gEngine.Core.mAllObjects.length) {
            gObjectNum = keycode - 48;
        }
    }
    
    if(keycode === 38) {
        if(gObjectNum > 0) {
            --gObjectNum;
        }
    } else if(keycode === 40) {
        if(gObjectNum < gEngine.Core.mAllObjects.length - 1) {
            ++gObjectNum;
        }
    }
    
    
}
