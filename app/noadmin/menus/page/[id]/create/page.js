import CreatePageForm from "@/forms/noadmin/menus/createpageform";

const CreatePage = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	return <CreatePageForm params={awtdParams} />;
};

export default CreatePage;
