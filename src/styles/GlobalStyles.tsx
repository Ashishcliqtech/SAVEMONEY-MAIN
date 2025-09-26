import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: #1f2937;
    background-color: #f9fafb;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
  }

  #root {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* Ensure all containers stay within bounds */
  .container, 
  .max-w-7xl, 
  .max-w-6xl, 
  .max-w-5xl, 
  .max-w-4xl, 
  .max-w-3xl, 
  .max-w-2xl, 
  .max-w-xl {
    width: 100%;
    max-width: calc(100vw - 2rem);
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
  }

  @media (min-width: 640px) {
    .container, 
    .max-w-7xl, 
    .max-w-6xl, 
    .max-w-5xl, 
    .max-w-4xl, 
    .max-w-3xl, 
    .max-w-2xl, 
    .max-w-xl {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .container, 
    .max-w-7xl, 
    .max-w-6xl, 
    .max-w-5xl, 
    .max-w-4xl, 
    .max-w-3xl, 
    .max-w-2xl, 
    .max-w-xl {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  /* Prevent horizontal scroll on all elements */
  * {
    box-sizing: border-box;
  }

  /* Fix for flex containers */
  .flex {
    min-width: 0;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Line clamp utilities */
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Focus styles */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
  }

  /* Button hover effects */
  .btn-hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-hover-lift:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  /* Card hover effects */
  .card-hover {
    transition: all 0.3s ease;
  }

  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Glass morphism */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
    
    .container-mobile {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }

  /* Sidebar layout fixes */
  .sidebar-layout {
    display: flex;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .sidebar-content {
    flex: 1;
    min-width: 0;
    overflow-x: hidden;
  }

  /* Responsive grid fixes */
  .responsive-grid {
    display: grid;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
  }

  @media (min-width: 640px) {
    .responsive-grid {
      gap: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .responsive-grid {
      gap: 2rem;
    }
  }
`;