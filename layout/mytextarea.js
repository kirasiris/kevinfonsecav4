"use client";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";

const MyTextArea = ({
	name = "",
	id = "",
	objectData,
	setObjectData,
	value = "",
	handleChangeValue,
}) => {
	return (
		<>
			<FroalaEditorComponent
				tag="textarea"
				config={{
					placeholderText:
						"Share something new. Now with #hashtags support, YAY!!!",
				}}
				model={value}
				onModelChange={(newValue) =>
					setChangelogData({
						...changelogData,
						text: newValue,
					})
				}
			/>
			{/* <textarea
				name={name}
				className="form-control"
				id={`${id} multipurpose-textarea`}
				placeholder="Share something new. Now with #hashtags support, YAY!!!"
				value={value}
				onChange={handleChangeValue}
				rows="3"
			/> */}
			{/* <div id="preview-urls" className="text-center d-none"></div> */}
		</>
	);
};

export default MyTextArea;
