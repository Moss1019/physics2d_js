
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
                var mUpdateIntervalInSecods = kFrameRate;
                
    var mAllObjects = [];
                
                var mGravity = new Vec2(0, 2.8);
                var mMovement = false;

    var updateUIEcho = function () {
        document.getElementById('uiEchoString').innerHTML = `<p>Selected obj: ID: ${gObjectNum}</p><p>Center: ${gEngine.Core.mAllObjects[gObjectNum].mCenter.x}, ${gEngine.Core.mAllObjects[gObjectNum].mCenter.y}</p><p>Angle: ${gEngine.Core.mAllObjects[gObjectNum].mAngle}</p><hr /><p>${gEngine.Core.mAllObjects[gObjectNum].mVelocity.x} ${gEngine.Core.mAllObjects[gObjectNum].mVelocity.y}</p>`;
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
        mLagTime = mElapsedTime;
        updateUIEcho();
        draw();
        while(mLagTime >= kMPF) {
            mLagTime -= kMPF;
            gEngine.Physics.collision();
            update();
        }
    };
                
    var initializeEngineCore = function() {
        runGameLoop();
    };
    

    var mPublic = {
        mWidth: mWidth,
        mHeight: mHeight,
        mContext: mContext,
        mAllObjects: mAllObjects,
                mGravity: mGravity,
                mMovement: mMovement,
                mUpdateIntervalInSecods:mUpdateIntervalInSecods,
        initializeEngineCore: initializeEngineCore
    };

    return mPublic;
}());
