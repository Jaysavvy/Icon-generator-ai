
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";
import { PrimaryLink } from "./PrimaryLink";

export function Header(){
    const session = useSession(); 
  
    const isLoggedIn = !!session.data

    return (
    <header className=" px-4 container mx-auto justify-between dark:bg-gray-800 flex h-16 items-center">

    <PrimaryLink href="/" className="hover:text-cyan-500">Icon Generator</PrimaryLink>
    <ul>
        <li> 
        <PrimaryLink href='/generate'>Generate</PrimaryLink>
        </li>
    </ul>
    <ul>
        {isLoggedIn && 
        <li>  
            <Button 
            variant="secondary"
            onClick={()=> {
            signOut().catch(console.error)
            }}>
              Logout
            </Button>
        </li>}
         {!isLoggedIn && 
        <li>  
            <Button onClick={()=> {
            signIn().catch(console.error)
            }}>
              Login
            </Button>
        </li>}
    </ul>
    </header>
    );
}