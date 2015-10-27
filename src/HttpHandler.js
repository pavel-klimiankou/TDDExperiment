exports.HttpHandler = function (canHandleImp, getContentImp) {
    this.canHandle = canHandleImp;
    this.getContent = getContentImp;
};
