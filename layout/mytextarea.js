"use client";
const MyTextArea = ({
	name = "",
	id = "",
	objectData,
	setObjectData,
	value = "",
	handleChangeValue = "",
}) => {
	const handleChange = (name) => (e) => {
		const inputText = e.target.value;
		const regex = /(@\w+)|(#\w+)/g;
		const newText = inputText.replace(regex, (match) => {
			if (match.startsWith("@")) {
				return `<a href="/users/${match.substring(1)}">${match}</a>`;
			} else if (match.startsWith("#")) {
				return `<a href="/hashtags/${match.substring(1)}">${match}</a>`;
			}
		});
		setObjectData({ ...objectData, [name]: inputText });
	};
	return (
		<>
			<textarea
				name={name}
				className="form-control"
				id={`multipurpose-textarea ${id}`}
				// onKeyUp="previewUrls()"
				placeholder="Share something new. Now with #hashtags support, YAY!!!"
				value={value}
				onChange={handleChange(handleChangeValue)}
			/>
			{/* <div id="preview-urls" className="text-center d-none"></div> */}
		</>
	);
};

export default MyTextArea;
