"use client";
import "react-calendar/dist/Calendar.css";
import "@/src/css/admin.css";
import AdminMenu from "@/layout/dashboard/sidebar";
import { AuthProvider } from "@/helpers/globalContext";

const AdminLayout = ({ children }) => {
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
};

export default AdminLayout;
