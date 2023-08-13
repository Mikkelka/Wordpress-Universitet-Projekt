import { InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';


registerBlockType('fictional-blocks/slideshow', {
    title: 'Slideshow',
    supports: {
        // full width
        align: ['full'],
    },
    attributes: {
        align: {
            type: 'string',
            default: 'full',
        }
    },
    edit: EditComponent,
    save: SaveComponent,
});


function SaveComponent() {
    return <InnerBlocks.Content />
}


function EditComponent() {
    return (
        <div style={{ backgroundColor: "#333", padding: "35px" }}>
            <p style={{
                textAlign: "center", fontSize: "20px", color: "#fff"
            }} > Slideshow </p>
            < InnerBlocks allowedBlocks={["fictional-blocks/slide"]} />
        </div>
    )
}