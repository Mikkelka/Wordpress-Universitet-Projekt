import apiFetch from '@wordpress/api-fetch';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, PanelBody, PanelRow } from '@wordpress/components';
import { registerBlockType } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

registerBlockType('fictional-blocks/banner', {
    title: "Banner",
    supports: {
        align: ["full"]
    },
    attributes: {
        align: { type: "string", default: "full" },
        imgID: { type: "number" },
        imgURL: { type: "string", default: banner.fallbackimage }
    },
    edit: EditComponent,
    save: SaveComponent
})

function EditComponent(props) {
    useEffect(
        function () {
            if (props.attributes.imgID) {
                async function go() {
                    const response = await apiFetch({
                        path: `/wp/v2/media/${props.attributes.imgID}`,
                        method: "GET"
                    })
                    props.setAttributes({ imgURL: response.media_details.sizes.pageBanner.source_url })
                }
                go()
            }
        },
        [props.attributes.imgID]
    )

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

            <div className="page-banner">
                <div className="page-banner__bg-image"
                    style={{ backgroundImage: `url(${props.attributes.imgURL})` }}>
                </div>
                <div className="page-banner__content container t-center c-white">
                    <InnerBlocks allowedBlocks={["fictional-blocks/genericheading", "fictional-blocks/genericbutton"]} />
                </div>
            </div>
        </>
    );
};


function SaveComponent() {
    return <InnerBlocks.Content />;
}