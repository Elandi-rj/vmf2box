"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addProp(obj, key, value) {
    var currentValue = obj[key];
    if (typeof currentValue !== 'undefined') {
        if (Array.isArray(currentValue)) {
            currentValue.push(value);
        }
        else {
            obj[key] = [currentValue, value];
        }
    }
    else {
        obj[key] = value;
    }
}
function reduce(obj, prop) {
    if (prop.type === 'Property') {
        addProp(obj, prop.name, prop.value);
    }
    if (prop.type === 'Object') {
        addProp(obj, prop.name, prop.body.reduce(reduce, {}));
    }
    return obj;
}
function transformer(ast) {
    return ast.body.reduce(reduce, {});
}
exports.default = transformer;
