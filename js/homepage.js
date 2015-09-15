/**
 * Created by CooTek on 2015/8/19.
 */

var pageAnimation = (function() {

    // 配置元素、类名和延迟时间
    var config = [
        {
            'element': ['.bg-info .fade-to-right', '.bg-info .fade-to-left',
                '#info-title', '#jquery', '#less', '#grunt', '#css', '#javascript', '#canvas', '#html5',
                '#css3', '#git', '#angularjs', '#html', '#zepto', '#bootstrap', '#svn', '#php'
            ],
            'className': ['fade-to-right', 'fade-to-left',
                'fade','fade','fade','fade','fade','fade','fade','fade',
                'fade','fade','fade','fade','fade','fade','fade','fade'
            ],
            'delay': [200, 200,
                800, 1000, 1100, 1200, 1700, 1200, 1100, 1500,
                1300, 1400, 1300, 1500, 1600, 1700, 1800, 1200
            ]

        }, {
            'element': ['.bg-project .fade', '#project-separator', '#project-left-circle', '#project-right-circle',
                '#project-left-block', '#project-right-block'],
            'className': ['fade', 'scale', 'scale', 'scale', 'fade-to-left', 'fade-to-right'],
            'delay': [200, 500, 800, 1000, 1500, 1500]

        }, {
            'element': ['.bg-intern .fade-to-right', '.bg-intern .fade-to-left', '#intern-separator',
                '#intern-circle1', '#intern-circle2', '#intern-circle3',
                '#intern-block1', '#intern-block2', '#intern-block3'
            ],
            'className': ['fade-to-right', 'fade-to-left', 'scale',
                'fade', 'fade', 'fade',
                'rotate', 'rotate', 'rotate'
            ],
            'delay': [200, 200, 500,
                800, 1000, 1200,
                1300, 1500, 1700
            ]

        }, {
            'element': ['.bg-opensource .page-title .fade-to-right', '.bg-opensource .page-title .fade-to-left',
                '#opensource-separator', '#opensource-circle1', '#opensource-circle2',
                '#opensource-block1', '#opensource-block2', '#opensource-download'
            ],
            'className': ['fade-to-right', 'fade-to-left',
                'scale', 'fade', 'fade',
                'fade-to-left', 'fade-to-right', 'fade'
            ],
            'delay': [200, 200,
                500, 900, 1100,
                1500, 1500, 1700
            ]
        }
    ];

    // 存储setTimeout的定时器，该屏结束后clearTimeout解除定时器
    var timeoutId = [];
    var transitionProp = ['-webkit-transition', '-moz-transition', '-o-transition', '-ms-transition', 'transition'];


    /**
     * 动画开始函数 生成器
     * @param index
     */
    function funcGenerator(index, animationFunc) {
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

        if (isSupportCss(transitionProp)) {

            var transitionDuration = getVendorPropertyObj('transition', '');
            $(element).css(transitionDuration).removeClass(className+'-end').addClass(className+'-begin');

        } else {
            $(element).removeClass(className);
            $(element).fadeOut();
            //$(element).css('visibility', 'hidden');
        }
    }

    function runAnimation(element, className, delay) {

        if (isSupportCss(transitionProp)) {

            return setTimeout(function() {
                $(element).removeClass(className+'-begin').addClass(className+'-end');
            }, delay+1000);

        } else {

            return setTimeout(function() {
                //$(element).css('visibility', '');
                $(element).fadeIn();
            }, delay+1000);

        }

    }

    /**
     * 是否支持css的某个属性
     */
    function isSupportCss(propertyArr){
        var body = $("body")[0];
        for (var i = 0; i < propertyArr.length; i++) {
            if(propertyArr[i] in body.style){
                return true;
            }
        }
        return false;
    }

    /**
     * CSS属性 'prop = value' 加上各个浏览器前缀，返回其对象
     * @param prop
     * @param value
     * @returns {{}}
     */
    function getVendorPropertyObj(prop, value) {
        var vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''].reverse();
        var resultObj = {};

        for (var i = vendors.length; i--; ) {
            resultObj[ vendors[i] + prop ] = value;
        }
        return resultObj;
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


    // 返回 begin, run, end 动画函数组成的 数组
    return (function() {
        var animationFunctionArr = [];
        for (var i = 0; i < config.length; i++) {
            animationFunctionArr.push({
                begin: funcGenerator(i, beginAnimation),
                run: funcGenerator(i, runAnimation),
                end: (function(i) {
                    return function() {
                        cancelTimeout(i);
                    }
                })(i)
            });
        }

        return animationFunctionArr;
    })();

})();
