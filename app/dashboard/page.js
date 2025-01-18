import Header from "@/layout/header";

const DashboardIndex = async ({ params, searchParams }) => {
	return (
		<>
			<Header
				title={`Welcome back!`}
				description="This is the place where you have full overview of everything you have done in the website!"
			/>
		</>
	);
};

export default DashboardIndex;
