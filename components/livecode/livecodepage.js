"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const LiveCodePage = () => {
	const CodeEditor = ({
		id = "",
		name = "",
		value,
		onChange,
		mode,
		theme,
		extensions,
	}) => {
		return (
			<CodeMirror
				id={id}
				name={name}
				value={value}
				height="200px"
				theme={vscodeDark}
				extensions={[loadLanguage(mode)]}
				onChange={onChange}
			/>
		);
	};

	const [editorData, setEditorData] = useState({
		html: ``,
		css: ``,
		javascript: ``,
	});

	const { html, css, javascript } = editorData;

	const handleChange = useCallback(
		(name) => (e) => {
			setEditorData({ ...editorData, [name]: e });
		},
		[editorData]
	);

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-4">
					<h2>HTML</h2>
					<CodeEditor
						id="html"
						name="html"
						value={html}
						onChange={handleChange("html")}
						mode={`html`}
						theme={`material`}
					/>
				</div>
				<div className="col-lg-4">
					<h2>CSS</h2>
					<CodeEditor
						id="css"
						name="css"
						value={css}
						onChange={handleChange("css")}
						mode={`css`}
						theme={`material`}
					/>
				</div>
				<div className="col-lg-4">
					<h2>JavaScript</h2>
					<CodeEditor
						id="javascript"
						name="javascript"
						value={javascript}
						onChange={handleChange("javascript")}
						mode={`javascript`}
						theme={`material`}
					/>
				</div>
			</div>
			<div
				className="preview"
				dangerouslySetInnerHTML={{
					__html: `<style>${css}</style>${html}<script>${javascript}</script>`,
				}}
			/>
		</div>
	);
};

export default LiveCodePage;
