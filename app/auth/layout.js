"use client";
import { AuthProvider } from "@/helpers/globalContext";
import "../global.css";
import "../app.css";

export default function AuthLayout({ children }) {
	return (
		<AuthProvider>
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-12">{children}</div>
				</div>
			</div>
		</AuthProvider>
	);
}
