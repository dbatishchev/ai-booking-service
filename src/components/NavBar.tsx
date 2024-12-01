import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <Link href="/" className="text-lg font-semibold hover:opacity-80">
            Home
          </Link>
          <div className="ml-8">
            <Link href="/restaurants" className="hover:opacity-80">
              Restaurants
            </Link>
          </div>
        </div>
      </div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
