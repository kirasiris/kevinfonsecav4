import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateLessonForm from "@/forms/nfabusiness/courses/updatelesson";

async function getLesson(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateLesson = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const lesson = await getLesson(`/${awtdParams.id}`);

	return <UpdateLessonForm token={token} auth={auth} object={lesson} />;
};

export default UpdateLesson;
