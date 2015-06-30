var Checker = require('../../../lib/checker');
var expect = require('chai').expect;

describe.skip('rules/require-spread', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
        checker.configure({ esnext: true, requireSpread: true });
    });

    it('should report use of apply when the first param === the object of the member expression', function() {
        expect(checker.checkString('g.apply(g, arguments);'))
            .to.have.one.error.from('ruleName');
    });

    it('should not report the use apply with only 1 argument', function() {
        expect(checker.checkString('g.apply(arguments);')).to.have.no.errors();
    });

    it('should not report the use of spread', function() {
        expect(checker.checkString('g(...args);')).to.have.no.errors();
    });
});
