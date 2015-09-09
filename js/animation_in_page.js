/**
 * Created by d on 2015-09-05.
 */

// JS动画框架
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());


(function() {

    var blockCount = 3;
    var startDegree = 0;
    var totalDegree = 180;

    var canAnimate = [];        // 当对应的变量为true时，点击事件才会执行
    var currentFrame = [];
    var totalFrame = [];
    var roateBlockFunc = [];

    for (var i = 0; i < blockCount; i++) {
        canAnimate[i] = true;
        currentFrame[i] = 0;
        totalFrame[i] = 40;
        roateBlockFunc[i] = generateRotateBlockFunc(i);
    }

    /**
     * 返回 block动画 函数，index对应block的编号
     * @param index
     * @returns {Function}
     */
    function generateRotateBlockFunc(index) {
        var reverseDirection = false;

        return function(){
            var element = $('.intern-block').eq(index);
            var currentDegree = Math.round( (totalDegree - startDegree) * (currentFrame[index] / totalFrame[index]) );
            currentDegree = reverseDirection ? currentDegree + 180 : currentDegree;

            var cssObj = {};
            var vendors = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
            for (var i = vendors.length; i--; ) {
                cssObj[ vendors[i] + 'transform' ] = 'rotateY(' + currentDegree + 'deg)';
            }
            element.css('transition-duration', '0s');
            element.css(cssObj);

            // 当转到一半时候，图片变成文字
            if (currentFrame[index] === totalFrame[index] / 2) {
                $(element).find('.text').toggleClass('display-none')
                    .end().find('.picture').toggleClass('display-none');
            }

            currentFrame[index]++;
            if (currentFrame[index] <= totalFrame[index]) {
                requestAnimationFrame(arguments.callee);
            } else {
                canAnimate[index] = true;
                reverseDirection = !reverseDirection;
            }

        };
    }

    $('.intern-block').each(function(index, item) {

        $(item).click(function() {

            if (canAnimate[index]) {
                canAnimate[index] = false;

                currentFrame[index] = 0;
                requestAnimationFrame(roateBlockFunc[index]);
            }
        });
    });



})();