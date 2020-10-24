const fs = require("fs");
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
  });

  describe("stageFile", () => {
    let tmp = "tmpfile";
    it("should add a specified file to staged files", async () => {
      // create temp file
      await utils.execShellCommand(`touch ${tmp}`);
      // ensure temp file is not yet staged
      let stagedFiles = await utils.getStagedFiles();
      expect(stagedFiles).not.toContain(tmp);
      // stage temp file
      await utils.stageFile(tmp);
      // ensure temp file is now staged
      stagedFiles = await utils.getStagedFiles();
      expect(stagedFiles).toContain(tmp);
      // remove temp file
      await utils.execShellCommand(`rm ${tmp}`);
      await utils.stageFile(tmp);
      // ensure temp file no longer exists and is no longer staged
      stagedFiles = await utils.getStagedFiles();
      expect(stagedFiles).not.toContain(tmp);
    });
  });

  describe("createTmpDir", () => {
    let tmp = "tmpDir";
    it("should create a specified directory", async () => {
      // ensure temp directory doesn't exist initially
      let dirExists = fs.existsSync(tmp);
      expect(dirExists).toBe(false);
      // create temp directory
      await utils.createTmpDir(tmp);
      // ensure temp directory exists
      dirExists = fs.existsSync(tmp);
      expect(dirExists).toBe(true);
      // remove temp directory
      await utils.execShellCommand(`rm -r ${tmp}`);
      // ensure temp directory doesn't exists anymore
      dirExists = fs.existsSync(tmp);
      expect(dirExists).toBe(false);
    });
  });

  describe("loadJson and storeJson", () => {
    let tmpPath = "tmp.json";
    let tmpObj = { "key": "value" }

    it("should properly load and store json files", async () => {
      // store, then load json
      await utils.storeJson(tmpPath, tmpObj);
      let tmpJson = await utils.loadJson(tmpPath);
      // ensure loaded object equals original object
      expect(tmpJson).toEqual(tmpObj);
      // clean up json
      await utils.execShellCommand(`rm ${tmpPath}`);
    });
  });

  describe("deleteFile", () => {
    let tmp = "tmpFile";
    it("should delete files", async () => {
      // create temp file
      await utils.execShellCommand(`touch ${tmp}`);
      // ensure temp file exists
      let fileExists = fs.existsSync(tmp);
      expect(fileExists).toBeTruthy();
      // delete file
      await utils.deleteFile(tmp);
      // ensure file doesn't exist
      fileExists = fs.existsSync(tmp);
      expect(fileExists).toBeFalsy();
    });
  });

});