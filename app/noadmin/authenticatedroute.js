import AuthContext from "@/helpers/globalContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const AuthenticatedRoute = ({ children }) => {
	const { auth } = useContext(AuthContext);
	console.log("Authenticated route.js", auth);
	// const router = useRouter();
	// if (auth.isAuthenticated && auth.role) {
	// 	return children;
	// } else {
	// 	router.push("/auth/login");
	// 	return null;
	// }

	return children;
};

export default AuthenticatedRoute;
