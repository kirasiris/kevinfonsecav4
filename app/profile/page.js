import Single from "@/components/profile/single";
import Header from "@/layout/header";

async function getProfiles(params) {
	const res = await fetch(`http://localhost:5000/api/v1/users${params}`, {
		cache: "no-store",
	});

	return res.json();
}

const ProfileIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getProfilesData = getProfiles(
		`?page=${page}&limit=${limit}&sort=-createdAt&isEmailConfirmed=true`
	);

	const [profiles] = await Promise.all([getProfilesData]);

	const nextPage = profiles?.pagination?.next?.page || 0;
	const prevPage = profiles?.pagination?.prev?.page || 0;

	return (
		<>
			<Header
				headerStyle={{
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			/>
			<div className="container">
				<div className="row">
					{profiles?.data?.length > 0 &&
						profiles.data.map((p) => <Single key={p._id} profile={p} />)}
				</div>
			</div>
		</>
	);
};

export default ProfileIndex;
