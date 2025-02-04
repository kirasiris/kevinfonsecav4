"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import he from "he";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

const MyTextArea = ({
	auth = {},
	token = {},
	id = "",
	name = "",
	defaultValue = "",
	onModel = "Blog",
	advancedTextEditor = true,
	customPlaceholder = "Share something new. Now with #hashtags support, YAY!!!",
}) => {
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

	const editor = useCreateBlockNote({ uploadFile });

	const [html, setHtml] = useState(he.decode(defaultValue));

	// This is for creating html data
	const onChange = async () => {
		const blocks = await editor.blocksToFullHTML(editor.document);
		setHtml(blocks);
	};

	useEffect(() => {
		onChange();
	}, []);

	// This is for updating html data
	useEffect(() => {
		async function loadInitialHTML() {
			const blocks = await editor.tryParseHTMLToBlocks(html);
			editor.replaceBlocks(editor.document, blocks);
			setHtml(blocks);
		}
		loadInitialHTML();
	}, [editor]);

	return advancedTextEditor ? (
		<>
			<input
				id={`hidden-${id}`}
				name={name}
				defaultValue={html}
				type="hidden"
			/>
			<BlockNoteView editor={editor} onChange={onChange} />
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
