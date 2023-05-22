import { Suspense } from "react";
import Single from "@/components/media/single";
import Header from "@/layout/header";
import Loading from "@/app/profile/loading";

async function getMe(params) {
	const res = await fetch(`http://localhost:5000/api/v1/users${params}`);
	return res.json();
}

async function getMedias(params) {
	const res = await fetch(`http://localhost:5000/api/v1/medias${params}`, {
		cache: "no-store",
	});

	return res.json();
}

const MePhotosIndex = async ({ params, searchParams }) => {
	const getMeData = getMe(`/${params.id}`);

	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getMediasData = getMedias(`?limit=9&album=posts`);

	const me = await getMeData;
	const photos = await getMediasData;

	const nextPage = photos?.pagination?.next?.page || 0;
	const prevPage = photos?.pagination?.prev?.page || 0;

	let images = {
		id: 1234,
		src: "https://source.unsplash.com/random/168x168",
	};

	return (
		<Suspense fallback={<Loading />}>
			<Header
				headerStyle={{
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${
						me.data[0].cover?.location.secure_location ||
						`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`
					})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			/>
			<div className="container">
				<div className="row">
					<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 profile-pictures">
						{photos?.data?.length > 0 && (
							<>
								<h2>Photos</h2>
								{photos.data?.map((media) => (
									<Single key={media._id} media={media} />
								))}
							</>
						)}
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default MePhotosIndex;
