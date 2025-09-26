import CreateResourcePage from "./_components/CreateResourcePage";
import {getResourcesTypes} from "@/app/data/get-resources-types";


export default async function CreateWorkshopPageWrapper() {

    const resourceTypes = await getResourcesTypes();

    return <CreateResourcePage resourceTypes={resourceTypes}/>;
}
