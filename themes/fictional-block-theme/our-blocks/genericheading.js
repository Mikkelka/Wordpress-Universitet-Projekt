import { registerBlockType } from '@wordpress/blocks';
import { BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

// Register a new block type with the name 'fictional-blocks/genericheading'
registerBlockType('fictional-blocks/genericheading', {
    // Block title
    title: 'Generic Heading',
    // Block attributes
    attributes: {
        // Text attribute of type string
        text: {
            type: 'string',
        },
        // Size attribute of type string with a default value of 'large'
        size: {
            type: 'string',
            default: 'large',
        },
    },

    // Edit component for the block
    edit: EditComponent,
    // Save component for the block
    save: SaveComponent,
});

// Edit component for the block
function EditComponent(props) {

    // Function to handle text change
    function handleTextChange(newValue) {
        // Set the 'text' attribute value to the new text
        props.setAttributes({ text: newValue });
    }

    return (
        <>
            {/* Block controls */}
            <BlockControls>
                <ToolbarGroup>
                    {/* Toolbar button for large size */}
                    <ToolbarButton isPressed={props.attributes.size === 'large'} onClick={() => props.setAttributes({ size: 'large' })} > Large </ToolbarButton>
                    {/* Toolbar button for medium size */}
                    <ToolbarButton isPressed={props.attributes.size === 'Medium'} onClick={() => props.setAttributes({ size: 'medium' })} > Medium </ToolbarButton>
                    {/* Toolbar button for small size */}
                    <ToolbarButton isPressed={props.attributes.size === 'Small'} onClick={() => props.setAttributes({ size: 'small' })} > Small </ToolbarButton>
                </ToolbarGroup>
            </BlockControls>
            {/* RichText component to edit the heading */}
            <RichText allowedFormats={["core/bold", "core/italic"]} tagName="h1" className={`headline headline--${props.attributes.size}`} value={props.attributes.text} onChange={handleTextChange} />
        </>
    );
};

// Save component for the block
function SaveComponent(props) {

    // Function to create the appropriate HTML tag name based on the size attribute
    function createTagName() {
        switch (props.attributes.size) {
            case 'large':
                return 'h1';
            case 'medium':
                return 'h2';
            case 'small':
                return 'h3';
        }
    }

    // Render the saved block content using the appropriate HTML tag and class name
    return <RichText.Content tagName={createTagName()} value={props.attributes.text} className={`headline headline--${props.attributes.size}`} />

}
