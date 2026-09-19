"use client";
import Map from "@/components/global/map";
import Globalsidebar from "../sidebar";

const Sidebar = ({ object = {} }) => {
	return (
		<Globalsidebar>
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
