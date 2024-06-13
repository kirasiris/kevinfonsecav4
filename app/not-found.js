import { headers } from "next/headers";
import ErrorPage from "@/layout/errorpage";

const NotFound = async () => {
	const headersList = headers();

	console.log("Data", headersList);

	return (
		<ErrorPage statusCode={404} statusCodeMessage="This page does not exists" />
	);
};

export default NotFound;
