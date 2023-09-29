"use client";
import axios from "axios";
import FroalaEditorComponent from "react-froala-wysiwyg";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";
import AuthContext from "@/helpers/globalContext";
import { useContext } from "react";

const MyTextArea = ({
	id = "",
	name = "",
	value = "",
	objectData,
	setObjectData = () => {},
	onModel = "Blog",
	advancedTextEditor = true,
}) => {
	const { auth } = useContext(AuthContext);

	return advancedTextEditor ? (
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
				imageAllowedTypes: ["jpeg", "jpg", "png"],
				videoAllowedTypes: ["webm", "jpg", "ogg", "mp4"],
				events: {
					"image.beforeUpload": async (images) => {
						console.log("Auth from image.beforeUpload event", auth);
						const data = new FormData();
						data.append("userId", auth?.user?._id);
						data.append("username", auth?.user?.username);
						data.append("userEmail", auth?.user?.email);
						data.append("onModel", onModel);
						data.append("file", images[0]);
						await axios.put(
							`http://localhost:5000/api/v1/uploads/uploadObject`,
							data,
							{
								headers: {
									accept: "application/json",
									Authorization: `Bearer ${auth.token}`,
									"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
								},
							}
						);
					},
					"image.uploaded": function (response) {
						// Image was uploaded to the server.
						console.log("Image was uploaded to server", response);
					},
					"image.inserted": function ($img, response) {
						// Image was inserted in the editor.
					},
					"image.replaced": function ($img, response) {
						// Image was replaced in the editor.
					},
					"image.error": function (error, response) {
						if (error.code == 1) {
							console.log("Bad link.");
						} else if (error.code == 2) {
							console.log("No link in upload response.");
						} else if (error.code == 3) {
							console.log("Error during image upload.");
						} else if (error.code == 4) {
							console.log("Parsing response failed.");
						} else if (error.code == 5) {
							console.log("Image too text-large.");
						} else if (error.code == 6) {
							console.log("Invalid image type.");
						} else if (error.code == 7) {
							console.log(
								"Image can be uploaded only to same domain in IE 8 and IE 9."
							);
						}
						// Response contains the original server response to the request if available.
					},
					"video.beforeUpload": async (videos) => {
						console.log("Auth from video.beforeUpload event", auth);
						const data = new FormData();
						data.append("userId", auth?.user?._id);
						data.append("username", auth?.user?.username);
						data.append("userEmail", auth?.user?.email);
						data.append("onModel", onModel);
						data.append("file", videos[0]);
						await axios.put(
							`http://localhost:5000/api/v1/uploads/uploadObject`,
							data,
							{
								headers: {
									accept: "application/json",
									Authorization: `Bearer ${auth.token}`,
									"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
								},
							}
						);
						// Return false if you want to stop the video upload.
					},
					"video.uploaded": function (response) {
						// Video was uploaded to the server.
					},
					"video.inserted": function ($img, response) {
						// Video was inserted in the editor.
					},
					"video.replaced": function ($img, response) {
						// Video was replaced in the editor.
					},
					"video.error": function (error, response) {
						if (error.code == 1) {
							console.log("Bad link.");
						} else if (error.code == 2) {
							console.log("No link in upload response.");
						} else if (error.code == 3) {
							console.log("Error during video upload.");
						} else if (error.code == 4) {
							console.log("Parsing response failed.");
						} else if (error.code == 5) {
							console.log("Video too text-large.");
						} else if (error.code == 6) {
							console.log("Invalid video type.");
						} else if (error.code == 7) {
							console.log(
								"Video can be uploaded only to same domain in IE 8 and IE 9."
							);
						}
						// Response contains the original server response to the request if available.
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
						buttonsVisible: 9,
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
	) : (
		<textarea
			id={id}
			name={name}
			onChange={(e) => {
				setObjectData({ ...objectData, text: e.target.value });
			}}
			className="form-control"
		>
			{value}
		</textarea>
	);
};

export default MyTextArea;
