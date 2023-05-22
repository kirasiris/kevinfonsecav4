"use client";
import React, { useRef, useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const LiveCodePage = ({ searchParams }) => {
	const [snippetsData, setSnippetsData] = useState({
		html: "<h1>Title</h1>",
		css: "body {}",
		js: "console.log('hello world!');",
	});

	const iframeRef = useRef(null);

	const jsString = snippetsData.js
		? `<script type="text/javascript">${snippetsData.js}</script>`
		: "";
	const cssString = snippetsData.css
		? `<style>${snippetsData.css}</style>`
		: "";
	const result = `<!DOCTYPE html><html><head>${cssString}</head><body>${snippetsData.html}</body>${jsString}</html>`;

	useEffect(() => {
		const blob = new Blob([result], { type: "text/html" });
		if (iframeRef.current) {
			iframeRef.current.src = URL.createObjectURL(blob);
		}
	}, [result]);

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-4">
					<h2>HTML</h2>
					<CodeMirror
						id="html"
						name="html"
						value={snippetsData.html}
						height="200px"
						theme={vscodeDark}
						extensions={[html()]}
						onChange={(value) => {
							setSnippetsData({ ...snippetsData, html: value });
						}}
					/>
				</div>
				<div className="col-lg-4">
					<h2>CSS</h2>
					<CodeMirror
						id="css"
						name="css"
						value={snippetsData.css}
						height="200px"
						theme={vscodeDark}
						extensions={[css()]}
						onChange={(value) => {
							setSnippetsData({ ...snippetsData, css: value });
						}}
					/>
				</div>
				<div className="col-lg-4">
					<h2>JavaScript</h2>
					<CodeMirror
						id="js"
						name="js"
						value={snippetsData.js}
						height="200px"
						theme={vscodeDark}
						extensions={[javascript({ jsx: true })]}
						onChange={(value) => {
							setSnippetsData({ ...snippetsData, js: value });
						}}
					/>
				</div>
			</div>
			<iframe
				ref={iframeRef}
				title="Test"
				className="preview"
				id="preview"
				style={{
					border: "1px solid #00cc00",
					width: "100%",
					marginTop: "20px",
					minHeight: "600px",
				}}
			/>
		</div>
	);
};

export default LiveCodePage;
