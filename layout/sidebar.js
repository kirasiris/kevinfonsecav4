"use client";

const Globalsidebar = ({
	children,
	sidebarClasses = `col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block`,
}) => {
	return <div className={`${sidebarClasses}`}>{children}</div>;
};

export default Globalsidebar;
