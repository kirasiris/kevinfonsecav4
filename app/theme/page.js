import Single from "@/components/theme/single";
import Header from "@/layout/header";

async function getThemes(params) {
	const res = await fetch(`http://localhost:5000/api/v1/themes${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getCategories(params) {
	const res = await fetch(`http://localhost:5000/api/v1/categories${params}`);

	return res.json();
}

const ThemeIndex = async ({ searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getThemesData = getThemes(
		`?page=${page}&limit=${limit}&sort=-createdAt&postType=theme&status=published`
	);

	const getCategoriesData = getCategories(`?categoryType=theme`);

	const [themes, categories] = await Promise.all([
		getThemesData,
		getCategoriesData,
	]);

	const nextPage = themes?.pagination?.next?.page || 0;
	const prevPage = themes?.pagination?.prev?.page || 0;

	return (
		<>
			<Header
				title="Welcome to my Portfolio"
				description="Check my projects out and tell me what you think!"
			/>
			<div className="container">
				<div className="row justify-content-center">
					{themes?.data?.length > 0 &&
						themes.data?.map((theme) => (
							<Single key={theme._id} theme={theme} />
						))}
				</div>
			</div>
		</>
	);
};

export default ThemeIndex;
