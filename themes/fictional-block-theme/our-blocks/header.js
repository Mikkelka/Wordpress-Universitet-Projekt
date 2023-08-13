// this is want we see in the editor
wp.blocks.registerBlockType('fictional-blocks/header', {
    title: 'Our Header',

    edit: function () {
        return wp.element.createElement(
            // create a div element
            'div', { className: 'our-placeholder-block' }, "Header placeholder"
        );
    },
    save: function () {
        return null;
    },
});
