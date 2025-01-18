import ErrorPage from "@/layout/errorpage";

const NotFound = async () => {
	return (
		<ErrorPage statusCode={404} statusCodeMessage="This page does not exists" />
	);
};

export default NotFound;
