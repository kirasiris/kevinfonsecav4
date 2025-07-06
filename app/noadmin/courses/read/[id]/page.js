import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import LessonList from "@/components/noadmin/courses/lessonlist";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getCourse(params) {
	const res = await fetchurl(`/global/courses${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getLessons(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	return res;
}

const ReadCourse = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const course = await getCourse(`/${awtdParams.id}`);
	const lessons = await getLessons(
		`?resourceId=${course?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/courses/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/deleteall`, "PUT", "no-cache", {
			onModel: "Course",
		});
		revalidatePath(`/noadmin/courses/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/videos/deleteall/permanently`,
			"DELETE",
			"no-cache",
			{
				onModel: "Course",
			}
		);
		revalidatePath(`/noadmin/courses/read/${awtdParams.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-10">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{course?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={course?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<LessonList
						allLink={`/noadmin/courses/read/${course?.data?._id}`}
						pageText="Lessons"
						addLink={`/noadmin/courses/lesson/${course?.data?._id}/create`}
						searchOn={`/noadmin/courses/read/${course?.data?._id}`}
						objects={lessons}
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
			<div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							course?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${course?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadCourse;
