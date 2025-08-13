"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NFAMenu = () => {
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
				<li
					className={`list-group-item ${isActive(
						`/nfabusiness/acquisitionsdisposals`
					)}`}
				>
					<Link href={"/nfabusiness/acquisitionsdisposals"}>
						Acquisition and Disposals
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/nfabusiness/reviews`)}`}>
					<Link href={"/nfabusiness/reviews"}>Service Reviews</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/nfabusiness/serviceemails`
					)}`}
				>
					<Link href={"/nfabusiness/serviceemails"}>Service Requests</Link>
				</li>
				<li className={`list-group-item ${isActive(`/nfabusiness/weapons`)}`}>
					<Link href={"/nfabusiness/weapons"}>Weapons</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/nfabusiness/weaponaccessories`
					)}`}
				>
					<Link href={"/nfabusiness/weaponaccessories"}>
						Weapons Accessories
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default NFAMenu;
