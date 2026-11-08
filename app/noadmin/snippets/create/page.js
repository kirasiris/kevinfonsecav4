import CreateSnippetForm from "@/forms/noadmin/snippets/createsnippetform";

const CreateSnippet = async ({ params, searchParams }) => {
	return (
		<div className="container-fluid px-0">
			<CreateSnippetForm />
		</div>
	);
};

export default CreateSnippet;
