import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import QuestionList from "@/components/admin/quizzes/questionlist";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getQuiz(params) {
	const res = await fetchurl(`/quizzes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getQuestions(params) {
	const res = await fetchurl(`/questions${params}`, "GET", "no-cache");
	return res;
}

const ReadQuiz = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const quiz = await getQuiz(`/${awtdParams.id}`);
	const questions = await getQuestions(
		`?resourceId=${quiz?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/questions/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quizzes/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/questions/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quizzes/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/questions/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quizzes/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/questions/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quizzes/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/questions/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/quizzes/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/questions/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quizzes/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/questions/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/quizzes/read/${awtdParams.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-8">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{quiz?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={quiz?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<QuestionList
						allLink={`/noadmin/quizzes/read/${quiz?.data?._id}`}
						pageText="Questions"
						addLink={`/noadmin/quizzes/question/${quiz?.data?._id}/create`}
						searchOn={`/noadmin/quizzes/read/${quiz?.data?._id}`}
						objects={questions}
						searchParams={awtdSearchParams}
						handleDraft={draftIt}
						handlePublish={publishIt}
						handleTrash={trashIt}
						handleSchedule={scheduleIt}
						handleDelete={handleDelete}
						handleTrashAllFunction={handleTrashAll}
						handleDeleteAllFunction={handleDeleteAll}
					/>
				</div>
			</div>
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							quiz?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${quiz?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadQuiz;
