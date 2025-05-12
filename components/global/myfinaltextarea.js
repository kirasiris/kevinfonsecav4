"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import he from "he";
import { Editor } from "@tinymce/tinymce-react";
import { Nav, Tab } from "react-bootstrap";

const MyTextArea = ({
	auth = {},
	token = {},
	id = "",
	name = "",
	defaultValue = "",
	onModel = "Blog",
	advancedTextEditor = true,
	customPlaceholder = "Share something new. Now with #hashtags support, YAY!!!",
	charactersLimit = 99999,
	isRequired = false,
}) => {
	// Never delete these lines below
	const sizeLimit = charactersLimit ?? 99999;
	const [html, setHtml] = useState(he.decode(defaultValue ?? ""));
	const [length, setLength] = useState(0);

	useEffect(() => {
		setHtml(html ?? "");
	}, [html]);

	const uploadFile = async (file) => {
		console.log("Auth from image.beforeUpload event", auth);
		const data = new FormData();
		data.append("userId", auth?.userId);
		data.append("username", auth?.username);
		data.append("userEmail", auth?.email);
		data.append("onModel", onModel);
		data.append("file", file);
		const res = await axios.put(
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

		return res?.data?.data.location.secure_location;
	};

	// Never delete these lines above
	const handleInit = (evt, editor) => {
		setLength(editor.getContent({ format: "text" }).length);
	};

	const handleUpdate = (value, editor) => {
		const length = editor.getContent({ format: "text" }).length;
		if (length <= sizeLimit) {
			setHtml(value);
			setLength(length);
		}
	};

	const handleBeforeAddUndo = (evt, editor) => {
		const length = editor.getContent({ format: "text" }).length;
		// note that this is the opposite test as in handleUpdate
		// because we are determining when to deny adding an undo level
		if (length > sizeLimit) {
			evt.preventDefault();
		}
	};

	return advancedTextEditor ? (
		<Tab.Container defaultActiveKey="htmlcontent">
			<Nav variant="pills" className="nav-justified mb-3">
				<Nav.Item>
					<Nav.Link eventKey="htmlcontent">HTML</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="jsoncontent">JSON Content</Nav.Link>
				</Nav.Item>
			</Nav>
			<Tab.Content>
				<Tab.Pane eventKey="htmlcontent">
					<input
						id={`hidden-${id}`}
						name={name}
						defaultValue={html}
						type="hidden"
					/>
					<div className="dcs">
						<Editor
							apiKey={process.env.NEXT_PUBLIC_TINYMCE_TOKEN}
							initialValue={defaultValue}
							value={html}
							onInit={handleInit}
							onEditorChange={handleUpdate}
							onBeforeAddUndo={handleBeforeAddUndo}
							init={{
								skin: "bootstrap",
								icons: "bootstrap",
								plugins: [
									// Core editing features
									"anchor",
									"autolink",
									"charmap",
									"codesample",
									"emoticons",
									"image",
									"link",
									"lists",
									"media",
									"searchreplace",
									"table",
									"visualblocks",
									"wordcount",
									// Your account includes a free trial of TinyMCE premium features
									// Try the most popular premium features until Mar 16, 2025:
									// "checklist",
									// "mediaembed",
									// "casechange",
									// "export",
									// "formatpainter",
									// "pageembed",
									// "a11ychecker",
									// "tinymcespellchecker",
									// "permanentpen",
									// "powerpaste",
									// "advtable",
									// "advcode",
									// "editimage",
									// "advtemplate",
									// "mentions",
									// "tinycomments",
									// "tableofcontents",
									// "footnotes",
									// "mergetags",
									// "autocorrect",
									// "typography",
									// "inlinecss",
									// "markdown",
									// "importword",
									// "exportword",
									// "exportpdf",
								],
								toolbar:
									"undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
								tinycomments_mode: "embedded",
								tinycomments_author: "Author name",
								setup: (editor) => {
									editor.on("init", () => {
										editor.getContainer().style.transition =
											"border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
									});
									editor.on("focus", () => {
										editor.getContainer().style.boxShadow =
											"0 0 0 .2rem rgba(0, 123, 255, .25)";
										editor.getContainer().style.borderColor = "#80bdff";
									});
									editor.on("blur", () => {
										editor.getContainer().style.boxShadow = "";
										editor.getContainer().style.borderColor = "";
									});
									editor.on("keydown", (e) => {
										//TURN ENTERY KEY INTO <br>**
										if (e.which == "13" || e.keyCode == "13") {
											editor.insertContent("<br> ");
											e.preventDefault();
										}
									});
								},
							}}
						/>
					</div>
					<p>Remaining: {sizeLimit - length}</p>
				</Tab.Pane>
				<Tab.Pane eventKey="jsoncontent">
					<pre>{JSON.stringify({ html }, null, 4)}</pre>
				</Tab.Pane>
			</Tab.Content>
		</Tab.Container>
	) : (
		<textarea
			id={id}
			name={name}
			defaultValue={defaultValue}
			// type
			className="form-control mb-3"
			required={isRequired}
			// placeholder=""
			rows="5"
		/>
	);
};

export default MyTextArea;
