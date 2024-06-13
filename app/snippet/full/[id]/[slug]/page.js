import { Suspense } from "react";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import LiveCode from "@/components/admin/snippets/livecode";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getSnippet(params) {
	const res = await fetchurl(`/snippets${params}`, "GET", "no-cache");
	return res;
}

const SnippetRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getSnippetsData = getSnippet(`/${params.id}`);

	const [snippet] = await Promise.all([getSnippetsData]);

	return (
		<Suspense fallback={<Loading />}>
			{snippet.data.status === "published" ||
			searchParams.isAdmin === "true" ? (
				<LiveCode
					object={snippet?.data}
					title={snippet?.data?.title}
					MyHtml={snippet?.data?.code?.html}
					MyCss={snippet?.data?.code?.css}
					MyJs={snippet?.data?.code?.javascript}
					hasId={false}
					positionFixed={false}
					isFull={true}
				/>
			) : (
				<p>Not visible</p>
			)}
		</Suspense>
	);
};

export default SnippetRead;
