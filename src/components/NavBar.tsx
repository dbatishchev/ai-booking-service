import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-lg font-semibold hover:opacity-80">
              Home
            </Link>
            <Link href="/restaurants" className="hover:opacity-80">
              Restaurants
            </Link>
          </div>

          {/* Right side authentication */}
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
