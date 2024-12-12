import React from 'react';
import { NavbarWithSearch } from './Navbar';
import { FooterWithLogo } from './Footer';

export function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
   
      <NavbarWithSearch/>


      <main className="flex-grow overflow-y-auto min-h-[calc(100vh-200px)] bg-orange-50 p-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      
      <FooterWithLogo/>
     
    </div>
  );
}

export default Layout;