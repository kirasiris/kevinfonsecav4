import CreateSecretForm from "@/forms/noadmin/secrets/createsecretform";

const CreateSecret = async ({ params, searchParams }) => {
	return <CreateSecretForm token={token} auth={auth} />;
};

export default CreateSecret;
