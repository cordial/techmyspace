import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-4 py-24">
      <p className="font-display text-xs tracking-[0.22em] text-yellow uppercase">404</p>
      <h1 className="font-display mt-4 text-5xl tracking-tight text-cream md:text-7xl">That page is not on the job sheet.</h1>
      <Link href="/" className="mt-8 inline-flex w-fit bg-yellow px-5 py-3 font-display text-sm tracking-[0.14em] text-ink uppercase">
        Back home
      </Link>
    </div>
  );
}
