describe("Controllers", function() {
  var $rootScope, socket;

  beforeEach(angular.mock.module("GRTVPlaysTurtle"));

  beforeEach(angular.mock.inject(function(_$rootScope_, _socket_) {
    $rootScope = _$rootScope_;
    socket = _socket_;
  }));

  describe("AppCtrl", function() {
    var appCtrl;

    beforeEach(angular.mock.inject(function($controller) {
      appCtrl = $controller("AppCtrl");
    }));

    it("should declare a command list", function() {
      var cmdList = { test: "Test", cmd: "Command" };
      expect($rootScope.commands).toEqual({});

      socket.receive("command list", cmdList);

      expect($rootScope.commands).toEqual(cmdList)
    });
  });

  describe("MapCtrl", function() {
    var mapCtrl;
    
    beforeEach(angular.mock.inject(function($controller) {
      mapCtrl = $controller("MapCtrl");
    }));

    it("should exist", function() {
      expect(mapCtrl).toBeDefined();
    });
  });

  describe("StatsCtrl", function() {
    var statsCtrl;

    beforeEach(angular.mock.inject(function($controller) {
      statsCtrl = $controller("StatsCtrl");
    }));

    it("should have the app stats", function() {
      expect(statsCtrl.connected).toBeNull();
      expect(statsCtrl.commands).toBeNull();

      socket.receive("stats", {
        connected: 123,
        commands: 456
      });

      expect(statsCtrl.connected).toEqual(123);
      expect(statsCtrl.commands).toEqual(456);
    });
  });

  describe("LogCtrl", function() {
    var logCtrl, TurtlesList;

    beforeEach(angular.mock.inject(function($controller, _TurtlesList_) {
      logCtrl = $controller("LogCtrl");
      TurtlesList = _TurtlesList_;
    }));

    it("should log messages", function() {
      expect(logCtrl.lines).toBeDefined();
      expect(logCtrl.logMessage).toBeDefined();
      
      logCtrl.logMessage("test");

      expect(logCtrl.lines[0].date).toBeCloseTo(Date.now(), 10);
      expect(logCtrl.lines[0].message).toEqual("test");
    });

    it("should clear messages", function() {
      logCtrl.logMessage("test");

      expect(logCtrl.lines).not.toEqual([]);

      logCtrl.clear();

      expect(logCtrl.lines).toEqual([]);
    });

    it("should log commands", function() {
      TurtlesList.import([{
        id: 1,
        name: "Turtle"
      }]);

      socket.receive("command", {
        turtleId: 1,
        command: "test"
      });

      expect(logCtrl.lines[0].message).toContain("test");
      expect(logCtrl.lines[0].message).toContain("Turtle");

      socket.receive("command", {
        turtleId: 5,
        command: "test2"
      });

      expect(logCtrl.lines[0].message).toContain("test2");
      expect(logCtrl.lines[0].message).toContain("5");
    });
  });

  describe("TurtlesListCtrl", function() {
    var turtlesListCtrl;

    beforeEach(angular.mock.inject(function($controller) {
      turtlesListCtrl = $controller("TurtlesListCtrl");
    }));

    it("should be initialized", function() {
      expect(turtlesListCtrl).toBeDefined();
      expect(turtlesListCtrl.list).toBeDefined();
      expect(turtlesListCtrl.select).toBeDefined();
      expect(turtlesListCtrl.isSelected).toBeDefined();
    });

    it("should handle socket events", function() {
      expect(turtlesListCtrl.list).toEqual({});

      socket.receive("turtles list", [
        {
          id: 1,
          name: "Turtle1"
        },
        {
          id: 2,
          name: "Turtle2"
        },
        {
          id: 3,
          name: "Turtle3"
        }
      ]);

      expect(Object.keys(turtlesListCtrl.list).length).toEqual(3);
      expect(turtlesListCtrl.list[1].getName()).toEqual("Turtle1");

      socket.receive("turtle disconnected", 1);
      expect(turtlesListCtrl.list[1]).toBeUndefined();

      socket.receive("turtle connected", {
        id: 4,
        name: "Turtle4"
      });
      expect(turtlesListCtrl.list[4].getName()).toEqual("Turtle4");

      socket.receive("turtle update", {
        id: 4,
        name: "Changed"
      });
      expect(turtlesListCtrl.list[4].getName()).toEqual("Changed");

      socket.receive("turtle update", {
        id: 42,
        name: "Undeclared turtle"
      });
      expect(turtlesListCtrl.list[42]).toBeUndefined();
    });

    it("can select turtle", function() {
      expect(turtlesListCtrl.list).toEqual({});
      expect($rootScope.selectedTurtle).toBeNull();

      socket.receive("turtles list", [
        {
          id: 1,
          name: "Turtle1"
        },
        {
          id: 2,
          name: "Turtle2"
        },
        {
          id: 3,
          name: "Turtle3"
        }
      ]);

      turtlesListCtrl.select(1);
      expect($rootScope.selectedTurtle).toEqual(1);
      expect(turtlesListCtrl.isSelected(1)).toBe(true);
      expect(turtlesListCtrl.isSelected(2)).toBe(false);

      turtlesListCtrl.select(0);
      expect($rootScope.selectedTurtle).toBeNull();
      expect(turtlesListCtrl.isSelected(1)).toBe(false);
    });
  });

  describe("TurtleCtrl", function() {
    var turtlesListCtrl, turtleCtrl;

    beforeEach(angular.mock.inject(function($controller) {
      turtlesListCtrl = $controller("TurtlesListCtrl");
      turtleCtrl = $controller("TurtleCtrl");
    }));

    it("should be initialized", function() {
      expect(turtleCtrl.turtle).toBeDefined();
      expect(turtleCtrl.sendCommand).toBeDefined();
    });

    it("should get the selected turtle", function() {
      expect(turtleCtrl.turtle).toBe(false);

      socket.receive("turtles list", [
        {
          id: 1,
          name: "Turtle1"
        },
        {
          id: 2,
          name: "Turtle2"
        },
        {
          id: 3,
          name: "Turtle3"
        }
      ]);

      turtlesListCtrl.select(1);
      $rootScope.$digest();

      expect($rootScope.selectedTurtle).toEqual(1);
      expect(turtleCtrl.turtle).toBeTruthy();

      turtleCtrl.sendCommand(turtleCtrl.turtle, "test");
    });
  });

  describe("EntityCtrl", function() {
    var entityCtrl, entitiesListCtrl;

    beforeEach(angular.mock.inject(function($controller) {
      entityCtrl = $controller("EntityCtrl");
      entitiesListCtrl = $controller("EntitiesListCtrl");
    }));

    it("should be initialized", function() {
      expect(entityCtrl.entity).toBeDefined();
    });

    it("should get the selected entity", function() {
      expect(entityCtrl.turtle).toBeUndefined();

      socket.receive("entities", {
        "Entity1": {
          type: "Player",
          username: "Steve",
          position: { x: 1, y: 2, z: 3 }
        },
        "Entity2": {
          type: "Cow",
          position: { x: 4, y: 5, z: 6 }
        }
      });

      entitiesListCtrl.select("Entity1");
      $rootScope.$digest();

      expect($rootScope.selectedEntity).toEqual("Entity1");
      expect(entityCtrl.entity.type).toEqual("Player");

      socket.receive("entities", {
        "Entity1": {
          type: "Cow",
          position: { x: 1, y: 2, z: 3 }
        }
      });

      $rootScope.$digest();

      expect(entityCtrl.entity.type).toEqual("Cow");
    });
  });

  describe("EntitiesListCtrl", function() {
    var entitiesListCtrl;

    beforeEach(angular.mock.inject(function($controller) {
      entitiesListCtrl = $controller("EntitiesListCtrl");
    }));

    it("should be initialized", function() {
      expect(entitiesListCtrl.list).toBeDefined();
      expect(entitiesListCtrl.select).toBeDefined();
      expect(entitiesListCtrl.isSelected).toBeDefined();
    });

    it("should list entities", function() {
      expect(entitiesListCtrl.list).toEqual({});

      socket.receive("entities", {
        "Entity1": {
          type: "Player",
          username: "Steve",
          position: { x: 1, y: 2, z: 3 }
        },
        "Entity2": {
          type: "Cow",
          position: { x: 4, y: 5, z: 6 }
        }
      });

      entitiesListCtrl.select("Entity1");

      expect($rootScope.selectedEntity).toEqual("Entity1");
      expect(entitiesListCtrl.isSelected("Entity1")).toBe(true);
      expect(entitiesListCtrl.isSelected("Entity2")).toBe(false);
    });
  });
});