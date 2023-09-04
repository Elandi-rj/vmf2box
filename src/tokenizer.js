"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WHITESPACE = /\s/;
var NAME = /[a-z0-9_]/i;
function tokenizer(input) {
    var tokens = [];
    var current = 0;
    while (current < input.length) {
        var char = input[current];
        switch (true) {
            case char === '{' || char === '}':
                tokens.push({
                    type: 'bracket',
                    value: char,
                });
                current++;
                continue;
            case char === '"': {
                var value = '';
                char = input[++current];
                while (char !== '"') {
                    value += char;
                    char = input[++current];
                }
                tokens.push({
                    type: 'string',
                    value: value,
                });
                current++;
                continue;
            }
            case WHITESPACE.test(char):
                current++;
                continue;
            case NAME.test(char): {
                var value = '';
                while (NAME.test(char)) {
                    value += char;
                    char = input[++current];
                }
                tokens.push({
                    type: 'name',
                    value: value,
                });
                continue;
            }
            default:
                throw new TypeError("Unknown character: ".concat(char, " at position ").concat(current));
        }
    }
    return tokens;
}
exports.default = tokenizer;
