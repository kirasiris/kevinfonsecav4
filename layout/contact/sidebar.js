"use client";
import Map from "@/components/global/map";
import Globalsidebar from "../sidebar";
import Image from "next/image";

const Sidebar = ({ address = {} }) => {
	return (
		<Globalsidebar>
			<Image
				src={`https://i0.wp.com/befreebucket-for-outputs.s3.amazonaws.com/2021/10/KevinFonseca_Logo.png`}
				width={150}
				height={40}
				alt="beFree's Logo"
			/>
			<Map object={address} />
			<p>{address.location.formattedAddress}</p>
		</Globalsidebar>
	);
};

export default Sidebar;
