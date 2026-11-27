NextJS = This is a fullstack framework for React that enables server-side rendering and static site generation.

NextJS is good for ::
SEO, routing, performance optimization, suitable for building fullstack applications.

If react, then why Nextjs?
-> SEO is the main advantage as NextJS enables server-side rendering which improves search engine visibility.SEO can be optimized in many ways, like delivering server-side rendered pages, optimizing meta tags, and improving page load speed.


there are many ways for SEO optimization, the first is to deliver server-side rendering



# Crawling, Indexing & SEO

## 1. Crawling
Crawling is the process of discovering and scanning web pages by search engine bots (also called crawlers or spiders).

- Search engines use automated bots like Googlebot to visit websites.
- These bots discover pages by following links from one page to another.
- They can also discover URLs through XML sitemaps.

**Example:** Googlebot visits your homepage and follows links to discover your About, Contact, Products, and Blog pages.

**In simple words:** Crawling = Discovering web pages.

## 2. Indexing
Indexing is the process of analyzing and storing information about discovered web pages in a search engine's index.

During indexing, Google may analyze:
- Page title
- Headings (H1, H2, H3)
- Text and content
- Images and their alt attributes
- Internal and external links
- Other relevant information

If Google considers a page suitable, it may add that page to its search index.

**Important:** Crawling does not guarantee indexing.

**Example:** Googlebot crawls your blog page, analyzes its content, and stores information about it in Google's search index.

**In simple words:** Indexing = Analyzing and storing web pages.

## 3. SEO (Search Engine Optimization)
SEO is the process of optimizing a website to improve its visibility in organic (unpaid) search engine results.

**Example:** If someone searches for "Best JavaScript courses for beginners", SEO helps improve the chances of your website appearing higher in relevant search results.

### Three Major Types of SEO

**A. Technical SEO**
Focuses on improving the technical aspects of a website.

- Website loading speed
- Mobile responsiveness
- XML sitemap
- Robots.txt
- HTTPS
- Crawlability and indexability
- Proper URL structure

**B. On-Page SEO**
Focuses on optimizing the content and HTML elements of individual web pages.

- Title tags
- Meta descriptions
- Proper heading structure (H1, H2, H3)
- Relevant keywords
- High-quality content
- Image alt attributes
- Internal linking

**C. Off-Page SEO**
Focuses on improving a website's reputation and authority outside the website itself.

- Backlinks
- Brand mentions
- Digital PR
- Website reputation and authority

## 4. How Crawling, Indexing and SEO Work Together

1. **Crawling:** Googlebot discovers and scans your website pages.
2. **Indexing:** Google analyzes the discovered pages and may store information about them in its search index.
3. **Ranking:** Google evaluates indexed pages and determines their positions for relevant search queries.
4. **Search Results:** Users may find your website when they search for relevant information.

**Note:** SEO is an ongoing process, not a separate step that happens only after indexing. It helps improve your website across these stages.

## 5. Example for a Next.js Website

Suppose you build a blog using Next.js.

- Crawling: Googlebot visits `/blog/react-tutorial`.
- Indexing: Google analyzes the page and may add it to its search index.
- SEO: You optimize the page title, metadata, content, URL, loading speed and internal links.
- Ranking: Google evaluates the page against other relevant pages and determines its position in search results.

## Quick Revision

| Term | Meaning |
|---|---|


SSR= server side rendering
SSG= static site generation
CSR= client side rendering
ISR= Incremental side regeneration



NextJS & things to learn: a)Routing 1. File based Routing, 2.App Router
b) dynamic Routing
c) protected Routing
d) client side component & Server side component

src/app = Base route
src/app/page.js = Home page component
src/app/product = Product is a new route, if we want to show the product page, we create this folder and add a page.js inside it.

folder means Route(path) and page.js is element(component) that will be rendered for that route.

=> So, till now, we have two page.js file, one for the home page (`src/app/page.js`) and one for the home route (`src/app/home/page.js`).

project1/src/
├─ app/
│  ├─ page.js
│  ├─ home/
│  │  └─ page.js
│  └─ product/
│     └─ page.js


========================
project1/src/app/page.js
========================

import React from 'react'

const page = () => {
  return (
    <div>Hello , this is next js Page</div>
  )
}

export default page

=============================
project1/src/app/home/page.js
=============================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is home page element</h1>
    </div>
  )
}

export default page



=> Now, when we visit the `localhost:3000`, we will be able to see `Hello , this is next js Page` and when we visit `localhost:3000/home`, we will be able to see `This is home page element`.

=>Unlike React.js, where we typically create separate components such as `HomePage` or `ProductPage` and configure routes using a routing library, Next.js uses a file-system-based routing system. We create folders to define routes, and the `page.js` file inside each folder acts as the component rendered for that particular route.

=> in a similar way, i've created two more routes, `contact` and `about`, by creating corresponding folders and adding `page.js` files inside them.

=============================
project1/src/app/contact/page.js
=============================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is contact page element</h1>
    </div>
  )
}

export default page

=============================
project1/src/app/about/page.js
=============================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is about page element</h1>
    </div>
  )
}

export default page

=> when we visit `localhost:3000/contact`, we will see `This is contact page element` and when we visit `localhost:3000/about`, we will see `This is about page element`.


=> For navigation, we use layout. The `layout.js` file inside the `app` folder acts as a wrapper for all the pages, allowing us to define common elements like headers, footers, and navigation links that will be present across all routes.

if we want to create layout, we need to do so with ::

 <html
      lang="en"
      className={`h-full antialiased`}
 >
    <body className="min-h-full flex flex-col">{children}</body>
</html>

we do this because layout.js is server, and to render anything in browser, we need to include the HTML structure with `<html>` and `<body>` tags, and place the `{children}` inside the body to render the page content. here, `{children}` represents the content of the specific page being rendered.


if we write the layout.js file as shown below:

```javascript
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        navbar
        {children}
      </body>
    </html>
  );
}
```

then the `navbar` will be displayed on all pages, and the specific page content will be rendered where `{children}` is placed.

=> Now, we'll create a navbar component and include it in the layout.js file so that it appears on all pages.


===========================
project1/src/app/layout.js
===========================

import "./globals.css";


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        <div className="flex gap-5">
          <a href="/">Start</a>
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        {children}</body>
    </html>
  );
}


=> Now, when we visit any page like `localhost:3000/home`, `localhost:3000/about`, or `localhost:3000/contact`, the navbar with links to all pages will be displayed at the top, and the specific page content will be rendered below it.


=> there is an issue with reloading, when we click on any link in the navbar, the entire page reloads. This breaks the SPA behavior of Next.js. To fix this, we should use the `Link` component from `next/link` instead of the standard `<a>` tags for navigation. This allows Next.js to handle client-side navigation without full page reloads.


===========================
project1/src/app/layout.js
===========================

import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        <div className="flex gap-5">
          <Link href="/">Start</Link>
          <Link href="/home">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        {children}</body>
    </html>
  );
}


=> Now, when we click on any link in the navbar, the navigation will be handled client-side by Next.js, preventing full page reloads and maintaining the SPA behavior.


=> we will create a separate file for Navbar.js inside component


=================================
project1/src/components/Navbar.js
=================================

import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <div>
      <div className="flex gap-5">
        <Link href="/">Start</Link>
        <Link href="/home">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </div>
  );
};

export default Navbar;


=> we'll import this Navbar inside layout.js


===========================
project1/src/app/layout.js
===========================

import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar/>
        {children}</body>
    </html>
  );
}



=> If we create a Home.js inside the `about` folder, and then go to localhost:3000/about, we will not see the Home component. This is because Next.js uses the file name `page.js` to determine the route. we can import `Home` inside `page.js` and use it there to render the Home component.

===============================
project1/src/app/about/Home.js
===============================
import React from 'react'

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home

===============================
project1/src/app/about/page.js
===============================
import React from 'react';
import Home from './Home';

const page = () => {
  return (
    <div>
        <h1>This is about page element</h1>
        <Home />
    </div>
  )
}

export default page






=> This entire process is server side rendering, for example, when we import `useState` and try to use it inside the `page.js` component, it will not work as expected because `useState` is a client-side hook. To use client-side hooks like `useState`, `useEffect`, etc., we need to create a client component by adding `"use client";` at the top of the file.


===============================
project1/src/app/home/page.js
===============================
import React, { useState } from 'react';

const page = () => {

  const [count, setCount] = useState(0);
  

  return (
    <div>
      <h1>This is home page element</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default page;


=> here, we are using the `useState` hook inside the `page.js` component, which is a client-side feature. This will show error on my browser if we don't mark this component as a client component by adding `"use client";` at the top of the file.



===============================
project1/src/app/home/page.js
===============================

"use client";
import React, { useState } from 'react';

const page = () => {

  const [count, setCount] = useState(0);
  

  return (
    <div>
      <h1>This is home page element</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default page;


=> till now, we got that the `page.js` is element and the folder name is the path. Routing is happening in Next.js based on the folder structure inside the `app` directory. So the `app` folder is base URL.


=> Now, lets talk about dynamic routing in NextJs

here , we have created two `dynamic routes` under the `home` folder, named `1` and `2`. These correspond to the URLs `/home/1` and `/home/2` respectively. but if we type `/home/3`, it will not work because we haven't created a route for `3`. To handle such cases dynamically, we can use square brackets to create a dynamic route, like `[id]`.


===============================
project1/src/app/home/[id]/page.js
===============================
import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is common page jisme dynamic id aayegi</h1>
    </div>
  )
}

export default page


=> Here, we have created a dynamic route using `[id]`. This means that any URL matching the pattern `/home/{id}` will be handled by this page. For example, `/home/1`, `/home/2`, `/home/3`, etc., will all render this page, and we can access the dynamic `id` inside the component if needed.

===============================
project1/src/app/home/[id]/page.js
===============================

import React from 'react'

const page = async ({params}) => {
    let {id} = await params;
  return (
    <div>
        <h1>This is common page jisme dynamic id aayegi {id}</h1>
    </div>
  )
}

export default page


=> now, just like previous project where we have created layouts , they were authLayouts which had login and register & in  the mainLayout we had Home page. Similarly, in this project, we can create different layouts for different sections of our application to maintain a consistent structure and design across multiple pages.

atfirst, we will create a `authLayout` folder inside the `app` directory and then create a `layout.js` and `page.js` inside it. The `layout.js` will define the common structure for all pages under the `authLayout`, and the `page.js` will be the actual content for the auth layout page.

===================================
project1/src/app/authLayout/page.js
===================================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>Auth Layout Page</h1>
    </div>
  )
}

export default page


=====================================
project1/src/app/authLayout/layout.js
=====================================

import React from 'react';

const layout = ({ children }) => {
  return (
    <div>
      <html lang="en" className={`h-full antialiased`}>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </div>
  );
};

export default layout;



=========================================
project1/src/app/authLayout/login/page.js
=========================================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is login Page</h1>
    </div>
  )
}

export default page


=========================================
project1/src/app/authLayout/register/page.js
=========================================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is register Page</h1>
    </div>
  )
}

export default page


=> Now, when we go to browser and navigate to `localhost:3000/authLayout` we will see on the screen:

Auth Layout Page


similarly, when we go to `localhost:3000/authLayout/login` we wiil see on the screen::

This is login Page



similarly, when we go to `localhost:3000/authLayout/register` we wiil see on the screen::

This is register Page


now, inside the component folder , we will create an AuthNav.js component which will contain the navigation links for the authentication pages like login and register.

===============================
project1/src/components/AuthNav.js
===============================

import React from 'react'
import Link from 'next/link'

const AuthNav = () => {
  return (
    <div>
      <Link href="/authLayout/login">Login</Link>
      <Link href="/authLayout/register">Register</Link>
    </div>
  )
}

export default AuthNav

now that we have created the `AuthNav` component, we can include it in our `authLayout` layout so that the navigation links appear on all authentication pages like login and register.

project1/src/app/authLayout/layout.js
===============================

import AuthNav from '@/components/AuthNav';
import React from 'react';

const layout = ({ children }) => {
  return (
    <div>
      <html lang="en" className={`h-full antialiased`}>
        <body className="min-h-full flex flex-col">
            <AuthNav/>
            {children}</body>
      </html>
    </div>
  );
};

export default layout;


now, when we navigate to `localhost:3000/authLayout`, we will see a Login and Register button.


=> similarly, just like `authLayout`, we have created a `mainLayout` folder inside the `app` directory. This layout groups together the `home`, `about`, and `contact` pages (and a dynamic `home/[id]` route) under one common navigation, just like we did earlier for `authLayout`.

===================================
project1/src/app/mainLayout/page.js
===================================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is the main layout page</h1>
    </div>
  )
}

export default page


========================================
project1/src/app/mainLayout/home/page.js
========================================

"use client";
import React, { useState } from 'react';

const page = () => {

  const [count, setCount] = useState(0);
  

  return (
    <div>
      <h1>This is home page element</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default page;


==============================================
project1/src/app/mainLayout/home/[id]/page.js
==============================================

import React from 'react'

const page = async ({params}) => {
    let {id} = await params;
  return (
    <div>
        <h1>This is common page jisme dynamic id aayegi {id}</h1>
    </div>
  )
}

export default page


=========================================
project1/src/app/mainLayout/about/page.js
=========================================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is about page element</h1>
    </div>
  )
}

export default page


=========================================
project1/src/app/mainLayout/about/Home.js
=========================================

import React from 'react'

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home


===========================================
project1/src/app/mainLayout/contact/page.js
===========================================

import React from 'react'

const page = () => {
  return (
    <div>
        <h1>This is contact page element</h1>
    </div>
  )
}

export default page


=> just like `AuthNav`, we created a `MainNav` component inside the `components` folder, which contains the navigation links for `home`, `about`, and `contact` pages.

=================================
project1/src/components/MainNav.js
=================================

import Link from 'next/link'
import React from 'react'

const MainNav = () => {
  return (
    <div className='flex gap-5'>
        <Link href="/mainLayout/home">
          Home
        </Link>
        <Link href="/mainLayout/about">
          About
        </Link>
        <Link href="/mainLayout/contact">
          Contact
        </Link>
    </div>
  )
}

export default MainNav


=> then we imported `MainNav` inside `mainLayout/layout.js` so that these links show up on every page under `mainLayout`, exactly like we did with `AuthNav` inside `authLayout/layout.js`.

=> while importing, i made a mistake and wrote the import path with the wrong casing:

```javascript
import MainNav from '@/components/mainNav';
```

but the actual file is named `MainNav.js` (capital `M`). On Windows this still worked earlier because the filesystem is case-insensitive, but Next.js 16 (Turbopack) does strict, case-sensitive module resolution, so the build failed with:

```
Module not found: Can't resolve '@/components/mainNav'
```

=> fixed it by matching the import's casing to the real file name:

=====================================
project1/src/app/mainLayout/layout.js
=====================================

import React from 'react';
import MainNav from '@/components/MainNav';

const layout = ({ children }) => {
  return (
    <div>
      <html lang="en" className={`h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <MainNav />
          {children}
        </body>
      </html>
    </div>
  );
};

export default layout;


**Lesson:** always match import paths to file names exactly (including case), even on Windows/macOS where it silently works, because Linux-based deployments and newer bundlers like Turbopack are case-sensitive.

**Note (still pending):** this `layout.js`, just like `authLayout/layout.js`, renders its own `<html>`/`<body>` even though the root `src/app/layout.js` already renders them. Only the root layout should contain `<html>` and `<body>` — nested layouts should just return `{children}` wrapped in a normal element (like `<div>`), otherwise it causes nested `<html>`/`<body>` tags and a hydration/DOM-nesting error.