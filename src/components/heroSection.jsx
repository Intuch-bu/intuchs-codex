import heroImg from "@/assets/hero.png";

export function HeroSection() {
    return (
      <section className="w-full">
        <div className="mx-auto flex max-w-[1366px] flex-col items-center justify-center gap-10 px-10 py-10 lg:flex-row lg:gap-8">
          <div className="max-w-sm text-right">
            <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
              Stay Informed,
              <br />
              Stay Inspired
            </h1>
            <p className="mt-6 text-muted-foreground">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
              Inspiration and Information.
            </p>
          </div>
  
          <img className="w-[386px] h-[529px]" src={heroImg} alt="Hero" />
  
          <div className="max-w-sm">
            <p className="text-xs text-muted-foreground">-Author</p>
            <h2 className="mt-1 text-2xl font-bold">Thompson P.</h2>
            <p className="mt-4 text-muted-foreground">
              I am a pet enthusiast and freelance writer who specializes in animal
              behavior and care. With a deep love for cats, I enjoy sharing
              insights on feline companionship and wellness.
            </p>
            <p className="mt-4 text-muted-foreground">
              When I&apos;m not writing, I spends time volunteering at my local
              animal shelter, helping cats find loving homes.
            </p>
          </div>
        </div>
      </section>
    );
  }