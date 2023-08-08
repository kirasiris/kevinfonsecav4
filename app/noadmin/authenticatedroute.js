import AuthContext from "@/helpers/globalContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const AuthenticatedRoute = ({ children }) => {
	const { auth } = useContext(AuthContext);
	console.log(auth);
	const router = useRouter();
	// if (auth.isAuthenticated === false) {
	// 	return router.push("/auth/login");
	// } else {
	// 	return children;
	// }

	return children;
};

export default AuthenticatedRoute;
