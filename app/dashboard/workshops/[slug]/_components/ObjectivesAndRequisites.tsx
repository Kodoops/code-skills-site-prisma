import React from 'react';
import {CheckIcon} from "lucide-react";

const ObjectivesAndRequisites = ({requisites, objectives}: {
    requisites: { content: string, id: string }[],
    objectives: { id: string, content: string }[]
}) => {

    return (
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
            <div className="border bg-muted-foreground/10 rounded-lg p-4">
                <div className="space-y-2">
                    <h4 className="leading-none font-medium border-b pb-2">PréRequis</h4>
                    <p className="text-muted-foreground text-sm italic ">
                        Avant de commencer ce parcours , veuillez vous assurer d&apos;avoir les pre-requis suivants :
                    </p>
                </div>
                <div className="grid gap-2">
                    {requisites.map((item, index) => (
                        <p key={index} className="text-foreground text-base flex gap-2 items-center ">
                            <CheckIcon className="text-primary size-4"/> {item.content}
                        </p>
                    ))}
                </div>
            </div>
            <div className="border bg-muted-foreground/10 rounded-lg p-4">
                <div className="space-y-2">
                    <h4 className="leading-none font-medium border-b pb-2">Objectifs</h4>
                    <p className="text-muted-foreground text-sm italic ">
                        A la fin de se parcours vous aurez atteint les objectifs suivants :
                    </p>
                </div>
                <div className="grid gap-2">
                    {objectives.map((item, index) => (
                        <p key={index} className="text-foreground text-base flex gap-2 items-center ">
                            <CheckIcon className="text-primary size-4"/> {item.content}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ObjectivesAndRequisites;
