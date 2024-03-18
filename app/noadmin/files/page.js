"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/helpers/globalContext";
import AdminMediaLibray from "@/components/admin/adminmedialibray";

const AdminFilesIndex = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();
	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	return <AdminMediaLibray />;
};

export default AdminFilesIndex;
