export default function Head({
	title = `No title`,
	description = `No description`,
}) {
	return (
		<>
			{title && <title>{title}</title>}
			{description && <meta name="description" content={description} />}
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<link rel="icon" href="/favicon.ico" />
		</>
	);
}
