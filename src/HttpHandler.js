exports.HttpHandler = function (canHandleImp, getContentImp) {
    return {
        canHandle: canHandleImp,
        getContent: getContentImp
    };
};
