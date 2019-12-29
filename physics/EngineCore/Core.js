
var gEngine = gEngine || {};

gEngine.Core = (function() {
    var mCanvas, mContext, mWidth = 800, mHeight = 450;
    mCanvas = document.getElementById('canvas');
    mContext = mCanvas.getContext('2d');
    mCanvas.width = mWidth;
    mCanvas.height = mHeight;
                
    var mCurrentTime, mElapsedTime, mPreviousTime = Date.now(), mLagTime = 0;
    var kFPS = 30;
    var kFrameRate = 1 / kFPS;
    var kMPF = 1000 * kFrameRate;
                
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
                
    var update = function() {
        var i;
        for(i = 0; i < mAllObjects.length; ++i) {
            mAllObjects[i].update();
        }
    }

    var runGameLoop = function() {
        requestAnimationFrame(function () {
                                runGameLoop();
                              });
        mCurrentTime = Date.now();
        mElapsedTime = mCurrentTime - mPreviousTime;
        mLagTime += mElapsedTime;
        while(mLagTime >= kMPF) {
            mLagTime -= kMPF;
            update();
        }
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
