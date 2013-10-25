describe("chai-jq", function () {
  describe("setup", function () {
    it("patches native chai", function () {
      expect(chai).to.be.ok;
    });
  });
});
