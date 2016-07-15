
var systemService = angular.module('myApp.lpcservice', [])
.service('lpcService', function () {

    console.log("Creating LPC service");

    var timelines = [
      {name: "No Scheduled Event", timelineId: -1},
      {name: "Night", timelineId: 1},
      {name: "Yellow Wave", timelineId: 2},
      {name: "Popcorn", timelineId: 3},
      {name: "Purple People Eater", timelineId: 4},
      {name: "Fireworks", timelineId: 5},
      {name: "Rainbow", timelineId: 6},
      {name: "Blue", timelineId: 7},
      {name: "Red", timelineId: 8},
      {name: "Game Night", timelineId: 9}];


    var events = [];
    for(i = 1 ; i < 367 ; i++) {
        var nameIndex = i % timelines.length;
        events.push({doy:i, timelineId:timelines[nameIndex].timelineId});
    }

    this.getRawEventData = function() {
      return events;
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
        var idToName = this.getEventMap();
        eventOutlook.push({name:idToName[this.getEventForDOY(eventDay).timelineId], date:"Today"});

        for(dayInc = 1 ; dayInc < 5 ; dayInc++) {
          eventDay.add(1, "d");
          eventOutlook.push({name:idToName[this.getEventForDOY(eventDay).timelineId],
            date:eventDay.format("dddd")});
        }

        return eventOutlook;
    };

    this.getTimelines = function() {
        return timelines;
    };

    this.getEventMap = function() {
      console.log("getting");
      var map = new Object();
      for(i = 0 ; i < timelines.length ; i++) {
        var timeline = timelines[i];
        map[timeline.timelineId] = timeline.name;
      }
      return map;
    }

    this.getAllEventsForYear = function(year) {
      console.log("Getting all events");
        var dates = [];
        var idToName = this.getEventMap();
        for(i = 0 ; i < events.length ; i++) {
            var scheduledEvent = events[i];
            var timelineId = scheduledEvent.timelineId;
            var name = idToName[timelineId];
            var eventDate = new Date(year, 0, 1, 0, 0, 0, 0);
            eventDate.setDate(scheduledEvent.doy);
            var color = timelineId === -1 ? '#6462C4':'#4FC193';
            // console.log(color);
            var calEvent = {title: name,
              start: moment(eventDate),
              allDay: true,
              timelineId: timelineId,
              stick: true,
              color: color

            };
            dates.push(calEvent);
        }
        return dates;
    };

    this.setAllEvents = function(newEvents) {

      var paddedEvent = [];
      for(i = 1 ; i < 367 ; i++) {
          paddedEvent.push({doy:i, timelineId: -1});
      }

      newEvents.forEach(function(obj, index) {
        paddedEvent[obj.doy - 1] = obj;
      });
      events = paddedEvent;
    }

    this.setEvent = function(updatedEvent, date) {
      var doy = date.dayOfYear();
      for(i = 0 ; i < events.length ; i++) {
        var event = events[i];
        if(event.doy === doy) {
          event.timelineId = updatedEvent.timelineId;
          return i;
        }
      }
      return -1;
    };
});
