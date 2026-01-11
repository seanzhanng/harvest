// frontend/components/NavBar.tsx
'use client';
import Link from 'next/link';
import '@/styles/home-styling.css'; 

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" style={{ textDecoration: 'none' }}>
           <h2 className="nav-logo">Food Explorer</h2>
        </Link>
        <div className="nav-links">
          <Link href="/recipes" className="nav-link">
            Recipes
          </Link>
        </div>
      </div>
    </nav>
  );
}