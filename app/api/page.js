import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

const APIIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	return (
		<>
			<Header
				title="Become a Developer"
				description="No more worrying about having unneccessary data in your DB when you can use mine!"
			/>
			<List
				// featured={featured}
				// objects={blogs}
				searchParams={searchParams}
			/>
			Hola
		</>
	);
};

export default APIIndex;
