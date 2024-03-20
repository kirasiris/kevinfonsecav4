"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/helpers/globalContext";
import YouTubePage from "@/components/youtube/youtubepage";

const AdminYouTubeIndex = ({ searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	return <YouTubePage searchParams={searchParams} pushTo={false} />;
};

export default AdminYouTubeIndex;
