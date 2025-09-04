import React from 'react';
import Navbar from './_components/navbar';

const PublicLayout = ({
                          children,
                      }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className={"flex flex-col"}>
            <Navbar/>
           <main className={"container mx-auto px-4 md:px-6 lg:px-8"}>
               {children}
           </main>
        </div>
    );
};

export default PublicLayout;
