import Single from "@/components/theme/single";
import Header from "@/layout/header";
import Footer from "@/layout/footer";

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

const ThemeIndex = async () => {
	const getThemesData = getThemes(
		`?page=1&limit=10&sort=-createdAt&postType=theme&status=published`
	);

	const getCategoriesData = getCategories(`?categoryType=theme`);

	const [themes, categories] = await Promise.all([
		getThemesData,
		getCategoriesData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Portfolio"
				description="Check my projects out and tell me what you think!"
			/>
			<div className="container">
				<div className="row justify-content-center">
					{themes?.data?.map((theme, index) => (
						<div key={theme._id} className={`col-lg-4 col-md-6 mb-4 ${index}`}>
							<Single theme={theme} />
						</div>
					))}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default ThemeIndex;
