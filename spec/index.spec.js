const utils = require("../lib/utils");

describe("utilities", () => {
  describe("errorHandler", () => {
    it("throws an error when passed an error", () => {
      expect(() => {
        utils.errorHandler(new Error("Example Error"))
      }).toThrowError("Example Error");
    });
  });

  describe("execShellCommand", () => {
    it("can run a simple bash command", async () => {
      let result = await utils.execShellCommand(`echo "Hello world"`);
      expect(result).toBe("Hello world\n");
    });
    it("rejects if passed an invalid command", async () => {
      await expectAsync(utils.execShellCommand("invalidcommand"))
        .toBeRejected();
    })
  });

  describe("getStagedFiles", () => {
    it("should return an array", async () => {
      let result = await utils.getStagedFiles();
      expect(result.length).not.toBeNull();
    });
  })
});