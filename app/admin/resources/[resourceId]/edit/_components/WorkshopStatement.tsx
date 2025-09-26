import React from 'react';
import {WorkshopType} from "@/lib/types";
import {WorkshopStatementForm} from "@/app/admin/workshops/[workshopId]/edit/_components/WorkshopStatementFrom";

const WorkshopStatement = ({data}:{data:WorkshopType}) => {
    return (
        <WorkshopStatementForm data={ data} />
    );
};

export default WorkshopStatement;
