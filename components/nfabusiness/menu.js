"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNFAMenu = () => {
	const pathname = usePathname();

	const isActive = (path = "") => {
		return pathname === path ? " active" : "";
	};

	return (
		<div className="col-lg-1 mb-3">
			<ul className="list-group">
				<li className={`list-group-item ${isActive(`/nfabusiness`)}`}>
					<Link href={"/nfabusiness"}>Dashboard</Link>
				</li>
			</ul>
		</div>
	);
};

export default AdminNFAMenu;
