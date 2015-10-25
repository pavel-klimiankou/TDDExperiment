var expect = require("expect");

describe("filePathParser", function () {
    var parser = require("../src/filePathParser.js");

    it("should tell when a string is represents valid file path", function () {
        expect(parser.isFilePath("main.js")).toBe(true);
        expect(parser.isFilePath("index.html")).toBe(true);
        expect(parser.isFilePath("theme.css")).toBe(true);
        expect(parser.isFilePath("/main.js")).toBe(true);
        expect(parser.isFilePath("/index.html")).toBe(true);
        expect(parser.isFilePath("/theme.css")).toBe(true);
        expect(parser.isFilePath("appRoot/main.js")).toBe(true);
        expect(parser.isFilePath("appRoot/index.html")).toBe(true);
        expect(parser.isFilePath("/appRoot/theme.css")).toBe(true);
        expect(parser.isFilePath("appRoot/firstFolder/secondFolder/config.json")).toBe(true);
        expect(parser.isFilePath("appRoot/jquery/jq-2.3.4.js")).toBe(true);
    });

    it("should tell when a string is not a file path", function () {
        expect(parser.isFilePath("main")).toBe(false);
        expect(parser.isFilePath("/index")).toBe(false);
        expect(parser.isFilePath("/index/theme")).toBe(false);
        expect(parser.isFilePath("alpha beta")).toBe(false);
    });

});
