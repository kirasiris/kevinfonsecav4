async function getBlogs(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});
	return res.json();
}

const BlogIndex = async () => {
	const getBlogsData = getBlogs(
		`?page=1&limit=10&sort=-createdAt&postType=blog&status=published`
	);
	const [blogs] = await Promise.all([getBlogsData]);
	console.log(blogs);
	return <>BlogIndex</>;
};

export default BlogIndex;
