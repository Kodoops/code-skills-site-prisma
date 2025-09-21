import CreateWorkshopPage from "./_components/CreateWorkshopPage";
import {getLevels} from "@/app/data/get-levels";
import {getStatus} from "@/app/data/get-status";


export default async function CreateWorkshopPageWrapper() {
    const levels : string[] = await getLevels();
    const status: string[] = await getStatus();


    return <CreateWorkshopPage  levels={levels} status={status}/>;
}
