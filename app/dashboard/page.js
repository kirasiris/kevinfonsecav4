"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
// import { redirect } from "next/navigation";
// import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import { AuthContext } from "@/helpers/globalContext";
// HERE GOES THE LIST OF WHATEVER

const DashboardIndex = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);

	console.log("Hola from dashbopard page main", auth);
	// async function getAuthenticatedUser() {
	// 	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	// 	return res.json();
	// }

	// const auth = await getAuthenticatedUser();

	// // Redirect if user is not loggedIn
	// (auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
	// 	redirect(`/auth/login?returnpage=/dashboard`);

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
