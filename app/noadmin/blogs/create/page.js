import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateBlogForm from "@/forms/noadmin/blogs/createblogform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateBlog = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const categories = await getCategories(`?categoryType=blog`);

	return <CreateBlogForm token={token} auth={auth} objects={categories} />;
};

export default CreateBlog;
