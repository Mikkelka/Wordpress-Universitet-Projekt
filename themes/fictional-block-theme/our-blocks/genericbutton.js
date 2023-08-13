import { registerBlockType } from '@wordpress/blocks';
import { BlockControls, RichText, InspectorControls, getColorObjectByColorValue } from '@wordpress/block-editor';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Popover, Button, PanelBody, PanelRow, ColorPalette } from '@wordpress/components';
import { link } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import ourColors from '../inc/ourColors';

// Register a new block type with the name 'fictional-blocks/genericbutton'
registerBlockType('fictional-blocks/genericbutton', {
    // Block title
    title: 'Generic Button',
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
        linkObject: {
            type: 'object',
            default: { url: '' },
        },
        colorName: {
            type: 'string',
            default: 'blue',
        }
    },

    // Edit component for the block 
    edit: EditComponent,
    // Save component for the block
    save: SaveComponent,
});

// Edit component for the block
function EditComponent(props) {
    const [isLinkPressed, setIsLinkPressed] = useState(false);

    // Function to handle text change
    function handleTextChange(newValue) {
        // Set the 'text' attribute value to the new text
        props.setAttributes({ text: newValue });
    }

    function buttonHandler() {
        setIsLinkPressed(!isLinkPressed);
    }

    function handleLinkChange(newLink) {
        props.setAttributes({ linkObject: newLink });
    }

    const currentColorValue = ourColors.filter(color => {
        return color.name === props.attributes.colorName;
    })[0].color;


    function handleColorChange(colorCode) {
        // from the hex color code, get the name of the color
        const { name } = getColorObjectByColorValue(ourColors, colorCode);
        props.setAttributes({ colorName: name });
    }

    return (
        <>
            {/* Block controls */}
            <BlockControls>
                {/* ToolbarGroup for href */}
                <ToolbarGroup>
                    <ToolbarButton onClick={buttonHandler} icon={link} />
                </ToolbarGroup>

                {/* ToolbarGroup for size */}
                <ToolbarGroup>
                    {/* Toolbar button for large size */}
                    <ToolbarButton isPressed={props.attributes.size === 'large'} onClick={() => props.setAttributes({ size: 'large' })} > Large </ToolbarButton>
                    {/* Toolbar button for medium size */}
                    <ToolbarButton isPressed={props.attributes.size === 'Medium'} onClick={() => props.setAttributes({ size: 'medium' })} > Medium </ToolbarButton>
                    {/* Toolbar button for small size */}
                    <ToolbarButton isPressed={props.attributes.size === 'Small'} onClick={() => props.setAttributes({ size: 'small' })} > Small </ToolbarButton>
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title='Color' initialOpen={true}>
                    <PanelRow >
                        <ColorPalette disableCustomColors={true} clearable={false} value={currentColorValue} colors={ourColors} onChange={handleColorChange} />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>



            {/* RichText component to edit the heading */}
            <RichText allowedFormats={[]} tagName="a" className={`btn btn--${props.attributes.size} btn--${props.attributes.colorName}`} value={props.attributes.text} onChange={handleTextChange} />

            {isLinkPressed && (
                <Popover position="middle center" onFocusOutside={() => setIsLinkPressed(false)}>
                    <LinkControl settings={[]} value={props.attributes.linkObject} onChange={handleLinkChange} />
                    <Button variant='primary' onClick={() => setIsLinkPressed(false)} style={{ display: 'block', width: '100%' }} > Confirm Link </Button>
                </Popover>
            )}
        </>
    );
};

// Save component for the block
function SaveComponent(props) {
    // Render the saved block content using the appropriate HTML tag and class name
    return <a href={props.attributes.linkObject.url} className={`btn btn--${props.attributes.size} btn--${props.attributes.colorName}`}>
        {props.attributes.text}
    </a>;

}
