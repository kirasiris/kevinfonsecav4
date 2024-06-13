import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Image from "next/image";
import Link from "next/link";
import PreviewModal from "@/components/chapter/previewmodal";

async function getAnime(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getChapters(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	return res;
}

const ReadAnime = async ({ params, searchParams }) => {
	const anime = await getAnime(`/${params.id}`);
	const chapters = await getChapters(
		`?resourceId=${anime?.data?._id}&sort=orderingNumber`
	);

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
					<div className="card-header">{anime?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={anime?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<div className="card-header">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<p className="mt-2 mb-0">Episodes</p>
							</div>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<Link
									href={{
										pathname: `/noadmin/animes/chapter/${anime?.data?._id}/create`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-outline-secondary btn-sm">
										Add chapter
									</a>
								</Link>
							</div>
						</div>
					</div>
					{chapters?.data?.length > 0 ? (
						<ul
							className="list-group list-group-flush overflow-x-hidden"
							style={{ maxHeight: "1000px" }}
							// onDragOver={(e) => e.preventDefault()}
						>
							{chapters?.data?.map((lesson, index) => (
								<li
									key={lesson._id}
									className={`list-group-item ${lesson.orderingNumber}`}
									draggable
									// onDragStart={(e) => updateOrder(e, index)}
									// onDrop={(e) => updateDrop(e, index)}
								>
									<div className="float-start">
										<Link href={`/video/${lesson._id}`} passHref legacyBehavior>
											<a target="_blank">
												<span className="badge bg-secondary me-1">
													{lesson.orderingNumber}
												</span>
												{lesson.title}
											</a>
										</Link>
									</div>
									<div className="float-end">
										{lesson.free_preview && <PreviewModal object={lesson} />}
										<span className="badge bg-info me-1">
											{lesson.duration}
										</span>
										<span className="badge bg-secondary me-1">
											{lesson.views}&nbsp;Views
										</span>
										<span className="badge bg-dark me-1">
											{lesson.language.toUpperCase()}
										</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="alert alert-danger rounded-0  m-0 border-0">
							Nothing&nbsp;found
						</div>
					)}
				</div>
			</div>
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							anime?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${anime?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadAnime;
