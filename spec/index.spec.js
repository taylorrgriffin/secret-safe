const funcs = require("../index");

describe("core functions", () => {
  describe("pushSecretToExistingObj", () => {
    it("returns a string that contains the secret", () => {
      const secret =
        "I'm a little secret, short and stout, here is my handle, here is my spout!";
      const newJson = funcs.pushSecretToExistingObj(
        '{"secrets":[{"id":1239843344,"msg":"ABCDEF"}]}',
        secret
      );
      expect(newJson.includes("Tip me over and pour me out!")).toBe(false);
      expect(newJson.includes(secret)).toBe(true);
    });
  });
});
