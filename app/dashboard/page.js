"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
// import { redirect } from "next/navigation";
// import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import AuthContext from "@/helpers/globalContext";

const DashboardIndex = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	return (
		<>
			<Header
				title={`Welcome back, ${
					auth.loading ? "loading..." : auth.user.username
				}`}
				description="This is the place where you have full overview of everything you have done in the website!"
			/>
		</>
	);
};

export default DashboardIndex;
