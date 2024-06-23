import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Image from "next/image";
import LessonList from "@/components/admin/courses/lessonlist";
import { revalidatePath } from "next/cache";

async function getCourse(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
	return res;
}

async function getLessons(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	return res;
}

const ReadCourse = async ({ params, searchParams }) => {
	const course = await getCourse(`/${params.id}`);
	const lessons = await getLessons(
		`?resourceId=${course?.data?._id}&sort=orderingNumber`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${params.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${params.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${params.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses/read/${params.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/courses/read/${params.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall`, "PUT", "no-cache", {
			onModel: "Course",
		});
		revalidatePath(`/noadmin/courses/read/${params.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall/permanently`, "DELETE", "no-cache", {
			onModel: "Course",
		});
		revalidatePath(`/noadmin/courses/read/${params.id}`);
	};

	// const updateOrder = async (e, index) => {
	// 	e.dataTransfer.setData("itemIndex", index.toString());
	// };

	// const updateDrop = async (e, index) => {
	// 	const movingItemIndex = e.dataTransfer.getData("itemIndex");
	// 	const targetItemIndex = index;

	// 	let allLessons = lessons; // Create a copy of the lessons array

	// 	let movingItem = allLessons[movingItemIndex];
	// 	let targetItem = allLessons[targetItemIndex];

	// 	if (movingItem.orderingNumber !== targetItem.orderingNumber) {
	// 		// Only update the ordering numbers if they are different

	// 		// Switch the ordering numbers of the moving item and the target item
	// 		const tempOrderingNumber = movingItem.orderingNumber;
	// 		movingItem.orderingNumber = targetItem.orderingNumber;
	// 		targetItem.orderingNumber = tempOrderingNumber;

	// 		// Update the ordering numbers in the backend
	// 		await fetchurl(
	// 			`/videos/${movingItem._id}/updateorder`,
	// 			"PUT",
	// 			"no-cache",
	// 			{
	// 				index: movingItem.orderingNumber, // Update the moving item's ordering number
	// 			}
	// 		);
	// 		await fetchurl(
	// 			`/videos/${targetItem._id}/updateorder`,
	// 			"PUT",
	// 			"no-cache",
	// 			{
	// 				index: targetItem.orderingNumber, // Update the target item's ordering number
	// 			}
	// 		);
	// 	}

	// 	allLessons.splice(movingItemIndex, 1); // Remove the moving item from the original position
	// 	allLessons.splice(targetItemIndex, 0, movingItem); // Insert the moving item at the target position

	// 	setLessons([...lessons], allLessons);
	// };

	return (
		<div className="row">
			<div className="col-lg-8">
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
						searchParams={searchParams}
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
