var assert = require('assert');

var Checker = require('../../../lib/checker');
var reportAndFix = require('../../lib/assertHelpers').reportAndFix;

describe('rules/disallow-quoted-keys-in-objects', function() {
    var checker;

    var config = { disallowQuotedKeysInObjects: true };

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    describe('with true', function() {
        beforeEach(function() {
            checker.configure(config);
        });

        it('should report if key is valid without quotes', function() {
            assert(checker.checkString('var x = { "a": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "A": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "_abc": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "_a1": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "_abc_": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "a_a": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "12": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "$1": 1 }').getErrorCount() === 1);
            assert(checker.checkString('var x = { "a$b": 1 }').getErrorCount() === 1);
        });

        it('should not report for keys without quotes', function() {
            assert(checker.checkString('var x = { a: 1 }').isEmpty());
            assert(checker.checkString('var x = { B: 1 }').isEmpty());
            assert(checker.checkString('var x = { _a: 1 }').isEmpty());
            assert(checker.checkString('var x = { _abc_: 1 }').isEmpty());
            assert(checker.checkString('var x = { _a1: 1 }').isEmpty());
            assert(checker.checkString('var x = { a_a: 1 }').isEmpty());
            assert(checker.checkString('var x = { 12: 1 }').isEmpty());
            assert(checker.checkString('var x = { $: 1 }').isEmpty());
            assert(checker.checkString('var x = { 0: 1 }').isEmpty());
        });

        it('should not report if key is invalid without quotes', function() {
            assert(checker.checkString('var x = { "": 1 }').isEmpty());
            assert(checker.checkString('var x = { "a 1": 1 }').isEmpty());
            assert(checker.checkString('var x = { "a  a": 1 }').isEmpty());
            assert(checker.checkString('var x = { "a-a": 1 }').isEmpty());
            assert(checker.checkString('var x = { "a+a": 1 }').isEmpty());
            assert(checker.checkString('var x = { ".": 1 }').isEmpty());
            assert(checker.checkString('var x = { "a..a": 1 }').isEmpty());
            assert(checker.checkString('var x = { "a/a": 1 }').isEmpty());
            assert(checker.checkString('var x = { "1a": 1 }').isEmpty());
            assert(checker.checkString('var x = { "1$": 1 }').isEmpty());
            assert(checker.checkString('var x = { "010": 1 }').isEmpty());
        });

        it('should check all keys in object', function() {
            assert(checker.checkString('var x = { "a": 1, b: 2, "3": 3 }').getErrorCount() === 2);
        });
    });

    describe('with allExcept: ["reserved"]', function() {
        beforeEach(function() {
            checker.configure({ disallowQuotedKeysInObjects: { allExcept: ['reserved'] } });
        });

        it('should not report if reserved words', function() {
            assert(checker.checkString('var x = { "default": 1, "class": "foo" }').isEmpty());
            assert(checker.checkString('var x = { "true": 1, "false": "foo" }').isEmpty());
        });

        it('does not report for "null"', function() {
            assert(checker.checkString('var x = { "null": 1, undefined: "foo" }').isEmpty());
        });

        it('should report non-reserved quoted keys. #1669', function() {
            assert(checker.checkString('var x = { "noReservedKeyword": 2 }').getErrorCount() === 1);
        });
    });

    describe('fix', function() {
        reportAndFix({
            name: 'var x = { "a": 1 }',
            rules: config,
            errors: 1,
            input: 'var x = { "a": 1 }',
            output: 'var x = { a: 1 }'
        });
    });
});
