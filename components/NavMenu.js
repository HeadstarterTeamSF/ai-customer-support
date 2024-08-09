'use client'
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

// function AuthButton() {
//     const { data: session } = useSession();
//     if (session) {
//         return (
//             <>
//                 {session?.data?.user?.name} <br />
//                 <button onClick={() => signOut()}>Sign out</button>
//             </>
//         );
//     }
//     return (
//         <>
//             Not signed in <br />
//             <button onClick={() => signIn()}>Sign in</button>
//         </>
//     );
// }

export default function NavMenu() {
    const { data: session } = useSession();
    // const [isSignedIn, setIsSignedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignIn = () => {
        signIn();
    };

    const handleSignOut = () => {
        signOut();
        setDropdownOpen(false);
    };
    return (
        <nav className="bg-blue-600 p-4 flex justify-between items-center">
            <div className="text-white text-xl font-bold">
                Customer Support Assistant
            </div>
            <div>
                {session ? (
                    <div className="relative">
                        <button
                            className="focus:outline-none"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <img
                                src={session?.user?.image}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                                <div className="block w-full text-left px-4 py-2 text-gray-800" >
                                    {session?.user?.name}
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleSignIn}
                        className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
        // <div>
        //     <AuthButton />
        // </div>
    )
}