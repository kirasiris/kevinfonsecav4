"use client";
import Link from "next/link";

const AdminSidebar = () => {
	return (
		<div className="col-lg-3">
			<div className="list-group">
				<Link href={"/noadmin/blogs"} passHref legacyBehavior>
					<a className="list-group-item list-group-item-action">Blog</a>
				</Link>
				<Link href={"/noadmin/themes"} passHref legacyBehavior>
					<a className="list-group-item list-group-item-action">Themes</a>
				</Link>
			</div>
		</div>
	);
};

export default AdminSidebar;
