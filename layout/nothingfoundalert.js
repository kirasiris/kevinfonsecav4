"use client";

const NothingFoundAlert = ({
	classList = "alert-dark",
	text = "Nothing found",
}) => {
	return <div className={`alert ${classList}`}>{text}</div>;
};

export default NothingFoundAlert;
