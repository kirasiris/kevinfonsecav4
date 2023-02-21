async function getBlog(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const Head = async ({
	// postImage = `${ScreenShot.src}`,
	// imageWidth = `${ScreenShot.width}`,
	// imageHeight = `${ScreenShot.height}`,
	videoWidth = "1873",
	videoHeight = "900",
	card = "",
	robots = "",
	canonical = `localhost:3000`,
	locales = "",
	cssLink,
	cssInline,
	jsLink,

	params,
}) => {
	const blog = await getBlog(`/${params.id}`);

	return (
		<>
			<title>{blog.data.title}</title>
			<meta name="description" content={blog.data.text} />
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<link rel="icon" href="/favicon.ico" />
			<meta name="robots" content={`${robots}`} />
			{canonical && <link rel="canonical" href={`${canonical}`} />}
			{locales?.length > 0 &&
				locales.map((locale, i) => (
					<meta property="og:locale" key={i} content={`${locale}`} />
				))}
			{locales?.length > 0 &&
				locales.map((locale, i) => (
					<link
						rel="alternate"
						href={`${canonical}/${locale}`}
						key={`${locale}`}
						hrefLang={`${locale}`}
					/>
				))}
			{blog.data.tags.length > 1 &&
				blog.data.tag.map((t, i) => (
					<meta property={`article:tag`} key={i} content={t} />
				))}

			<meta property="og:type" content={blog.data.postType} />
			<meta property="og:title" content={`${blog.data.title}`} />
			<meta property="og:description" content={`${blog.data.text}`} />
			<meta
				property="og:url"
				content={`${`${canonical}/blog/${params.id}/${params.categoryid}/${params.categoryslug}/${params.slug}`}`}
			/>
			<meta property="og:site_name" content={`${blog.data.title}`} />
			<meta property="article:author" content={blog.data.user.username} />
			<meta
				property="article:section"
				content={`${blog.data?.category?.title}`}
			/>
			<meta property="article:published_time" content={blog.data.createdAt} />
			<meta property="article:modified_time" content={blog.data.updatedAt} />
			<meta property="og:updated_time" content={blog.data.updatedAt} />

			{/* {postImage !== `` && (
					<meta property="og:image" content={`${postImage}`} />
				)}
				{postImage !== `` && (
					<meta property="og:image:secure_url" content={`${postImage}`} />
				)}
				{postImage !== `` && imageWidth && (
					<meta property="og:image:width" content={`${imageWidth}`} />
				)}
				{postImage !== `` && imageHeight && (
					<meta property="og:image:height" content={`${imageHeight}`} />
				)} */}
			{videoWidth && (
				<meta property="og:video:width" content={`${videoWidth}`} />
			)}
			{videoHeight && (
				<meta property="og:video:height" content={`${videoHeight}`} />
			)}
			{card && <meta name="twitter:card" content={`${card}`} />}
			<meta name="twitter:description" content={`${blog.data.text}`} />
			<meta name="twitter:title" content={`${blog.data.title}`} />
			<meta name="twitter:site" content={`@` + blog.data.user.username} />
			<meta
				property="twitter:url"
				content={`${`${canonical}/blog/${params.id}/${params.categoryid}/${params.categoryslug}/${params.slug}`}`}
			/>
			{videoWidth && (
				<meta property="twitter:player:width" content={`${videoWidth}`} />
			)}
			{videoHeight && (
				<meta property="twitter:player:height" content={`${videoHeight}`} />
			)}
			{/* {postImage !== `` && (
					<meta name="twitter:image" content={`${postImage}`} />
				)} */}
			<meta name="twitter:creator" content={`@` + blog.data.user.username} />
			{cssLink && (
				<link rel="stylesheet" href={`${cssLink}`} media="all"></link>
			)}
			{jsLink && (
				<script async src={`${jsLink}`} crossOrigin="anonymous"></script>
			)}
			{cssInline && <style>{cssInline}</style>}
		</>
	);
};

export default Head;
