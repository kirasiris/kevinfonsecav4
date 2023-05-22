import Link from "next/link";
import Header from "@/layout/header";
import SingleBlog from "@/components/blog/single";
import SingleTheme from "@/components/theme/single";
import NewsletterForm from "@/layout/newsletter";

async function getNewsletters(params) {
	const res = await fetch(`http://localhost:5000/api/v1/newsletters${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getBlogs(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getThemes(params) {
	const res = await fetch(`http://localhost:5000/api/v1/themes${params}`, {
		cache: "no-store",
	});

	return res.json();
}

const Home = async () => {
	const getNewslettersData = getNewsletters(``);
	const getBlogsData = getBlogs(
		`?page=1&limit=2&sort=-createdAt&postType=blog&status=published`
	);

	const getThemesData = getThemes(
		`?page=1&limit=3&sort=-createdAt&postType=theme&status=published`
	);

	const [newsletters, blogs, themes] = await Promise.all([
		getNewslettersData,
		getBlogsData,
		getThemesData,
	]);

	const showcaseImage = "";

	return (
		<>
			<Header
				title="Kevin Uriel"
				description="Programmer, Geek, Gamer and now Soldier"
				headerClasses="d-flex flex-column vh-100 vw-100"
				headerContainerClasses="m-auto"
				headerStyle={{
					backgroundAttachment: "fixed !important",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "50% 50%",
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${
						showcaseImage ||
						`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`
					}) no-repeat center center`,
				}}
			/>
			{/* CALL TO ACTION - NEWSLETTER REGISTRATION BY EMAIL */}
			<section id="newsletter" className="border-bottom py-5">
				<div className="container">
					<h2 className="page-section-heading display-5 text-uppercase my-5">
						Subscribe to our Newsletter
					</h2>
					<NewsletterForm newsletters={newsletters} />
				</div>
			</section>
			{/* BLOGS */}
			{blogs?.data?.length > 0 && (
				<section id="blogs" className="border-bottom py-5">
					<div className="container">
						<h2 className="page-section-heading display-5 text-uppercase text-secondary my-5">
							<Link href={`/blog`}>Latest Blogs</Link>
						</h2>
						<div className="row">
							{blogs.data.map((blog, index) => (
								<div key={blog._id} className={`col-lg-6 ${index}`}>
									<SingleBlog
										blog={blog}
										imageWidth={`415`}
										imageHeight={`207`}
									/>
								</div>
							))}
						</div>
					</div>
				</section>
			)}
			{/* THEMES */}
			{themes?.data?.length > 0 && (
				<section id="themes" className="border-bottom py-5">
					<div className="container">
						<h2 className="page-section-heading display-5 text-uppercase text-secondary my-5">
							<Link href={`/theme`}>Latest Themes</Link>
						</h2>
						<div className="row justify-content-center">
							{themes.data.map((theme, index) => (
								<div
									key={theme._id}
									className={`col-lg-4 col-md-6 mb-4 ${index}`}
								>
									<SingleTheme theme={theme} />
								</div>
							))}
						</div>
					</div>
				</section>
			)}
			{/* WHAT PEOPLE SAY ABOUT ME */}
			<section id="testimonials" className="border-bottom py-5">
				<div className="container">
					<h2 className="page-section-heading display-5 text-uppercase my-5">
						Get to Know Me
					</h2>
					<div className="row">
						<div className="col-lg-4">
							<p className="fs-4">
								Customers are Awesome. Check what our clients are saying about
								us.
							</p>
						</div>
						<div className="col-lg-8">
							<div className="card">
								<div className="card-body">
									<figure>
										<blockquote className="blockquote">
											<p>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit.
												Nunc et metus id ligula malesuada placerat sit amet quis
												enim. Aliquam erat volutpat. In pellentesque scelerisque
												auctor.
											</p>
										</blockquote>
										<figcaption className="blockquote-footer">
											AUTHOR NAME&nbsp;-&nbsp;
											<cite title="SOURCE WEBSITE">SOURCE WEBSITE</cite>
										</figcaption>
									</figure>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* CONTACT ME */}
		</>
	);
};

export default Home;
