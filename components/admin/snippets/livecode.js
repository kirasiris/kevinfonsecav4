"use client";
import { useRef, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import he from "he"; // Import the 'he' library
import { FaExternalLinkAlt } from "react-icons/fa";
import SnippetSettingsModal from "./settingsmodal";

const LiveCode = ({
	object = {},
	objectData,
	setObjectData,
	hasId = false,
}) => {
	const iframeRef = useRef(null);

	const csslinksarray = objectData?.csslinks
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
				<title>${objectData.title}</title>
				${csslinksarray}
				<style>${he.decode(objectData.css)}</style>
			</head>
            <body>
				${he.decode(objectData.html)}
				${jslinksarray}
				<script>
                	${he.decode(objectData.js)}
            	</script>
			</body>
            </html>
        `);
		iframeDocument.close();
	}, [objectData.html, objectData.css, objectData.js]);

	return (
		<>
			<div className="row">
				<div className="col-lg-4">
					<div className="card resizable-card">
						<div className="card-header">
							<div className="float-start">HTML</div>
							<div className="float-end">
								<SnippetSettingsModal
									objectId={"html"}
									objectData={objectData}
									setObjectData={setObjectData}
								/>
							</div>
						</div>
						<div className="card-body p-0">
							<CodeMirror
								id="html"
								name="html"
								value={he.decode(objectData.html)}
								height="200px"
								theme={vscodeDark}
								extensions={[html()]}
								onChange={(value) => {
									setObjectData({ ...objectData, html: value });
								}}
							/>
						</div>
					</div>
				</div>
				<div className="col-lg-4">
					<div className="card resizable-card">
						<div className="card-header">
							<div className="float-start">CSS</div>
							<div className="float-end">
								<SnippetSettingsModal
									objectId={"css"}
									objectData={objectData}
									setObjectData={setObjectData}
								/>
							</div>
						</div>
						<div className="card-body p-0">
							<CodeMirror
								id="css"
								name="css"
								value={he.decode(objectData.css)}
								height="200px"
								theme={vscodeDark}
								extensions={[css()]}
								onChange={(value) => {
									setObjectData({ ...objectData, css: value });
								}}
							/>
						</div>
					</div>
				</div>
				<div className="col-lg-4">
					<div className="card resizable-card">
						<div className="card-header">
							<div className="float-start">JavaScript</div>
							<div className="float-end">
								<SnippetSettingsModal
									objectId={"js"}
									objectData={objectData}
									setObjectData={setObjectData}
								/>
							</div>
						</div>
						<div className="card-body p-0">
							<CodeMirror
								id="js"
								name="js"
								value={he.decode(objectData.js)}
								height="200px"
								theme={vscodeDark}
								extensions={[javascript({ jsx: true })]}
								onChange={(value) => {
									setObjectData({ ...objectData, js: value });
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<iframe
				ref={iframeRef}
				title={objectData.title}
				className="code-previewer"
				id="code-previewer"
				allowtransparency="true"
				allowpaymentrequest="true"
				allowfullscreen="true"
				loading="lazy"
			/>
			{hasId && (
				<div className="code-previewer-footer">
					<FaExternalLinkAlt />
				</div>
			)}
		</>
	);
};

export default LiveCode;