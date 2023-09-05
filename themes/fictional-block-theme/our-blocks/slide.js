import apiFetch from '@wordpress/api-fetch';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, PanelBody, PanelRow } from '@wordpress/components';
import { registerBlockType } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

registerBlockType('fictional-blocks/slide', {
    title: 'Slide',
    supports: {
        // full width
        align: ['full'],
    },
    attributes: {
        align: {
            type: 'string',
            default: 'full',
        },
        imgID: {
            type: 'number',
        },
        imgURL: {
            type: 'string',
            default: banner.fallbackimage
        },
        themeimage: {
            type: 'string',
        }
    },
    edit: EditComponent,
    save: SaveComponent,
});

function EditComponent(props) {

    useEffect(function () {
        if (props.attributes.themeimage) {
            // console.warn(`${slide.themeimagepath}${props.attributes.themeimage}`);
            props.setAttributes({ imgURL: `${slide.themeimagepath}${props.attributes.themeimage}` })
        }
    }, []);

    useEffect(function () {
        // Define an asynchronous function called "go"
        if (props.attributes.imgID) {
            async function go() {
                // Await the response from the apiFetch function
                const response = await apiFetch({
                    // Specify the path to the media resource based on the value of props.attributes.imgID
                    path: `/wp/v2/media/${props.attributes.imgID}`,
                    // Specify the HTTP method as GET
                    method: 'GET',
                });

                // Update the attributes of props with the URL of the pageBanner size image from the response
                props.setAttributes({ themeimage: "", imgURL: response.media_details.sizes.pageBanner.source_url })
            }
            go();
        }

    }, [props.attributes.imgID]);

    // explane what this function does: https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
    function onFileSelect(x) {
        props.setAttributes({ imgID: x.id })
    }


    return (
        <>
            <InspectorControls>
                <PanelBody title='background' initialOpen={true} >
                    <PanelRow>
                        <MediaUploadCheck>
                            <MediaUpload onSelect={onFileSelect} value={props.attributes.imgID} render={({ open }) => {
                                return <Button onClick={open} >Upload</Button>
                            }} />
                        </MediaUploadCheck>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>


            <div className="hero-slider__slide"
                style={{ backgroundImage: `url(${props.attributes.imgURL})` }}>
                <div class="hero-slider__interior container">
                    <div class="hero-slider__overlay t-center">
                        <InnerBlocks allowedBlocks={["fictional-blocks/genericheading", "fictional-blocks/genericbutton"]} />
                    </div>
                </div>
            </div>
        </>
    );
};


function SaveComponent() {
    return <InnerBlocks.Content />;
}