import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import {PlusIcon} from "lucide-react";
import {getCompanySocialLinks} from "@/app/data/get-company-social-links";
import {SocialLinkType} from "@/lib/db/types";
import SocialLinkForm from "@/app/admin/social-links/_component/SocialLinkForm";
import {getSocialLinksNotLinkedYet} from "@/app/data/get-social-links-not-linked";
import {SocialNetworkCard} from "@/app/admin/social-links/_component/SocialNetworkCard";


const SocialLinksPage = async () => {

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Social Links</h1>
                <Link href={"/admin/social-links/create"}
                      className={buttonVariants()}>
                    <PlusIcon className={"w-5 h-5 mr-2"}/>
                    Add Social Link
                </Link>
            </div>
            <Suspense fallback={<AdminCategoryCardSkeletonLayout/>}>
                <RenderSocialLinks/>
            </Suspense>
        </>
    );
}

export default SocialLinksPage;

async function RenderSocialLinks() {

    const existing = await getCompanySocialLinks();
    const links = await getSocialLinksNotLinkedYet();
    const existingIds = existing?.map((link) => link.socialLinkId);

    const availables = links?.filter((link) => !existingIds?.includes(link.id));


    return (
        <>
            {existing?.length === 0 ?
                <EmptyState title={"No Social Links Found"}
                            description={"You don't have any social link yet. Add new social link to get started."}
                />
                :
                <>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
                        {existing?.map((social) => {

                                const props = {
                                    ...social.socialLink,
                                    createdAt: social.socialLink.createdAt.toISOString(),
                                    updatedAt: social.socialLink.updatedAt.toISOString(),
                                    url: social.url
                                };

                                return <AdminSocialLinkCard key={social.id} social={props}/>
                            }
                        )}
                    </div>
                </>
            }

            {availables && <SocialLinkForm links={availables}/>}
        </>
    )
}

function AdminCategoryCardSkeletonLayout() {
    return (
        <div className="">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCategoryCardSkeleton key={index}/>
            ))}
        </div>
    )
}

function AdminSocialLinkCard({social}: { social: SocialLinkType & { url: string } }) {

    return (
            <SocialNetworkCard item={social}/>
    )
}
