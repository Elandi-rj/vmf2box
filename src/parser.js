"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parser(tokens) {
    var current = 0;
    function walk() {
        var token = tokens[current];
        switch (token.type) {
            case 'string': {
                var node = {
                    type: 'Property',
                    name: token.value,
                    value: '',
                };
                token = tokens[++current];
                node.value = token.value;
                current++;
                return node;
            }
            case 'name': {
                var node = {
                    type: 'Object',
                    name: token.value,
                    body: [],
                };
                token = tokens[(current += 2)];
                while (token.type !== 'bracket' ||
                    (token.type === 'bracket' && token.value !== '}')) {
                    node.body.push(walk());
                    token = tokens[current];
                }
                current++;
                return node;
            }
            default:
                throw new TypeError("Unknown token type: ".concat(token.type));
        }
    }
    var ast = {
        type: 'File',
        body: [],
    };
    while (current < tokens.length) {
        ast.body.push(walk());
    }
    return ast;
}
exports.default = parser;
