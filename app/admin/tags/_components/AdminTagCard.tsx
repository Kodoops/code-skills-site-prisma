"use client";

import React from 'react';
import {Card, } from "@/components/ui/card";

import {cn} from "@/lib/utils";
import { Trash2} from "lucide-react";
import { Button } from '@/components/ui/button';
import {deleteTag} from "@/app/admin/tags/action";

const AdminTagCard = ( {id, title,color}:{  id: string,title: string , color: string }) => {

    const handleDelete =async (id: string) => {
        await deleteTag(id);
    }

    return (
        <Card
            className={cn(
                "group relative overflow-hidden  border border-white/10 bg-white/5 px-2 transition hover:bg-white/10",
                "backdrop-blur-sm border-border ",
            )}
        >

            <div className="flex items-center justify-between">
                <div className=" text-sm text-muted-foreground  px-6 ">
                    {title}
                </div>
              <Button  onClick={()=>handleDelete(id)} variant="ghost" className={"cursor-pointer"}>
                  <Trash2 className="w-6 h-6 text-muted-foreground" />
              </Button>
            </div>
        </Card>
    );
};

export default AdminTagCard;
