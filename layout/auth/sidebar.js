"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Globalsidebar from "../sidebar";

const Sidebar = () => {
	const pathname = usePathname();
	const isActive = (path = "") => {
		return pathname === path ? " active" : "";
	};
	return (
		<Globalsidebar>
			<ul className="list-group">
				<li className={`list-group-item ${isActive(`/auth/profile`)}`}>
					<Link href={`/auth/profile`}>Profile</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editbasics`)}`}>
					<Link href={`/auth/editbasics`}>Basics</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editavatar`)}`}>
					<Link href={`/auth/editavatar`}>Avatar&nbsp;&&nbsp;Cover</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editabout`)}`}>
					<Link href={`/auth/editabout`}>About</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/auth/edittwofactorauthentication`
					)}`}
				>
					<Link href={`/auth/edittwofactorauthentication`}>2FA</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editpassword`)}`}>
					<Link href={`/auth/editpassword`}>Password</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/stripe`)}`}>
					<Link href={`/auth/stripe`}>Stripe Settings</Link>
				</li>
				<li
					className={`list-group-item list-group-item-danger ${isActive(
						`/auth/deleteaccount`
					)}`}
				>
					<Link href={`/auth/deleteaccount`}>Delete&nbsp;Account</Link>
				</li>
			</ul>
		</Globalsidebar>
	);
};

export default Sidebar;
