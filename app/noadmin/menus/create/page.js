import CreateMenuForm from "@/forms/noadmin/menus/createmenuform";

const CreateMenu = async ({ params, searchParams }) => {
	return (
		<div className="container-fluid px-0">
			<CreateMenuForm />
		</div>
	);
};

export default CreateMenu;
