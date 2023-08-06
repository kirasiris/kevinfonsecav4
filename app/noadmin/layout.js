import "../global.css";
import "../admin.css";
import "../app.css";
import AdminSidebar from "@/layout/admin/sidebar";

export default function AdminLayout({ children }) {
	return (
		<div className="container-fluid">
			<div className="row">
				<AdminSidebar />
				<div className="col-lg-9">{children}</div>
			</div>
		</div>
	);
}
