"use client";
import { AuthProvider } from "@/helpers/globalContext";
import "../global.css";
import "../admin.css";
import "../app.css";
import AdminMenu from "@/layout/admin/adminmenu";
import AuthenticatedRoute from "./authenticatedroute";

export default function AdminLayout({ children }) {
	return (
		<AuthProvider>
			<AuthenticatedRoute>
				<div className="container-fluid my-4">
					<div className="row">
						<AdminMenu />
						<div className="col-lg-11">{children}</div>
					</div>
				</div>
			</AuthenticatedRoute>
		</AuthProvider>
	);
}
