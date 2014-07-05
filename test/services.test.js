describe("Services", function() {
  beforeEach(angular.mock.module("GRTVPlaysTurtle"));

  describe("Turtle", function() {
    var Turtle;
    beforeEach(angular.mock.inject(function(_Turtle_) {
      Turtle = _Turtle_;
    }));

    it("should be defined", function() {
      expect(Turtle).toBeDefined();
    });

    it("should create an instance", function() {
      var t = new Turtle({
        id: 1,
        name: "Turtle",
        location: {
          X: 1,
          Y: 2,
          Z: 3
        },
        data: {}
      });

      expect(t).toBeDefined();
      expect(t.getId()).toEqual(1);
      expect(t.getName()).toEqual("Turtle");
      expect(t.getLocation()).toEqual({ X: 1, Y: 2, Z: 3 });
      expect(t.getData()).toEqual({});
    });

    it("should be updated", function() {
      var t = new Turtle({
        id: 1,
        name: "Turtle",
        location: {
          X: 1,
          Y: 2,
          Z: 3
        },
        data: {}
      });

      t.update({
        id: 5, // sould not change
        name: "Changed",
        location: {
          X: 4,
          Y: 5,
          Z: 6
        },
        data: {
          changed: true
        }
      });

      expect(t).toBeDefined();
      expect(t.getId()).not.toEqual(5);
      expect(t.getName()).toEqual("Changed");
      expect(t.getLocation()).toEqual({ X: 4, Y: 5, Z: 6 });
      expect(t.getData()).toEqual({ changed: true });

      t.update({
        data: {
          changed2: true
        }
      });

      expect(t.getData()).toEqual({ changed: true, changed2: true });
    });
  });

  describe("TurtlesList", function() {
    var TurtlesList, Turtle, $rootScope;
    beforeEach(angular.mock.inject(function(_TurtlesList_, _Turtle_, _$rootScope_) {
      TurtlesList = _TurtlesList_;
      Turtle = _Turtle_;
      $rootScope = _$rootScope_;
    }));

    it("should be initialized", function() {
      expect(TurtlesList).toBeDefined();
      expect(TurtlesList.getList()).toBe(false);
      expect(TurtlesList.getSelectedTurtle()).toBe(false);
    });

    it("should import, remove and add turtles", function() {
      TurtlesList.import([
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

      expect(TurtlesList.getList()).toBeTruthy();
      expect(TurtlesList.getTurtle(1)).toBeTruthy();
      expect(TurtlesList.getTurtle(1).getName()).toEqual("Turtle1");
      expect(TurtlesList.getTurtle(2).getName()).toEqual("Turtle2");

      expect(TurtlesList.getTurtle(4)).toBeFalsy();
      TurtlesList.add({
        id: 4,
        name: "Turtle4"
      });
      expect(TurtlesList.getTurtle(4)).toBeTruthy();
      expect(TurtlesList.getTurtle(4).getName()).toEqual("Turtle4");

      expect(TurtlesList.getTurtle(3)).toBeTruthy();
      TurtlesList.remove(3);
      expect(TurtlesList.getTurtle(3)).toBeFalsy();

      expect(TurtlesList.getTurtle(6)).toBeFalsy();
      var t = new Turtle({
        id: 6,
        name: "Turtle6"
      });
      TurtlesList.add(t);
      expect(TurtlesList.getTurtle(6)).toBeTruthy();
      expect(TurtlesList.getTurtle(6).getName()).toEqual("Turtle6");
    });

    it("should clear", function() {
      TurtlesList.import([
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

      expect(TurtlesList.getList()).toBeTruthy();
      TurtlesList.clear();
      expect(TurtlesList.getList()).toBeFalsy();
    });

    it("should select", function() {
      TurtlesList.clear();
      var t = new Turtle({
        id: 1,
        name: "Turtle"
      });
      TurtlesList.add(t);

      expect(TurtlesList.getSelectedTurtle()).toBeFalsy();
      expect($rootScope.selectedTurtle).toBeNull();
      expect(TurtlesList.isSelected(t)).toBeFalsy();
      expect(TurtlesList.isSelected(1)).toBeFalsy();
      expect(TurtlesList.isSelected(2)).toBeFalsy();

      TurtlesList.select(1);
      expect(TurtlesList.getSelectedTurtle()).toBeTruthy();
      expect($rootScope.selectedTurtle).toEqual(1);

      TurtlesList.select(2);
      expect(TurtlesList.getSelectedTurtle()).toBeFalsy();
      expect($rootScope.selectedTurtle).toBeNull();

      TurtlesList.select(t);
      expect(TurtlesList.getSelectedTurtle()).toBeTruthy();
      expect($rootScope.selectedTurtle).toEqual(1);
      expect(TurtlesList.isSelected(t)).toBeTruthy();
      expect(TurtlesList.isSelected(1)).toBeTruthy();
      expect(TurtlesList.isSelected(2)).toBeFalsy();
    });
  });

  describe("EntitiesList", function() {
    var EntitiesList, $rootScope;

    var fixtureList = {
      "Entity1": {
        type: "Player",
        username: "Steve",
        position: { x: 1, y: 2, z: 3 }
      },
      "Entity2": {
        type: "Cow",
        position: { x: 4, y: 5, z: 6 }
      },
      "Entity3": {
        type: "Zombie",
        position: { x: 7, y: 8, z: 9 }
      }
    };

    beforeEach(angular.mock.inject(function(_EntitiesList_, _Turtle_, _$rootScope_) {
      EntitiesList = _EntitiesList_;
      $rootScope = _$rootScope_;
    }));

    it("should be initialized", function() {
      expect($rootScope.selectedEntity).toBeNull();
      expect(EntitiesList.get()).toBeFalsy();
    });

    it("should be updated", function() {
      expect(EntitiesList.get()).toBeFalsy();
      EntitiesList.update(fixtureList);

      expect(EntitiesList.get()).toEqual(fixtureList);
    });

    it("should select", function() {
      expect($rootScope.selectedEntity).toBeNull();
      EntitiesList.update(fixtureList);

      EntitiesList.select("Entity1");
      expect($rootScope.selectedEntity).toEqual("Entity1");
      expect(EntitiesList.isSelected("Entity1")).toBe(true);
      expect(EntitiesList.getSelectedEntity()).toEqual(fixtureList["Entity1"])

      EntitiesList.select("UnknownEntity");
      expect($rootScope.selectedEntity).toBeNull();
      expect(EntitiesList.isSelected("Entity1")).toBe(false);
      expect(EntitiesList.getSelectedEntity()).toBeNull();
    });
  });
});