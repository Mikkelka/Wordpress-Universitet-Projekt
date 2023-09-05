import { ToolbarGroup, ToolbarButton, FontSizePicker } from "@wordpress/components"
import { RichText, BlockControls, AlignmentToolbar, InspectorControls, PanelBody } from "@wordpress/block-editor"
import { registerBlockType } from "@wordpress/blocks"

registerBlockType("ourblocktheme/generictext", {
  title: "Generic Text",
  attributes: {
    text: { type: "string" },
    size: { type: "string", default: "small" },
    alignment: { type: "string", default: "center" },
    fontSize: { type: "number" }
  },

  edit: EditComponent,
  save: SaveComponent
})

function EditComponent(props) {

  function handleTextChange(newText) {
    props.setAttributes({ text: newText })
  }

  const alignmentClass = `mka--align-${props.attributes.alignment}`;

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton isPressed={props.attributes.size === "large"} onClick={() => props.setAttributes({ size: "large" })}>
            Large
          </ToolbarButton>
          <ToolbarButton isPressed={props.attributes.size === "medium"} onClick={() => props.setAttributes({ size: "medium" })}>
            Medium
          </ToolbarButton>
          <ToolbarButton isPressed={props.attributes.size === "small"} onClick={() => props.setAttributes({ size: "small" })}>
            Small
          </ToolbarButton>

        </ToolbarGroup>

        <AlignmentToolbar
          value={props.attributes.alignment}
          onChange={value => props.setAttributes({ alignment: value })}
        />
      </BlockControls>


      <InspectorControls>
        <FontSizePicker
          label="Font Size"
          fontSizes={[
            { name: 'Small', size: 16 },
            { name: 'Medium', size: 24 },
            { name: 'Large', size: 32 }
          ]}
          value={props.attributes.fontSize}
          onChange={fontSize => props.setAttributes({ fontSize })}
          allowReset
        />


      </InspectorControls>

      {/* Tekst felt */}
      <RichText allowedFormats={["core/bold", "core/italic"]} tagName="P" style={{ fontSize: `${props.attributes.fontSize}px` }} className={`headline headline--${props.attributes.size} ${alignmentClass} `} value={props.attributes.text} onChange={handleTextChange} />
    </>
  )
}

function SaveComponent(props) {
  // function createTagName() {
  //   switch (props.attributes.size) {
  //     case "large":
  //       return "h1"
  //     case "medium":
  //       return "h2"
  //     case "small":
  //       return "h3"
  //   }
  // }


  const alignmentClass = `mka--align-${props.attributes.alignment}`;

  return <RichText.Content tagName="P" value={props.attributes.text} className={`headline headline--${props.attributes.size} ${alignmentClass}`} />
}
