app.controller('TopViewController', function ($http, MenuTitle, $timeout, dateFilter) {

    var top = this;

    top.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    top.data = MenuTitle.data;
    MenuTitle.updateTitle('Home View');

    top.updateTime = function(){
        $timeout(function(){
            top.clock = (dateFilter(new Date(), 'H.mm.ss'));
            top.updateTime();
        }, 500);
    };
    top.updateTime();

});

// adjust menu title based on page loaded
app.factory('MenuTitle', function() {

    var data = { title : "" };

    return {
        data : data,
        updateTitle : function(newTitle){
            data.title = newTitle;
        }
    };

});

// apply ordinal suffix to date
function getOrdinal(n) {
    var s=["th","st","nd","rd"],  v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}

// output day detail
var monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function displayDay(year, month, day, hi, lo, avgHi, avgLo, hiMax, hiMaxYear, loMin, loMinYear, loMax, loMaxYear, hiMin, hiMinYear) {
    $("#displayDay").show();
    $(".day").html(getOrdinal(day));
    $(".monthYear").html(monthNames[month] + " " + year);
    $(".hi").html(hi);
    $(".lo").html(lo);
    $(".avgHi").html(avgHi);
    $(".avgLo").html(avgLo);
    $(".hiMax").html(hiMax);
    $(".loMin").html(loMin);
    $(".loMax").html(loMax);
    $(".hiMin").html(hiMin);
    $(".hiMaxYear").html(hiMaxYear);
    $(".loMinYear").html(loMinYear);
    $(".loMaxYear").html(loMaxYear);
    $(".hiMinYear").html(hiMinYear);
}