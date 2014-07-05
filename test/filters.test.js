describe("Filters", function() {
  var $filter;

  beforeEach(angular.mock.module("GRTVPlaysTurtle"));
  beforeEach(angular.mock.inject(function(_$filter_) {
    $filter = _$filter_;
  }));

  describe("formatDate", function() {
    it("should format date", function() {
      var d = new Date("Sat Jul 05 2014 13:37:00 GMT+0200");
      var out = $filter("formatDate")(d);
      expect(out).toEqual("13:37:00");
    });
  });

  describe("prettyJSON", function() {
    it("should format json", function() {
      var obj = {
        test: true
      };
      var out = $filter("prettyJSON")(obj);
      expect(out).toBeDefined();

      out = $filter("prettyJSON")();
      expect(out).toEqual("");

      out = $filter("prettyJSON")(obj, ["true"]).$$unwrapTrustedValue();
      expect(JSON.parse(out)).toEqual(obj);
    });
  });
});