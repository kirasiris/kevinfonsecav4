"use client";
import Image from "next/image";
import Map from "@/components/global/map";
import Globalsidebar from "../sidebar";

const Sidebar = ({ object = {} }) => {
	return (
		<Globalsidebar>
			<Image
				src={object?.data?.logo?.location?.secure_location}
				width={150}
				height={40}
				alt={`${object?.data?.title}'s logo`}
			/>
			<div className="card">
				<div className="card-header">Address</div>
				<div className="card-body">
					<Map object={object?.data} />
				</div>
				<div className="card-footer px-1">
					<p className="m-0">{object?.data?.address}</p>
				</div>
			</div>
		</Globalsidebar>
	);
};

export default Sidebar;
