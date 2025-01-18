"use client";
import { useState } from "react";
import axios from "axios";
import Tribute from "tributejs";
import he from "he";
import FroalaEditorComponent from "react-froala-wysiwyg";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

const MyTextArea = ({
	auth = {},
	token = {},
	id = "",
	name = "",
	defaultValue = "",
	onModel = "Blog",
	advancedTextEditor = true,
	customPlaceholder = "Share something new. Now with #hashtags support, YAY!!!",
	insertClasses = true,
}) => {
	const [model, setModel] = useState(he.decode(defaultValue));
	const handleModelChange = (event) => {
		setModel(event);
	};
	const userSearch = (text, cb) => {
		var URL = `${process.env.apiUrl}/users`;
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var data = JSON.parse(xhr.responseText);
					cb(data.data);
				} else if (xhr.status === 403) {
					cb([]);
				}
			}
		};
		xhr.open("GET", URL + "?username=" + text, true);
		xhr.send();
	};

	const tributeJS = new Tribute({
		trigger: "@",
		containerClass: "tribute-container",
		values: (query, cb) => {
			userSearch(query, (users) => cb(users));
		},
		lookup: "username",
		fillAttr: "username",
		selectTemplate: (item) => {
			return `<a href="/profile/${item.original._id}/${item.original.username}?page=1&limit=50&sort=-createdAt" target="_blank" rel="noreferrer noopener" class="fr-deleteable fr-input-line fr-tribute">@${item.original.username}</a>`;
		},
		requireLeadingSpace: true,
		menuItemTemplate: (item) => {
			// return `<div><img src=${item.original.files.avatar.location.secure_location} />${item.original.username}</div>`;
			return `<div>${item.original.username}</div>`;
		},
	});

	const element = document.getElementById(`hidden-${id}`);
	if (element) {
		tributeJS.attach(element);
	} else {
		console.error(`Element with ID '${id}' not found.`);
	}

	return advancedTextEditor ? (
		<>
			<input id={`hidden-${id}`} name={name} type="hidden" />
			<div id={id} name={name} className="froala-editor-wrapper">
				<FroalaEditorComponent
					tag="textarea"
					tribute={tributeJS}
					model={model}
					onModelChange={handleModelChange}
					config={{
						// BELOW IS FOR EMAILS
						useClasses: insertClasses,
						htmlRemoveTags: ["script"],
						// ABOVE IS FOR EMAILS
						documentReady: false,
						placeholderText: customPlaceholder,
						imageUpload: true,
						imageDefaultAlign: "left",
						imageDefaultDisplay: "inline-block",
						imageAllowedTypes: ["jpeg", "jpg", "png"],
						videoAllowedTypes: ["webm", "jpg", "ogg", "mp4"],
						saveParams: {
							name: "text",
						},
						events: {
							keypress: function () {
								const hiddentextarea = document.getElementById(`hidden-${id}`);
								hiddentextarea.setAttribute("value", this.html.get());
							},
							// contentChanged: function () {
							// 	this.html.get();
							// },
							/*
							 *
							 * CUSTOM BUTTON EVENTS
							 *
							 */

							/*
							 *
							 * IMAGE EVENTS
							 *
							 */
							"image.beforeUpload": async (images) => {
								console.log("Auth from image.beforeUpload event", auth);
								const data = new FormData();
								data.append("userId", auth?.userId);
								data.append("username", auth?.username);
								data.append("userEmail", auth?.email);
								data.append("onModel", onModel);
								data.append("file", images[0]);
								await axios.put(
									`${process.env.NEXT_PUBLIC_API_URL}/uploads/uploadobject`,
									data,
									{
										headers: {
											accept: "application/json",
											Authorization: `Bearer ${token?.value}`,
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
							/*
							 *
							 * VIDEO EVENTS
							 *
							 */
							"video.beforeUpload": async (videos) => {
								console.log("Auth from video.beforeUpload event", auth);
								const data = new FormData();
								data.append("userId", auth?.userId);
								data.append("username", auth?.username);
								data.append("userEmail", auth?.email);
								data.append("onModel", onModel);
								data.append("file", videos[0]);
								await axios.put(
									`${process.env.NEXT_PUBLIC_API_URL}/uploads/uploadobject`,
									data,
									{
										headers: {
											accept: "application/json",
											Authorization: `Bearer ${token?.value}`,
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
									"markdown",
									"undo",
									"redo",
									"fullScreen",
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
							"codeView",
							"codeBeautifier",
							"charCounter",
							"print",
							"fullScreen",
							"markdown",
							"trackChanges",
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
							"spellChecker",
							"imageTUI",
						],
						fontFamily: {
							"Roboto,sans-serif": "Roboto",
							"Oswald,sans-serif": "Oswald",
							"Montserrat,sans-serif": "Montserrat",
							"'Open Sans Condensed',sans-serif": "Open Sans Condensed",
						},
						fontFamilySelection: true,
						codeBeautifierOptions: {
							end_with_newline: true,
							indent_inner_html: true,
							extra_liners:
								"['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'ol', 'table', 'dl']",
							brace_style: "expand",
							indent_char: "\t",
							indent_size: 1,
							wrap_line_length: 0,
						},
					}}
				/>
			</div>
		</>
	) : (
		<textarea
			id={id}
			name={name}
			className="form-control"
			rows="5"
			placeholder={customPlaceholder}
			defaultValue={defaultValue}
		/>
	);
};

export default MyTextArea;
