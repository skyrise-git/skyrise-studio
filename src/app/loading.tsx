export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-headline text-5xl uppercase tracking-widest text-primary-foreground animate-pulse">
          SkyRise
        </h1>
        <p className="font-code text-sm uppercase tracking-wider text-muted-foreground">
          Constructing...
        </p>
      </div>
    </div>
  );
}
