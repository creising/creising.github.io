
var systemService = angular.module('myApp.lpcservice', [])
.service('lpcService', function () {

    console.log("Creating LPC service");
    var eventNames = ["Night", "Yellow Wave", "Popcorn", "Purple People Eater",
    "Fireworks", "Rainbow", "Blue", "Red", "Game Night"];

    var events = [];
    for(i = 1 ; i < 367 ; i++) {
        var nameIndex = i % eventNames.length;
        events.push({doy:i, event:eventNames[nameIndex]});
    }

    this.getLpcTime = function() {
      return moment();
    }

    this.getSystemData = function () {
        return [{key: "Model", value:"LPCX"},
        {key: "Memory", value: "Total: 500MB, Used: 250MB, Remaining:250MB"},
        {key: "Serial Number", value: "12345DEMO"},
        {key: "IP Address", value:"192.1.2.3"}];
    };

    this.getClock = function () {
        return [{key: "Current Time", value:this.getLpcTime().format("dddd, MMMM Do YYYY, h:mm:ss a")},
        {key: "GMT Offset", value: "-5"},
        {key: "DST", value: "On"},
        {key: "Today's Sunrise", value: "5:34am"},
        {key: "Today's Sunset", value: "8:46pm"}];
    };

    this.getProjectInfo = function () {
        return [{key: "Project Name", value: "Clock Demo"},
        {key: "Service Provider", value:"Light Tech LLC"},
        {key: "Author", value:"Grant Haase"},
        {key: "Uploaded On:", value:"01/01/2016"}]
    };

    this.getSoftwareVersion = function () {
        return [{key: "Software Version", value: "1.0"},
        {key: "UI Version", value: "0.1"}]
    };

    this.getEventForDOY = function(theMoment) {
      return events[theMoment.dayOfYear() - 1];
    };

    this.getUpcomingEvents = function () {
        var eventDay = this.getLpcTime();
        var doy = eventDay.dayOfYear();
        var eventOutlook = [];
        eventOutlook.push({name:this.getEventForDOY(eventDay).event, date:"Today"});

        for(dayInc = 1 ; dayInc < 5 ; dayInc++) {
          eventDay.add(1, "d");
          eventOutlook.push({name:this.getEventForDOY(eventDay).event,
            date:eventDay.format("dddd")});
        }

        return eventOutlook;
    };

    this.getTimelines = function() {
        return eventNames;
    };

    this.getAllEventsForYear = function(year) {
        var dates = [];
        for(i = 0 ; i < events.length ; i++) {
            var event = events[i];
            var eventDate = new Date(year, 0, 1, 0, 0, 0, 0);
            eventDate.setDate(event.doy);
            dates.push({title: event.event,
              start: moment(eventDate),
              allDay: true,
              stick: true});
        }
        return dates;
    };

    this.setEvent = function(eventName, date) {
      var doy = date.dayOfYear();
      for(i = 0 ; i < events.length ; i++) {
        var event = events[i];
        if(event.doy === doy) {
          event.event = eventName;
          return i;
        }
      }
      return -1;
    };
});
