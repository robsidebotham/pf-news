exports.formatDates = list => {
    return list.map(elemObj => {
        let rtrObj = {};
        Object.assign(rtrObj, elemObj);
        rtrObj.created_at = new Date(elemObj.created_at);
        return rtrObj;
    });
};

exports.makeRefObj = list => {
    let refObj = {};
    list.forEach(obj => {
        let newKey = obj.title;
        let newValue = obj.article_id;
        refObj[newKey] = newValue;
    });
    return refObj;
};

exports.formatComments = (comments, articleRef) => {
    return comments.map(elemObj => {
        let rtrObj = {};
        Object.assign(rtrObj, elemObj);
        rtrObj["author"] = elemObj.created_by;
        rtrObj["article_id"] = articleRef[elemObj.belongs_to];
        delete rtrObj.created_by;
        delete rtrObj.belongs_to;
        rtrObj.created_at = new Date(elemObj.created_at);
        return rtrObj;
    });
};
