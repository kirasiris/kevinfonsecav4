"use client";
import { useRef, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import he from "he"; // Import the 'he' library
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

const LiveCode = ({
	object = {},
	title = "Untitled",
	MyHtml = "<h1>Title</h1>",
	MyCss = "body {}",
	MyJs = "console.log('This example contains external urls from Bootstrap!');",
	hasId = false,
	positionFixed = true,
	isFull = false,
}) => {
	const [objectData, setObjectData] = useState({
		html: MyHtml,
		css: MyCss,
		csslinks: [
			"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
		],
		js: MyJs,
		jslinks: [
			"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
		],
	});
	const iframeRef = useRef(null);

	const csslinksarray = objectData.csslinks
		.map(
			(link, index) =>
				`<link key=${index} rel="stylesheet" href="${link}" media="all" crossOrigin="anonymous" />`
		)
		.join("");

	const jslinksarray = objectData.jslinks
		.map((link, index) => `<script key=${index} src="${link}" async></script>`)
		.join("");

	useEffect(() => {
		const iframeDocument =
			iframeRef.current.contentDocument ||
			iframeRef.current.contentWindow.document;
		iframeDocument.open();
		iframeDocument.write(`
        <!DOCTYPE html>
        <html>
            <head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>${title}</title>
				${csslinksarray}
				<style>${he.decode(objectData.css)}</style>
				<script>window.console = window.console || function(t) {};</script>
			</head>
            <body>
				${he.decode(objectData.html)}
				${jslinksarray}
				<script id="rendered-js">
                	${he.decode(objectData.js)}
            	</script>
			</body>
            </html>
        `);
		iframeDocument.close();
	}, [objectData.html, objectData.css, objectData.js]);

	return (
		<>
			{!isFull && (
				<div className="row">
					<div className="col-lg-4">
						<div className="card resizable-card">
							<div className="card-header">
								<div className="float-start">HTML</div>
							</div>
							<div className="card-body p-0">
								<CodeMirror
									id="html"
									// name="html"
									value={he.decode(objectData.html)}
									height="200px"
									theme={vscodeDark}
									extensions={[html()]}
									onChange={(value) => {
										setObjectData({ ...objectData, html: value });
									}}
								/>
								<input
									type="hidden"
									name="html"
									defaultValue={objectData.html}
								/>
							</div>
						</div>
					</div>
					<div className="col-lg-4">
						<div className="card resizable-card">
							<div className="card-header">
								<div className="float-start">CSS</div>
							</div>
							<div className="card-body p-0">
								<CodeMirror
									id="css"
									// name="css"
									value={he.decode(objectData.css)}
									height="200px"
									theme={vscodeDark}
									extensions={[css()]}
									onChange={(value) => {
										setObjectData({ ...objectData, css: value });
									}}
								/>
								<input type="hidden" name="css" defaultValue={objectData.css} />
							</div>
						</div>
					</div>
					<div className="col-lg-4">
						<div className="card resizable-card">
							<div className="card-header">
								<div className="float-start">JavaScript</div>
							</div>
							<div className="card-body p-0">
								<CodeMirror
									id="js"
									// name="js"
									value={he.decode(objectData.js)}
									height="200px"
									theme={vscodeDark}
									extensions={[javascript({ jsx: true })]}
									onChange={(value) => {
										setObjectData({ ...objectData, js: value });
									}}
								/>
								<input type="hidden" name="js" defaultValue={objectData.js} />
							</div>
						</div>
					</div>
				</div>
			)}
			<iframe
				ref={iframeRef}
				title={objectData.title}
				className="code-previewer"
				id="code-previewer"
				allowtransparency="true"
				allowpaymentrequest="true"
				allowFullScreen={true}
				loading="lazy"
			/>
			{hasId && (
				<div
					className={`code-previewer-footer${
						positionFixed ? " position-fixed" : ""
					}`}
				>
					<div className="btn-group">
						<a
							href={`/snippet/full/${object._id}/${object.slug}`}
							className="btn btn-link btn-sm"
							target="_blank"
							rel="noreferrer noopener"
						>
							<FaExternalLinkAlt />
						</a>
					</div>
				</div>
			)}
		</>
	);
};

export default LiveCode;
