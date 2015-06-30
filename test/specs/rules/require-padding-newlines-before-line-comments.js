var Checker = require('../../../lib/checker');
var expect = require('chai').expect;

describe.skip('rules/require-padding-newlines-before-line-comments', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    describe.skip('invalid options', function() {
        it('should throw if false', function() {
            assert.throws(function() {
                checker.configure({ requirePaddingNewLinesBeforeLineComments: false });
            });
        });

        it('should throw if array', function() {
            assert.throws(function() {
                checker.configure({ requirePaddingNewLinesBeforeLineComments: [] });
            });
        });

        it('should throw if empty object', function() {
            assert.throws(function() {
                checker.configure({ requirePaddingNewLinesBeforeLineComments: {} });
            });
        });

        it('should throw if not allExcept object', function() {
            assert.throws(function() {
                checker.configure({ requirePaddingNewLinesBeforeLineComments: { allBut: false} });
            });
        });

        it('should throw if not allExcept firstAfterCurly', function() {
            assert.throws(function() {
                checker.configure({ requirePaddingNewLinesBeforeLineComments: { allExcept: 'badOptionName'} });
            });
        });
    });

    describe.skip('value true', function() {
        beforeEach(function() {
            checker.configure({ requirePaddingNewLinesBeforeLineComments: true });
        });

        it('should report missing padding before line comment', function() {
            expect(checker.checkString('var a = 2;\n// comment'))
            .to.have.one.error.from('ruleName');
        });

        it('should report line comment after block comment', function() {
            expect(checker.checkString('var a = 2;\n/* comment */\n// comment'))
            .to.have.one.error.from('ruleName');
        });

        it('should not report multiple line comments', function() {
            expect(checker.checkString('// comment\n//foo')).to.have.no.errors();
        });

        it('should report one error if multiple comments dont have line space', function() {
            expect(checker.checkString('var a = 2;\n// comment\n// comment'))
            .to.have.one.error.from('ruleName');
        });

        it('should not report missing padding if comment is first line', function() {
            expect(checker.checkString('// comment\nvar a = 2;')).to.have.no.errors();
        });

        it('should not report padding before line comment', function() {
            expect(checker.checkString('var a = 2;\n\n// comment')).to.have.no.errors();
        });

        it('should not report additional padding before line comment', function() {
            expect(checker.checkString('var a = 2;\n\n\n// comment')).to.have.no.errors();
        });

        it('should not report missing padding with block comment', function() {
            expect(checker.checkString('var a = 2;\n/* comment */')).to.have.no.errors();
        });

        it('should not report line comment after block comment with padding', function() {
            expect(checker.checkString('var a = 2;\n/* comment */\n\n// comment')).to.have.no.errors();
        });

        it('should report error if first line after a curly', function() {
            expect(checker.checkString('if (true) {\n// comment\n}'))
            .to.have.one.error.from('ruleName');
        });

        it('should not consider code and comment on the same line (#1194)', function() {
            expect(checker.checkString('var a; \n var b; //comment\n')).to.have.no.errors();
            expect(checker.checkString('var a; \n var b; //comment\nvar c;')).to.have.no.errors();
            expect(checker.checkString('/**/var a; \n var b// comment\n')).to.have.no.errors();
        });
    });

    describe.skip('value allExcept: firstAfterCurly', function() {
        beforeEach(function() {
            checker.configure({
                requirePaddingNewLinesBeforeLineComments: {
                    allExcept: 'firstAfterCurly'
                }
            });
        });

        it('should not report error if first line after a curly', function() {
            expect(checker.checkString('if (true) {\n// comment\n}')).to.have.no.errors();
            expect(checker.checkString('var a = {\n// comment\n};')).to.have.no.errors();
        });
    });
});
