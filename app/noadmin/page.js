import DynamicCards from "@/components/global/dynamiccards";
import Header from "@/layout/header";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getBlogs(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "default");
	return res;
}

async function getThemes(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "default");
	return res;
}

// async function getPosts(params) {
// 	const res = await fetchurl(`/posts${params}`, "GET", "default");
// 	return res;
// }

// async function getPlaylists(params) {
// 	const res = await fetchurl(`/playlists${params}`, "GET", "default");
// 	return res;
// }

// async function getCourses(params) {
// 	const res = await fetchurl(`/courses${params}`, "GET", "default");
// 	return res;
// }

// async function getVideos(params) {
// 	const res = await fetchurl(`/videos${params}`, "GET", "default");
// 	return res;
// }

// async function getUsers(params) {
// 	const res = await fetchurl(`/users${params}`, "GET", "default");
// 	return res;
// }

// async function getComments(params) {
// 	const res = await fetchurl(`/comments${params}`, "GET", "default");
// 	return res;
// }

// async function getQuizzes(params) {
// 	const res = await fetchurl(`/quizzes${params}`, "GET", "default");
// 	return res;
// }

// async function getEmails(params) {
// 	const res = await fetchurl(`/emails${params}`, "GET", "default");
// 	return res;
// }

// async function getReports(params) {
// 	const res = await fetchurl(`/reports${params}`, "GET", "default");
// 	return res;
// }

// async function getSecrets(params) {
// 	const res = await fetchurl(`/extras/secrets${params}`, "GET", "default");
// 	return res;
// }

// async function getFiles(params) {
// 	const res = await fetchurl(`/files${params}`, "GET", "default");
// 	return res;
// }

// async function getCategories(params) {
// 	const res = await fetchurl(`/categories${params}`, "GET", "default");
// 	return res;
// }

// async function getChangelogs(params) {
// 	const res = await fetchurl(`/changelogs${params}`, "GET", "default");
// 	return res;
// }

// async function getNewsletters(params) {
// 	const res = await fetchurl(`/newsletters${params}`, "GET", "default");
// 	return res;
// }

// async function getQuotes(params) {
// 	const res = await fetchurl(`/extras/quotes${params}`, "GET", "default");
// 	return res;
// }

// async function getYouTubeDownloads(params) {
// 	const res = await fetchurl(`/extras/youtube${params}`, "GET", "default");
// 	return res;
// }

// async function getShortUrls(params) {
// 	const res = await fetchurl(`/extras/shorturls${params}`, "GET", "default");
// 	return res;
// }

// async function getLogs(params) {
// 	const res = await fetchurl(`/logs${params}`, "GET", "default");
// 	return res;
// }

const AdminHome = async ({ params, searchParams }) => {
	const blogsData = getBlogs(`?postType=blog`);
	const themesData = getThemes(`?postType=theme`);

	// const postsData = getPosts(`?page=1`);
	// const playlistsData = getPlaylists(`?page=1`);
	// const coursesData = getCourses(`?page=1`);
	// const videosData = getVideos(`?page=1`);
	// const usersData = getUsers(`?page=1`);
	// const commentsData = getComments(`?page=1`);
	// const quizzesData = getQuizzes(`?page=1`);
	// const emailsData = getEmails(`?page=1`);
	// const reportsData = getReports(`?page=1`);
	// const filesData = getFiles(`?page=1`);
	// const categoriesData = getCategories(`?page=1`);
	// const changelogsData = getChangelogs(`?page=1`);
	// const newslettersData = getNewsletters(`?page=1`);
	// const logsData = getLogs(`?page=1`);

	// const secrets = await getSecrets(`?page=1`);
	// const quotes = await getQuotes(`?page=1`);
	// const youtubedownloads = await getYouTubeDownloads(`?page=1`);
	// const shorturls = await getShortUrls(`?page=1`);

	const [
		blogs,
		themes,
		posts,
		playlists,
		courses,
		videos,
		users,
		comments,
		quizzes,
		emails,
		reports,
		files,
		categories,
		changelogs,
		newsletters,
		logs,
	] = await Promise.all([
		blogsData,
		themesData,
		// postsData,
		// playlistsData,
		// coursesData,
		// videosData,
		// usersData,
		// commentsData,
		// quizzesData,
		// emailsData,
		// reportsData,
		// filesData,
		// categoriesData,
		// changelogsData,
		// newslettersData,
		// logsData,
	]);

	// const { auth, totalResults } = useContext(AuthContext);
	// const router = useRouter();

	// // Redirect if not authenticated
	// !auth.isAuthenticated && router.push("/auth/login");

	// // Redirec if not founder
	// auth.isAuthenticated &&
	// 	!auth.user.role.includes("founder") &&
	// 	router.push("/dashboard");

	return (
		<>
			<Header
				title={`Welcome back!, Root`}
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCards
					title="Blogs"
					text={blogs?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/blogs"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Themes"
					text={themes?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/themes"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				{/* <DynamicCards
					title="Posts"
					text={posts?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/posts"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Playlists"
					text={playlists?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/playlists"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Courses"
					text={courses?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/courses"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Videos"
					text={videos?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/videos"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Users"
					text={users?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/users"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Comments"
					text={comments?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/comments"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Quizzes"
					text={quizzes?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/quizzes"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Emails"
					text={emails?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/emails"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Reports"
					text={reports?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/reports"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Secrets"
					text={secrets?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/secrets"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Files"
					text={files?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/files"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Categories"
					text={categories?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/categories"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Changelogs"
					text={changelogs?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/changelogs"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Newsletter Subscribers"
					text={newsletters?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/newsletters"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Quotes"
					text={quotes?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/quotes"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="YouTube"
					text={youtubedownloads?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/ytdownloads"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Short Urls"
					text={shorturls?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/shorturls"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Logs"
					text={logs?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/logs"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/> */}
			</div>
			<div className="row">
				<div className="col">
					<div className="card">
						<div className="card-header">At a Glance</div>
						<div className="card-body"></div>
						<div className="card-footer">
							<p>
								Askimet has protected your site from 3 spam comments already.
							</p>
							<br />
							There&apos;s nothing in your spam queue at the moment.
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminHome;
