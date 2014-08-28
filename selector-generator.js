var SPECIFIERS = [
    // Tag Name
    function(el, selector) {
        return el.tagName.toLowerCase();
    },
    // Classes
    function(el, selector) {
        var classes = el.className.trim().replace(/\s+/g, '.');

        return selector + (classes.length ? '.' + classes : '');
    },
    // Nth-Child
    function(el, selector) {
        var index = Array.prototype.slice.call(el.parentNode.children).indexOf(el) + 1;

        return selector + ':nth-child(' + index + ')';
    }
];

/**
 * Generates increasingly specific CSS selectors for a given element
 *
 * @class   SelectorGenerator
 * @param   {HTMLElement}   element
 * @param   {HTMLElement}   context
 * @constructor
 */
module.exports = function* SelectorGenerator(element, context) {
    var specificity = 0,
        selector    = '';

    context = context || document;

    while(element.parentElement && (element !== context)) {
        // Build the top-level selector for this depth and specificity
        var item = SPECIFIERS.slice(0, specificity + 1).reduce(function(memo, fn) {
                return fn(element, memo);
            }, ''),
            tail = selector.length ? ' > ' + selector : '';

        // Increment specificity
        specificity = (++specificity % SPECIFIERS.length);

        // Ascend the DOM
        if(specificity === 0) {
            element  = element.parentElement;
            selector = item + tail;
        }

        // Yield
        yield item + tail;
    }
}