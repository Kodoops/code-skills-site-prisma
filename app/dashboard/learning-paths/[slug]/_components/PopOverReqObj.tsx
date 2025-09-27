import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Badge} from "@/components/ui/badge";
import {CheckIcon} from "lucide-react";

const PopOverReqObj = ({currentStep, items, title, description}:
                       {currentStep:number, items:{ content:string, id:string }[], title:string, description:string}) => {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Badge variant={"outline"}
                       // ${currentStep > 1 ? "bg-primary" : "bg-muted"}
                       className={`rounded-full border ${currentStep > 1 ? "border-primary" : "border-border"} bg-muted px-6 py-1 flex gap-4 justify-between`}>
                    PreRequisites
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium border-b pb-2">{title}</h4>
                        <p className="text-muted-foreground text-sm italic ">
                            {description}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {items.map((item, index) => (
                            <p key={index} className="text-foreground text-base flex gap-2 items-center ">
                                <CheckIcon className="text-primary size-4"/> {item.content}
                            </p>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )

};

export default PopOverReqObj;
