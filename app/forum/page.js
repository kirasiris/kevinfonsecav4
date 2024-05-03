import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

const ForumIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	return (
		<>
			<Header
				title="Welcome to my Forum"
				description="Learn everything about my programming and life journey"
			/>
			<List
				// featured={featured}
				// objects={blogs}
				searchParams={searchParams}
			/>
		</>
	);
};

export default ForumIndex;
