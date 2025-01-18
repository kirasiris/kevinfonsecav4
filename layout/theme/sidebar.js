"use client";
import Image from "next/image";
import Globalsidebar from "../sidebar";

const Sidebar = ({ object = {} }) => {
	return (
		<Globalsidebar sidebarClasses={`col-lg-4`}>
			<figure className="mb-4">
				<Image
					className="img-fluid"
					src={
						object?.data?.files?.avatar?.location?.secure_location ||
						`https://source.unsplash.com/random/1200x900`
					}
					alt={`${object?.data?.avatar?.location?.fileName}'s featured image`}
					width={1200}
					height={900}
					priority
				/>
			</figure>
		</Globalsidebar>
	);
};

export default Sidebar;
