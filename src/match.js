Pact.Match = Pact.Match || {};

(function() {
    this.term = function(term) {
        if (!term ||
            typeof term.generate === 'undefined' ||
            typeof term.matcher === 'undefined') {
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

    this.eachLike = function(content, options) {
        if(typeof content === 'undefined') {
            throw new Error('Error creating a Pact eachLike. Please provide a content argument');
        }

        if(options && !options.min) {
            throw new Error('Error creating a Pact eachLike. Please provide options.min that is > 1');
        }
        
        return {
            'json_class': 'Pact::ArrayLike',
            'contents': content,
            'min': (!options) ? 1 : options.min
        };
    } ;

    this.somethingLike = function(value) {
        if (typeof value === 'undefined' ||
            typeof value === 'function') {
            throw new Error('Error creating a Pact somethingLike Match. Value cannot be a function or undefined');
        }

        return {
            'json_class': 'Pact::SomethingLike',
            'contents' : value
        };
    };

}).apply(Pact.Match);