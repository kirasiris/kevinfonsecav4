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
					<Link href={`/auth/profile`} passHref legacyBehavior>
						<a>Profile</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editbasics`)}`}>
					<Link href={`/auth/editbasics`} passHref legacyBehavior>
						<a>Basics</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editavatar`)}`}>
					<Link href={`/auth/editavatar`} passHref legacyBehavior>
						<a>Avatar&nbsp;&&nbsp;Cover</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editabout`)}`}>
					<Link href={`/auth/editabout`} passHref legacyBehavior>
						<a>About</a>
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(`/auth/editnotifications`)}`}
				>
					<Link href={`/auth/editnotifications`} passHref legacyBehavior>
						<a>Notifications</a>
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/auth/editnotificationsemail`
					)}`}
				>
					<Link href={`/auth/editnotificationsemail`} passHref legacyBehavior>
						<a>Emails</a>
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/auth/edittwofactorauthentication`
					)}`}
				>
					<Link
						href={`/auth/edittwofactorauthentication`}
						passHref
						legacyBehavior
					>
						<a>2FA</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/editpasswords`)}`}>
					<Link href={`/auth/editpasswords`} passHref legacyBehavior>
						<a>Passwords</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/auth/stripe`)}`}>
					<Link href={`/auth/stripe`} passHref legacyBehavior>
						<a>Stripe Settings</a>
					</Link>
				</li>
				<li
					className={`list-group-item list-group-item-danger ${isActive(
						`/auth/deleteaccount`
					)}`}
				>
					<Link href={`/auth/deleteaccount`} passHref legacyBehavior>
						<a>Delete&nbsp;Account</a>
					</Link>
				</li>
			</ul>
		</Globalsidebar>
	);
};

export default Sidebar;
