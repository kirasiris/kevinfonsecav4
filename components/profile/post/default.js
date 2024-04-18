"use client";

const Default = ({ object = {} }) => {
	return (
		<div className={`card-body`}>{console.log("Default post", object)}</div>
	);
};

export default Default;
