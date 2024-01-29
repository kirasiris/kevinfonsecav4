import Single from "@/components/changelog/single";
import Header from "@/layout/header";
import Head from "@/app/head";
import NumericPagination from "@/layout/numericpagination";

async function getChangelogs(params) {
	const res = await fetch(`http://localhost:5000/api/v1/changelogs${params}`, {
		cache: "no-store",
	});

	return res.json();
}

const ChangelogIndex = async ({ searchParams }) => {
	const limit = searchParams.limit || 1000;
	const page = searchParams.page || 1;

	const getChangelogsData = getChangelogs(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published`
	);

	const [changelogs] = await Promise.all([getChangelogsData]);

	const nextPage = changelogs?.pagination?.next?.page || 0;
	const prevPage = changelogs?.pagination?.prev?.page || 0;

	const groupByDate = changelogs?.data?.reduce((groups, changelog) => {
		const date = changelog.createdAt.split("T")[0];
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(changelog);
		return groups;
	}, {});

	return (
		<>
			<Head
				title="Changelog"
				description="Here you can see every change that is taking place with the development of this app!"
			/>
			<Header
				title="Changelog"
				description="Here you can see every change that is taking place with the development of this app!"
			/>
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						{/* Changelog list */}
						<div className="row">
							{Object.entries(groupByDate).map(([date, changelogs]) => (
								<div key={date}>
									<p className="text-center my-3">{date}</p>
									{changelogs.map((changelog) => (
										<Single key={changelog._id} changelog={changelog} />
									))}
								</div>
							))}
							<NumericPagination
								totalPages={
									changelogs?.pagination?.totalpages ||
									Math.ceil(changelogs?.data?.length / searchParams.limit)
								}
								page={searchParams.page}
								limit={searchParams.limit}
								sortby="-createdAt"
								siblings={1}
								postType="blog"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChangelogIndex;
