"use client";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";

const MyTextArea = ({
	id = "",
	name = "",
	value = "",
	objectData,
	setObjectData = () => {},
}) => {
	return (
		<>
			<FroalaEditorComponent
				tag="textarea"
				model={value}
				onModelChange={(e) => {
					setObjectData({
						...objectData,
						text: e,
					});
				}}
				config={{
					// documentReady: true,
					placeholderText:
						"Share something new. Now with #hashtags support, YAY!!!",
					toolbarButtons: {
						moreText: {
							buttons: [
								"bold",
								"italic",
								"underline",
								"strikeThrough",
								"subscript",
								"superscript",
								"fontFamily",
								"fontSize",
								"textColor",
								"backgroundColor",
								"inlineClass",
								"inlineStyle",
								"clearFormatting",
							],
						},
						moreParagraph: {
							buttons: [
								"alignLeft",
								"alignCenter",
								"formatOLSimple",
								"alignRight",
								"alignJustify",
								"formatOL",
								"formatUL",
								"paragraphFormat",
								"paragraphStyle",
								"lineHeight",
								"outdent",
								"indent",
								"quote",
							],
						},
						moreRich: {
							buttons: [
								"insertLink",
								"insertImage",
								"insertVideo",
								"insertTable",
								"emoticons",
								"fontAwesome",
								"specialCharacters",
								"embedly",
								"insertFile",
								"insertHR",
							],
						},
						moreMisc: {
							buttons: [
								"undo",
								"redo",
								"fullscreen",
								"print",
								"getPDF",
								"spellChecker",
								"selectAll",
								"html",
								"help",
							],
							align: "right",
							buttonsVisible: 2,
						},
					},
					pluginsEnabled: [
						"table",
						"spell",
						"quote",
						"save",
						"quickInsert",
						"paragraphFormat",
						"paragraphStyle",
						"help",
						"draggable",
						"align",
						"link",
						"lists",
						"file",
						"image",
						"emoticons",
						"url",
						"video",
						"embedly",
						"colors",
						"entities",
						"inlineClass",
						"inlineStyle",
						// 'codeBeautif '
						// 'spellChecker',
						"imageTUI",
					],
				}}
			/>
		</>
	);
};

export default MyTextArea;
