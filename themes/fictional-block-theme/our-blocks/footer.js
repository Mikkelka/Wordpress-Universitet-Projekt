// this is want we see in the editor
wp.blocks.registerBlockType('fictional-blocks/footer', {
    title: 'Our Footer',

    edit: function () {
        return wp.element.createElement(
            // create a div element
            'div', { className: 'our-placeholder-block' }, "Footer placeholder"
        );
    },
    save: function () {
        return null;
    },
});
