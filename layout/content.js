"use client";

const Globalcontent = ({ children, containerClasses = `col-lg-8` }) => {
	return <div className={`${containerClasses}`}>{children}</div>;
};

export default Globalcontent;
