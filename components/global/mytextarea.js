"use client";
import { useContext } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";
// Import a single Froala Editor plugin.
import "froala-editor/js/plugins/image.min.js";
// import 'froala-editor/js/plugins/align.min.js';

// Import a language file.
// import 'froala-editor/js/languages/de.js';

// Import a third-party plugin.
// import 'froala-editor/js/third_party/image_tui.min.js';
// import 'froala-editor/js/third_party/embedly.min.js';
// import 'froala-editor/js/third_party/spell_checker.min.js';

// Include font-awesome css if required.
// install using "npm install font-awesome --save"
// import 'font-awesome/css/font-awesome.css';
// import 'froala-editor/js/third_party/font_awesome.min.js';

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';
import AuthContext from "@/helpers/globalContext";

const MyTextArea = ({
	id = "",
	name = "",
	value = "",
	objectData,
	setObjectData = () => {},
}) => {
	// const { auth } = useContext(AuthContext);
	// console.log("Textarea auth object", auth);
	return (
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
				imageUpload: true,
				imageDefaultAlign: "left",
				imageDefaultDisplay: "inline-block",
				// Set max image size to 5MB.
				imageMaxSize: 5 * 1024 * 1024,
				// Allow to upload PNG and JPG.
				imageAllowedTypes: ["jpeg", "jpg", "png"],
				events: {
					"froalaEditor.image.beforeUpload": function (e, editor, images) {
						// Before image is uploaded
						const data = new FormData();
						data.append("image", images[0]);

						axios
							.post(`https://locahost:5000/api/v1/uploads`, data, {
								headers: {
									accept: "application/json",
									Authorization: `Bearer ${auth.token}`,
									"Accept-Language": "en-US,en;q=0.8",
									"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
								},
							})
							.then((res) => {
								console.log("File uploaded at:", res);
								// editor.image.insert(
								// 	res.data.data.link,
								// 	null,
								// 	null,
								// 	editor.image.get()
								// );
							})
							.catch((err) => {
								console.log(err);
							});
						return false;
					},
				},
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
	);
};

export default MyTextArea;
