const MyTextArea = ({ name = "", id = "", value = "", handleChange }) => {
	return (
		<>
			<textarea
				name={name}
				className="form-control"
				id={`multipurpose-textarea ${id}`}
				onKeyUp="previewUrls()"
				placeholder="Share something new. Now with #hashtags support, YAY!!!"
				value={value}
				onChange={handleChange}
			/>
			<div id="preview-urls" className="text-center d-none"></div>
		</>
	);
};

export default MyTextArea;
