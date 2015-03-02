var DOMUtils          = require('dom-utils'),
    SelectorUtils     = require('./selector-utils'),
    SelectorGenerator = require('./selector-generator');

/**
 * An interface for generating selectors for a set of elements.
 *
 * @class   Selector
 * @param   {HTMLElement|Array|NodeList|String}    includes    One or more HTMLElements or a CSS selector
 * @constructor
 */
module.exports = function Selector(elements) {
    this.elements = DOMUtils.toElementArray(elements);
    this.ancestor = DOMUtils.getCommonAncestor(elements);

    this.generate = function() {
        if(this.elements.length === 1) {
            return SelectorUtils.bestFit(this.elements[0]);
        }

        var ancestorSelector = this.ancestor ? SelectorUtils.bestFit(this.ancestor) : '',
            remaining = this.elements,
            selectors = [],
            filtered  = false,
            generator,
            selector;

        // Generate branch selectors
        while(remaining.length) {
            filtered  = false,
            generator = SelectorGenerator(remaining[0], this.ancestor);

            while(!filtered && (selector = generator.next().value)) {
                filtered = SelectorUtils.filter(selector, remaining, this.ancestor);
            }

            selectors.push(selector);
            remaining = filtered;
        }

        return selectors
            .map(function(selector) {
                return SelectorUtils.makeTbodyOptional(ancestorSelector + ' ' + selector);
            })
            .join(", \n")
            .trim();
    }
}