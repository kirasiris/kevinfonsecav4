import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateBlogForm from "@/forms/noadmin/blogs/updateblogform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getBlog(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "no-cache");
	return res;
}

const UpdateBlog = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const blog = await getBlog(`/${awtdParams.id}`);

	const categories = await getCategories(`?categoryType=blog`);

	return (
		<UpdateBlogForm
			token={token}
			auth={auth}
			object={blog}
			objects={categories}
		/>
	);
};

export default UpdateBlog;
