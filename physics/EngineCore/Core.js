
var gEngine = gEngine || {};

gEngine.Core = (function() {
    var mCanvas, mContext, mWidth = 800, mHeight = 450;
    mCanvas = document.getElementById('canvas');
    mContext = mCanvas.getContext('2d');
    mCanvas.width = mWidth;
    mCanvas.height = mHeight;
                
    var mAllObjects = [];

    var updateUIEcho = function () {
        document.getElementById('uiEchoString').innerHTML = `<p>Selected obj: ID: ${gObjectNum}</p>`;
    };

    var draw = function() {
        mContext.clearRect(0, 0, mWidth, mHeight);
        var i;
            for(i = 0; i < mAllObjects.length; ++i) {
                mContext.strokeStyle = 'blue';
                if(i === gObjectNum) {
                    mContext.strokeStyle = 'red';
                }
                mAllObjects[i].draw(mContext);
            }
    };

    var runGameLoop = function() {
        requestAnimationFrame(function () {
                                runGameLoop();
                              });
        updateUIEcho();
        draw();
    };
                
    var initializeEngineCore = function() {
        runGameLoop();
    };
    

    var mPublic = {
        mWidth: mWidth,
        mHeight: mHeight,
        mContext: mContext,
        mAllObjects: mAllObjects,
        initializeEngineCore: initializeEngineCore
    };

    return mPublic;
}());
