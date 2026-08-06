import SmoothScroll from '../components/SmoothScroller';
import './globals.css';

export const metadata = {
  title: 'Portfolio Project 2026',
  description: 'Portfolio Project 2026',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
