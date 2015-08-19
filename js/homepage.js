/**
 * Created by CooTek on 2015/8/19.
 */

var pageAnimation = (function() {


    return [
        {
            begin: function(){ console.log('1 begin')},
            run: function(){console.log('1 run')},
            end: function(){console.log('1 end')}
        },
        {
            begin: function(){ console.log('2 begin')},
            run: function(){console.log('2 run')},
            end: function(){console.log('2 end')}
        },
        {
            begin: function(){ console.log('3 begin')},
            run: function(){console.log('3 run')},
            end: function(){console.log('3 end')}
        },
        {
            begin: function(){ console.log('4 begin')},
            run: function(){console.log('4 run')},
            end: function(){console.log('4 end')}
        }
    ];
})();
