var DOMUtils          = require('dom-utils'),
    SelectorGenerator = require('./selector-generator');

module.exports = {
    /**
     * Subtract all elements matched by a selector from an existing set of elements.
     * Does not remove any elements if the selector also matches elements outside the provided set.
     *
     * @return  {Array|Null}
     */
    'filter' : function(selector, remaining, context) {
        var selected = DOMUtils.toElementArray((context || document).querySelectorAll(selector)),
            isSubset = selected.every(function(el) {
                return remaining.indexOf(el) !== -1;
            });

        if(isSubset) {
            return remaining.filter(function(el) {
                return selected.indexOf(el) === -1;
            });
        } else {
            return null;
        }
    },

    /**
     * Finds the most general selector for an element that selects only that element.
     *
     * @return  {String|Null}
     */
    'bestFit' : function(element, context) {
        context = document || context;

        var generator = SelectorGenerator(element, context),
            selector;

        while(selector = generator.next().value) {
            if(context.querySelectorAll(selector).length === 1) {
                return selector;
            }
        }

        return null;
    }
}
