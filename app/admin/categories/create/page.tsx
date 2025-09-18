import CreateCategoryForm from "@/app/admin/categories/create/_component/CreateCategoryForm";
import {adminGetDomains} from "@/app/data/admin/admin-get-domains";


const CreateCategoryPage = async () => {

    const domains = await adminGetDomains();
    
    return (
        <CreateCategoryForm domains={domains}/>
    )
};

export default CreateCategoryPage;
