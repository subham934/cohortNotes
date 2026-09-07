import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useContext } from 'react';
import { useRef } from 'react';
import { NavbarContext } from '../../context/NavContext';

const FullScreenNav = () => {
  const fullNavLinksRef = useRef(null);

  const fullScreenRef = useRef(null);

  const [navbarOpen, setNavbarOpen] = useContext(NavbarContext);

  function gsapAnimation() {
    const tl = gsap.timeline();
    // Instantly show container and reset states before animating
    tl.set('.fullscreennav', { display: 'block' });
    tl.set('.navlink', { opacity: 0 });
    tl.set('.stairing', { opacity: 1, height: 0 });
    // Stairs rise up (colored stripes — the transition effect)
    tl.to('.stairing', {
      height: '100%',
      duration: 0.55,
      stagger: { amount: -0.25 },
      ease: 'power3.out',
    });
    // All stripes fade out together smoothly → black background revealed
    tl.to('.stairing', { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
    // Fade in header (cross + logo) on the black background
    tl.to('.navlink', { opacity: 1, duration: 0.35, ease: 'power2.out' });
    // Then reveal links
    tl.to('.link', {
      opacity: 1,
      rotateX: 0,
      duration: 0.4,
      stagger: { amount: 0.25 },
      ease: 'power2.out',
    }, '-=0.15');
  }

  function gsapAnimationReverse() {
    const tl = gsap.timeline();
    // Hide header and links simultaneously
    tl.to('.navlink', { opacity: 0, duration: 0.25, ease: 'power2.in' });
    tl.to('.link', {
      opacity: 0,
      rotateX: 90,
      duration: 0.25,
      stagger: { amount: 0.1 },
      ease: 'power2.in',
    }, '<');
    // All stripes fade back in together smoothly → covers the black background
    tl.set('.stairing', { height: '100%' });
    tl.to('.stairing', { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
    // Then retract stairs
    tl.to('.stairing', {
      height: 0,
      duration: 0.5,
      stagger: { amount: 0.15 },
      ease: 'power3.inOut',
    });
    // Finally hide the container
    tl.set('.fullscreennav', { display: 'none' });
  }

  useGSAP(
    function () {
      // Skip on initial render — navbarOpen starts false, don't run reverse animation
      if (!navbarOpen && !fullScreenRef.current._gsapAnimated) return;
      if (navbarOpen) {
        fullScreenRef.current._gsapAnimated = true;
        gsapAnimation();
      } else {
        gsapAnimationReverse();
      }
    },
    { dependencies: [navbarOpen] }
  );
  return (
    <div
      ref={fullScreenRef}
      id="fullscreennav"
      className="fullscreennav hidden h-screen bg-black text-white overflow-x-hidden z-50 w-full absolute"
    >
      <div className="h-screen w-full fixed">
        <div className="h-full w-full flex">
          <div className="stairing h-0 w-1/5 bg-[#D3FD50]"></div>
          <div className="stairing h-0 w-1/5 bg-[#354110]"></div>
          <div className="stairing h-0 w-1/5 bg-[#D3FD50]"></div>
          <div className="stairing h-0 w-1/5 bg-[#354110]"></div>
          <div className="stairing h-0 w-1/5 bg-[#D3FD50]"></div>
        </div>
      </div>
      <div ref={fullNavLinksRef} className="relative">
        <div className="navlink flex w-full justify-between p-5 items-start" style={{opacity: 0}}>
          <div className="">
            <div className="w-36">
            <svg
              className="w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 103 44"
            >
              <path
                fill="white"
                fillRule="evenodd"
                d="M35.1441047,8.4486911 L58.6905011,8.4486911 L58.6905011,-1.3094819e-14 L35.1441047,-1.3094819e-14 L35.1441047,8.4486911 Z M20.0019577,0.000230366492 L8.83414254,25.3433089 L18.4876971,25.3433089 L29.5733875,0.000230366492 L20.0019577,0.000230366492 Z M72.5255345,0.000691099476 L72.5255345,8.44846073 L94.3991559,8.44846073 L94.3991559,16.8932356 L72.5275991,16.8932356 L72.5275991,19.5237906 L72.5255345,19.5237906 L72.5255345,43.9274346 L102.80937,43.9274346 L102.80937,35.4798953 L80.9357483,35.4798953 L80.9357483,25.3437696 L94.3996147,25.3428482 L94.3996147,16.8953089 L102.80937,16.8953089 L102.80937,0.000691099476 L72.5255345,0.000691099476 Z M-1.30398043e-14,43.9278953 L8.78642762,43.9278953 L8.78642762,0.0057591623 L-1.30398043e-14,0.0057591623 L-1.30398043e-14,43.9278953 Z M58.6849955,8.4486911 L43.1186904,43.9274346 L52.3166592,43.9274346 L67.9877996,8.4486911 L58.6849955,8.4486911 Z M18.4688864,25.3437696 L26.7045278,43.9278953 L36.2761871,43.9278953 L28.1676325,25.3375497 L18.4688864,25.3437696 Z"
              ></path>
            </svg>
          </div>
        </div>

        <div onClick={()=>{
          setNavbarOpen(false)
        }} className="h-32 w-32 relative cursor-pointer">
          <div className="h-44 absolute w-1 -rotate-45 origin-top bg-favColor"></div>
          <div className="h-44 absolute w-1 right-0 rotate-45 origin-top bg-favColor"></div>
          <div></div>
        </div>
      </div>

      <div className=" py-40">
        <div className="link origin-top relative border-t border-white">
          <h1 className="font-[font2] text-[8vw] text-center leading-[0.8] pt-5 uppercase">
            Projects
          </h1>
          <div className="moveLink absolute text-black flex top-0 bg-favColor">
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout voir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/Thumbnail.png"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout voir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/PJC_SiteK72_Thumbnail_640x290.jpg?w=640&h=290&s=ac50a70feaaa2601b3aacad544c6045b"
                alt=""
              />
            </div>
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout voir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/Thumbnail.png"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout voir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/PJC_SiteK72_Thumbnail_640x290.jpg?w=640&h=290&s=ac50a70feaaa2601b3aacad544c6045b"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="link origin-top relative border-t border-white">
          <h1 className="font-[font2] text-[8vw] text-center leading-[0.8] pt-5 uppercase">
            Agence
          </h1>
          <div className="moveLink absolute text-black flex top-0 bg-favColor">
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout savoir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/badge.avif"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout savoir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/blank_copie_2.jpg"
                alt=""
              />
            </div>
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout savoir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/badge.avif"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour tout savoir
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/PJC_SiteK72_Thumbnail_640x290.jpg?w=640&h=290&s=ac50a70feaaa2601b3aacad544c6045b"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="link origin-top relative border-t border-white">
          <h1 className="font-[font2] text-[8vw] text-center leading-[0.8] pt-5 uppercase">
            Contact
          </h1>
          <div className="moveLink absolute text-black flex top-0 bg-favColor">
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour envoyer un fax
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/camera.avif"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour envoyer un fax
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/contact.gif"
                alt=""
              />
            </div>
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour envoyer un fax
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/camera.avif"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                pour envoyer un fax
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/contact.gif"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="link origin-top relative border-y border-white">
          <h1 className="font-[font2] text-[8vw] text-center leading-[0.8] pt-5 uppercase">
            Blogs
          </h1>
          <div className="moveLink absolute text-black flex top-0 bg-favColor">
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                lire les articles
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/K72_article_ChatGPT_blogue.jpg"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                lire les articles
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/hand.png"
                alt=""
              />
            </div>
            <div className="flex moveX items-center">
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                lire les articles
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/K72_article_ChatGPT_blogue.jpg"
                alt=""
              />
              <h2 className="font-[font2] whitespace-nowrap text-[8vw] text-center leading-[0.8] pt-6 uppercase">
                lire les articles
              </h2>
              <img
                className="w-72 rounded-full shrink-0 h-20 -mb-3 object-cover"
                src="./image/hand.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FullScreenNav;
