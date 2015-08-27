Pact.Match = Pact.Match || {};

(function() {
    this.term = function(term) {

        if (!term || typeof(term.generate) === 'undefined' || typeof(term.matcher) === 'undefined' ) {
            throw new Error('Error creating a Pact Term. Please provide an object containing \'generate\' and \'matcher\' properties');
        }

        return {
            'json_class': 'Pact::Term',
            'data': {
                'generate': term.generate,
                'matcher': {
                    'json_class': 'Regexp',
                    'o': 0,
                    's': term.matcher
                }
            }
        };
    };

    this.somethingLike = function(value) {

        if (typeof(value) === 'undefined' || typeof(value) === 'function') {
            throw new Error('Error creating a Pact SomethingLike Match. Value cannot be a function or undefined');
        }

        return {
            'json_class': 'Pact::SomethingLike',
            'contents' : value
        };
    };

}).apply(Pact.Match);