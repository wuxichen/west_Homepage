/**
 * Created by CooTek on 2015/8/18.
 */

/* ---------- jQuery组件：FullPageScrolling ---------- */
(function($) {

    var defaultOptions = {
        'container': '#page-container',         // 滚动页面所在的父级
        'sections': '.page-section',            // 单一页面 类名
        'timingFunction': 'ease',               // 滚动所用的时间函数
        'duration': 1000,                       // 滚动一屏所需要的时间
        'pagination': true,                     // 是否显示分页
        'keyboard': true,                       // 是否支持键盘翻页
        'pageAnimation': []                     // 每页的动画（包括begin, run, end），无则不执行
    };

    var container = null,
        sections = null,
        options = {},
        canScroll = true,
        pagesArr = [],
        pageIndex = 0;


    $.fn.fullPageScrolling = function(userOptions) {
        options = $.extend({}, defaultOptions, userOptions || {});
        container = $(options.container);
        sections = $(options.sections);
        pageIndex = 0;

        sections.each(function() {
            pagesArr.push( $(this) );
        });

        initAnimation();

        if (options.pagination) {
            initPagination();
        }

        if (options.keyboard) {

        }

    };

    /**
     * 初始化分页标签
     */
    function initPagination() {
        var pageHtml = '<ul class="pagination" style="height:' + (sections.length*26+10) + 'px"><li class="active"></li>';
        for (var i = 1; i < sections.length; i++) {
            pageHtml += '<li></li>';
        }
        pageHtml += '</ul>';
        $('body').append(pageHtml);

        // 给页面标志（圆圈）绑定点击事件
        var paginationList = $('.pagination').find('li');
        paginationList.click(function() {
            slideToPage(pageIndex, paginationList.index(this));
        });
    }

    /**
     * 初始化第一页的动画
     */
    function initAnimation() {
        if (options.pageAnimation[pageIndex] && typeof options.pageAnimation[pageIndex].begin === 'function') {
            options.pageAnimation[pageIndex].begin.call(this);
        }
        if (options.pageAnimation[pageIndex] && typeof options.pageAnimation[pageIndex].run === 'function') {
            options.pageAnimation[pageIndex].run.call(this);
        }
    }

    /**
     * 鼠标滚动事件响应函数
     */
    function mouseWheelHandler(event) {
        event.preventDefault();
        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;  // 正则往上，负则往下

        if (canScroll) {
            if (delta > 0) {
                slideUp();
            } else {
                slideDown();
            }
        }
    }
    $(document).on("mousewheel DOMMouseScroll", mouseWheelHandler);


    /**
     * 向上滚动一屏，到顶则不滚动
     */
    function slideDown() {
        if (pageIndex < sections.length-1) {
            var previousPage = pageIndex;
            pageIndex++;
            slideToPage(previousPage);
        }
    }

    /**
     * 向下滚动一屏，到底则不滚动
     */
    function slideUp() {
        if (pageIndex > 0) {
            var previousPage = pageIndex;
            pageIndex--;
            slideToPage(previousPage);
        }
    }

    /**
     * 滚动到特定编号页面，若无则滚动到pageIndex
     * @param pageNo    页面编号
     * @param noAnimation 是否不采用动画
     */
    function slideToPage(previousPage, pageNo, noAnimation) {
        pageIndex = pageNo === undefined? pageIndex : pageNo;
        var destTop = -sections.eq(pageIndex).position().top;
        var transitionProp = ['-webkit-transition', '-moz-transition', '-o-transition', '-ms-transition', 'transition'];
        var slideOptions = {
            'top': destTop + 'px' || 0
        };

        canScroll = false;

        // 每页动画
        if (previousPage !== undefined && pageIndex !== previousPage) {
            if (options.pageAnimation[previousPage] && typeof options.pageAnimation[previousPage].end === 'function') {
                options.pageAnimation[previousPage].end.call(this);
            }
            if (options.pageAnimation[pageIndex] && typeof options.pageAnimation[pageIndex].begin === 'function') {
                options.pageAnimation[pageIndex].begin.call(this);
            }
        }

        if (isSupportCss(transitionProp)) {

            if (noAnimation){

                $.each(transitionProp, function() {
                    slideOptions[this] = ''
                });

            } else {

                var transitionOptions = 'top ' + options.duration + 'ms ' + options.timingFunction;
                $.each(transitionProp, function() {
                    slideOptions[this] = transitionOptions;
                });
            }

            container.css(slideOptions);

        } else {

            container.animate(slideOptions, noAnimation ? 0 : options.duration);
        }

        setTimeout(function() {
            canScroll = true;
        }, noAnimation ? 0 : options.duration);

        // pageIndex页面动画开始
        if (previousPage !== undefined && pageIndex !== previousPage) {
            if (options.pageAnimation[pageIndex] && typeof options.pageAnimation[pageIndex].run === 'function') {
                options.pageAnimation[pageIndex].run.call(this);
            }
        }

        updatePagination();
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
     * 更新分页标志
     */
    function updatePagination() {
        if (options.pagination) {
            $('.pagination').find('li').removeClass('active').eq(pageIndex).addClass('active');
        }
    }

    /**
     * 窗口大小改变的响应函数
     */
    function windowResizeHandler() {
        slideToPage();
    }
    $(window).on('resize', windowResizeHandler);



})(jQuery);

$('#page-container').fullPageScrolling({
    'timingFunction': 'ease-in-out',
    'pageAnimation': pageAnimation
});

