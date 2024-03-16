"use client";
import "react-calendar/dist/Calendar.css";
import "../global.css";
import "../admin.css";
import "../app.css";
import AdminMenu from "@/components/dashboard/adminmenu";

export default function AdminLayout({ children }) {
	return (
		<div className="container-fluid my-4">
			<div className="row">
				<AdminMenu />
				<div className="col-lg-11">{children}</div>
			</div>
		</div>
	);
}
