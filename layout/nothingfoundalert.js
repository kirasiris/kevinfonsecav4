"use client";

const NothingFoundAlert = ({
	loading = false,
	classNames = "alert-dark",
	text = "Nothing found",
}) => {
	return <div className={`alert ${classNames}`}>{text}</div>;
};

export default NothingFoundAlert;
