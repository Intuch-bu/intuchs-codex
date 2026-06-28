import heroImg from "@/assets/hero.jpg";

function HeroSection() {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-[1366px] flex-col items-center justify-center gap-10 px-10 py-12 lg:flex-row lg:gap-8">
        <div className="max-w-sm text-right">
          <h1 className="text-2xl font-bold leading-tight lg:text-3xl">
            Seek Knowledge.
            <br />
            Question Everything.
          </h1>
          <p className="mt-6 text-muted-foreground">
            Development notes, competitive Warhammer 40,000 strategy, and
            observations collected along the journey.
          </p>
        </div>

        <img
          className="w-full max-w-[340px] h-auto rounded-lg object-contain"
          src={heroImg}
          alt="Hero"
        />

        <div className="max-w-sm">
          <p className="text-xs text-muted-foreground">-Author</p>
          <h2 className="mt-1 text-2xl font-bold">Intuch B</h2>
          <p className="mt-4 text-muted-foreground">
            Aspiring Full-Stack Developer
          </p>
          <p className="mt-4 text-muted-foreground">
            Curious by nature.
            <br />
            Always learning.
          </p>
          <p className="mt-4 text-muted-foreground">
            Recording projects, strategies, and hard-earned lessons for future
            reference.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
