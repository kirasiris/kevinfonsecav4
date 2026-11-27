import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import QuestionList from "@/components/noadmin/quizzes/questionlist";

async function getQuiz(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getQuestions(params) {
	const res = await fetchurl(`/global/questions${params}`, "GET", "no-cache");
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
		`?resourceId=${quiz?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
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
							searchedKeyword=""
							objects={questions}
							searchParams={awtdSearchParams}
							statusFilter=""
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
		</div>
	);
};

export default ReadQuiz;
