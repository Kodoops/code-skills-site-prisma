import React from 'react';
import Navbar from './_components/navbar';
import Footer from './_components/Footer';

const PublicLayout = ({
                          children,
                      }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className={"flex flex-col  min-h-screen"}>
            <Navbar/>
           <main className={"container mx-auto px-4 md:px-6 lg:px-8 mb-32 flex-1"}>
               {children}
           </main>
            <Footer/>
        </div>
    );
};

export default PublicLayout;
