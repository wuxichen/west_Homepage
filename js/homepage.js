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
        'keyboard': true                        // 是否支持键盘翻页
    };

    var container = null,
        sections = null,
        pagesArr = [];


    $.fn.fullPageScrolling = function(options) {
        var options = $.extend({}, defaultOptions, options || {});
        container = $(options.container);
        sections = $(options.sections);

        sections.each(function() {
            pagesArr.push( $(this) );
        });

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
        var pageHtml = '<ul class="pagination"><li class="active"></li>';
        for (var i = 1; i < sections.length; i++) {
            pageHtml += '<li></li>';
        }
        pageHtml += '</ul>';
        $('body').append(pageHtml);
    }



})(jQuery);
