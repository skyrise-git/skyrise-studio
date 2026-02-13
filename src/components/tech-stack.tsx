const techImageSources = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pnpm/pnpm-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-plain-wordmark.svg"
];

export default function TechStack() {
  return (
    <section className="relative container mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-secondary/10 px-4 py-2 text-[11px] font-code uppercase tracking-[0.3em] text-muted-foreground">
          Core Technologies
        </span>
        <h2 className="mt-6 text-5xl md:text-7xl">Our Arsenal</h2>
        <p className="text-muted-foreground font-code mt-3 max-w-2xl mx-auto">
          A focused set of tools we use to build resilient, high-performance products.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-secondary/5 p-6 md:p-8 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" aria-hidden="true" />

        <div className="relative grid grid-cols-4 sm:grid-cols-6 md:flex md:flex-wrap md:justify-center gap-3 sm:gap-4 md:gap-6 md:overflow-visible md:pb-0">
          {techImageSources.map((src, index) => (
            <div
              key={src}
              className="group relative p-3 sm:p-4 w-full aspect-square flex items-center justify-center bg-secondary/10 rounded-lg border border-transparent hover:border-primary/50 transition-all duration-300 animate-in fade-in zoom-in-95"
              style={{ animationDelay: `${500 + index * 30}ms`, animationFillMode: 'both' }}
            >
              <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-40" aria-hidden="true" />
              <img
                src={src}
                alt={`Tech icon ${index + 1}`}
                className="w-12 h-12 object-contain transition-all duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
