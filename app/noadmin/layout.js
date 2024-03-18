"use client";
import "react-calendar/dist/Calendar.css";
import "../global.css";
import "../admin.css";
import "../app.css";
import AdminMenu from "@/components/admin/adminmenu";
import { AuthProvider } from "@/helpers/globalContext";

export default function AdminLayout({ children }) {
	return (
		<AuthProvider>
			<div className="container-fluid my-4">
				<div className="row">
					<AdminMenu />
					<div className="col-lg-11">{children}</div>
				</div>
			</div>
		</AuthProvider>
	);
}
