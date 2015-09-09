/**
 * Created by CooTek on 2015/8/19.
 */

var pageAnimation = (function() {

    // 配置元素、类名和延迟时间
    var config = [
        {
            'element': ['.bg-info .fade-to-right', '.bg-info .fade-to-left'],
            'className': ['fade-to-right', 'fade-to-left'],
            'delay': [1200, 1200],
        }
    ];

    // 存储setTimeout的定时器，该屏结束后clearTimeout解除定时器
    var timeoutId = [];

    /**
     * 动画开始函数 生成器
     * @param index
     */
    function funcGenerator(index, animationFunc) {
        console.log(index);
        console.log(animationFunc);
        if (config[index]) {
            var elementArr = config[index].element || [];
            var classNameArr = config[index].className || [];
            var delayArr = config[index].delay || [];

            return function() {
                for (var i = 0; i < elementArr.length; i++) {
                    var clock = animationFunc.call(this, elementArr[i], classNameArr[i] || classNameArr[0], delayArr[i] || delayArr[0]);
                    if (clock !== undefined) {
                        timeoutId[index] = timeoutId[index] || [];
                        timeoutId[index].push(clock);
                    }
                }
            };

        } else {
            return null;
        }
    }

    function beginAnimation(element, className) {
        $(element).removeClass(className+'-end').addClass(className+'-begin');
    }

    function runAnimation(element, className, delay) {
        return setTimeout(function() {
            $(element).removeClass(className+'-begin').addClass(className+'-end');
        }, delay);
    }

    /**
     * 取消编号为index屏的所有定时器
     * @param index
     */
    function cancelTimeout(index) {
        if (timeoutId[index] === undefined) {
            return;
        }

        for (var i = 0; i < timeoutId[index].length; i++) {
            clearTimeout(timeoutId[index][i]);
        }
    }


    return (function() {
        var animationFunctionArr = [];
        for (var i = 0; i < config.length; i++) {
            animationFunctionArr.push({
                begin: funcGenerator(i, beginAnimation),
                run: funcGenerator(i, runAnimation),
                end: cancelTimeout(i)
            });
        }

        return animationFunctionArr;
    })();

})();
