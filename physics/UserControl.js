function userControl(event) {
    var keycode;
    if(window.event) {
        keycode = event.keyCode;
    } else if (event.which) {
        keycode = event.which
    }

    console.log(gEngine);

    var width = gEngine.Core.mWidth;
    var height = gEngine.Core.mHeight;
    var context = gEngine.Core.mContext;
    
    if(keycode === 70) {
        context.strokeRect(Math.random() * width * 0.80, Math.random() * height * 0.80, Math.random() * 30 + 10, Math.random() * 30 + 10);
    } else if(keycode === 71) {
        context.beginPath();
        context.arc(Math.random() * width * 0.80, Math.random() * height * 0.80, Math.random() * 30 + 10, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }
}