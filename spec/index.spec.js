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
    // TODO: fix error throwing on this
    // it("throws an error when passed an invalid command", async () => {
    //   let error;
    //   try {
    //     await utils.execShellCommand("invalidcommand");
    //   } catch(e) {
    //     error = e;
    //   }
    //   // expect(error).not.toBeNull();
    // });
  });
});