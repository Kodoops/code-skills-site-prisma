import {getLevels} from "@/app/data/get-levels";
import {getStatus} from "@/app/data/get-status";
import CreateLearningPathPage from "@/app/admin/learning-paths/create/_components/CreateLearningPathPage";


export default async function CreateLearningPagePageWrapper() {

    const levels : string[] = await getLevels();
    const status: string[] = await getStatus();


    return <CreateLearningPathPage levels={levels} status={status}/>;
}
