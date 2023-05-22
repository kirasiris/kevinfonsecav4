"use client";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const MongoDBCompilerPage = ({ searchParams }) => {
	const [editorData, setEditorData] = useState({
		ddl: `CREATE TABLE table(postID int NOT NULL AUTO_INCREMENT, title varchar(999), PRIMARY KEY(postID));
INSERT INTO table
   ('postID', 'title')
VALUES
   (1, 'My first blog, YAY!!'),
   (2, 'My second blog, YAY!');
`,
		dml: `SELECT * FROM table WHERE postID = 1;`,
	});

	const { ddl, dml } = editorData;

	const handleChange = (name) => (e) => {
		e.preventDefault();
		setEditorData({ ...editorData, [name]: e.target.value });
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-6">
					<h2>DDL</h2>
					<CodeMirror
						id={`ddl`}
						name={`ddl`}
						value={ddl}
						height="200px"
						theme={vscodeDark}
						extensions={[sql()]}
						onChange={(value) => {
							setEditorData({
								...editorData,
								ddl: value,
							});
						}}
					/>
				</div>
				<div className="col-lg-6">
					<h2>DML</h2>
					<CodeMirror
						id={`dml`}
						name={`dml`}
						value={dml}
						height="200px"
						theme={vscodeDark}
						extensions={[sql()]}
						onChange={(value) => {
							setEditorData({
								...editorData,
								dml: value,
							});
						}}
						readOnly={ddl.length > 0 ? !true : !false}
					/>
				</div>
			</div>
		</div>
	);
};

export default MongoDBCompilerPage;
