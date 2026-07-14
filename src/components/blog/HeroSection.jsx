import heroImg from "@/assets/hero.jpg";
import { SITE_AUTHOR } from "@/constants/site";

function HeroSection() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex max-w-[1366px] flex-col items-stretch gap-10 px-4 py-10 sm:px-6 md:px-10 lg:flex-row lg:items-center lg:gap-[60px] lg:py-[60px]">
        <div className="w-full flex-1 text-left lg:text-right">
          <h1 className="text-[40px] font-semibold leading-[48px] text-brown-600 md:text-[52px] md:leading-[60px]">
            Stay Informed, Stay Inspired
          </h1>
          <p className="mt-6 text-base font-medium leading-6 text-brown-400">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
            Inspiration and Information.
          </p>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-[343px] overflow-hidden rounded-2xl sm:h-[529px] sm:max-w-[386px]">
          <img
            className="size-full object-cover"
            src={heroImg}
            alt={SITE_AUTHOR.name}
          />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(190,187,177,0.25)]" />
        </div>

        <div className="w-full flex-1 text-left">
          <p className="text-xs font-medium leading-5 text-brown-400">-Author</p>
          <h2 className="mt-1 text-2xl font-semibold leading-8 text-brown-500">
            {SITE_AUTHOR.name}
          </h2>
          <div className="mt-3 space-y-4 text-base font-medium leading-6 text-brown-400">
            <p>{SITE_AUTHOR.bio}</p>
            <p>{SITE_AUTHOR.bioExtra}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
