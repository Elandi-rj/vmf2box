"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
function recurse(node, indent) {
    if (indent === void 0) { indent = ''; }
    return node.body
        .map(function (node) {
        switch (node.type) {
            case 'Object':
                return ("".concat(indent).concat(node.name, "\n") +
                    "".concat(indent, "{\n") +
                    "".concat(recurse(node, '    ' + indent), "\n") +
                    "".concat(indent, "}"));
            case 'Property':
                return "".concat(indent, "\"").concat(node.name, "\" \"").concat(node.value, "\"");
        }
    })
        .join('\n');
}
function generate(ast) {
    return recurse(ast);
}
exports.generate = generate;
