"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
		try {
			const res = await new Promise((resolve, reject) => {
				const formData = new FormData();
				formData.append("userId", auth?.userId);
				formData.append("username", auth?.username);
				formData.append("userEmail", auth?.email);
				formData.append("onModel", onModel);
				formData.append("file", file);
				formData.append("album", "posts");

				const xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", (event) => {
					if (event.lengthComputable) {
						setUploadPercentage(Math.round((event.loaded * 100) / event.total));
						setTimeout(() => setUploadPercentage(0), 10000);
					}
				});

				xhr.addEventListener("load", () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						const parsed = JSON.parse(xhr.responseText);
						resolve(parsed);
					} else {
						reject(
							new Error(
								`Upload failed with status ${xhr.status}: ${xhr.statusText}`,
							),
						);
					}
				});

				xhr.addEventListener("error", () =>
					reject(new Error("Network error during upload")),
				);
				xhr.addEventListener("abort", () =>
					reject(new Error("Upload aborted")),
				);
				xhr.addEventListener("timeout", () =>
					reject(new Error("Upload timed out")),
				);

				xhr.open(
					"PUT",
					`${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/uploads/uploadobject`,
				);
				xhr.setRequestHeader("Authorization", `Bearer ${token?.value}`);

				xhr.send(formData);
			});
			return res?.data?.location.secure_location;
		} catch (err) {
			toast.error(
				err?.message || "Something went wrong during upload",
				"bottom",
			);
		} finally {
			toast.success("Files uploaded", "bottom");
		}
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
			className="form-control mb-3"
			required={isRequired}
			placeholder={customPlaceholder}
			rows="5"
		/>
	);
};

export default MyTextArea;
