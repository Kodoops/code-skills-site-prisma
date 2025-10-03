"use client"

import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {updatePlanOptions} from "@/app/admin/plans/action";
import {useRouter} from "next/navigation";
import {tryCatch} from "@/hooks/try-catch";

const ManageOptions = ({ id, options }: { id: string; options?: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentOptions, setCurrentOptions] = useState<string[]>(options ?? []);
    const [newOption, setNewOption] = useState("");
    const router = useRouter();
    const handleAddOption = () => {
        if (newOption.trim() !== "") {
            setCurrentOptions((prev) => [...prev, newOption.trim()]);
            setNewOption("");
        }
    };

    const handleRemoveOption = (index: number) => {
        setCurrentOptions((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        const {data: result, error} = await  await tryCatch(updatePlanOptions(id, currentOptions));

        if (error) {
            toast.error(error.message,{
                style: {
                    background: "#FEE2E2",
                    color: "#991B1B",
                },
            });
        }
        if (result?.status === "success") {
            toast.success(result?.message,  {
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
            router.push("/admin/plans");
        } else {
            toast.error(result?.message,{
                style: {
                    background: "#FEE2E2",
                    color: "#991B1B",
                },
            });
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button>Manage Options</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Manage subscription Options</AlertDialogTitle>
                    <AlertDialogDescription>
                        You can manage your subscription options here.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2">
                    {currentOptions.length > 0 ? (
                        currentOptions.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border rounded px-2 py-1 bg-muted text-sm"
                            >
                                <span>{option}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveOption(index)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground italic text-sm">
                            No options yet
                        </p>
                    )}

                    {/* Input pour ajouter une nouvelle option */}
                    <div className="flex gap-2 mt-4">
                        <Input
                            placeholder="New option..."
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddOption}>
                            Add
                        </Button>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleSave}>Save</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ManageOptions;
