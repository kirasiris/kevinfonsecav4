import Header from "@/layout/header";
import Head from "@/app/head";
import RestfulPage from "@/components/restful/restfulpage";

const RestfulIndex = async ({ searchParams }) => {
	return (
		<>
			<Head
				title="RESTFUL Tester"
				description="Test your API endpoints for free!"
			/>
			<Header
				title="RESTFUL Tester"
				description="Test your API endpoints for free!"
			/>
			<RestfulPage searchParams={searchParams} />
		</>
	);
};

export default RestfulIndex;
