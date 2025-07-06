import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import QuestionList from "@/components/noadmin/polls/questionlist";

async function getPoll(params) {
	const res = await fetchurl(`/global/polls${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getQuestions(params) {
	const res = await fetchurl(`/global/questions${params}`, "GET", "no-cache");
	return res;
}

const ReadPoll = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const poll = await getPoll(`/${awtdParams.id}`);
	const questions = await getQuestions(
		`?resourceId=${poll?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/questions/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/polls/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/questions/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/polls/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/questions/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/polls/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/questions/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/polls/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/questions/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/polls/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/questions/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/polls/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/questions/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/polls/read/${awtdParams.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-12">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{poll?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={poll?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<QuestionList
						allLink={`/noadmin/polls/read/${poll?.data?._id}`}
						pageText="Questions"
						addLink={`/noadmin/polls/question/${poll?.data?._id}/create`}
						searchOn={`/noadmin/polls/read/${poll?.data?._id}`}
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
		</div>
	);
};

export default ReadPoll;
