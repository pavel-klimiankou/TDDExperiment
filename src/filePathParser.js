exports.isFilePath = function (fileName) {
    var tester = /\/?[\S\/]+\.\w+/i;
    return fileName && tester.test(fileName) || false;
};
