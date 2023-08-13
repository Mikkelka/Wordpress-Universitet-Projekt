// this is want we see in the editor
wp.blocks.registerBlockType('fictional-blocks/eventsandblogs', {
    title: 'Events and Blogs',

    edit: function () {
        return wp.element.createElement(
            // create a div element
            'div', { className: 'our-placeholder-block' }, "Events and Blogs placeholder"
        );
    },
    save: function () {
        return null;
    },
});
