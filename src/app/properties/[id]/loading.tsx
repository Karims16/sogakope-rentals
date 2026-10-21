export default function PropertyLoading() {
  return (
    <main aria-label="Loading property details" className="page-shell animate-pulse py-10">
      <div className="h-5 w-32 rounded bg-[#e7e9e2]" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="aspect-[4/3] rounded-[24px] bg-[#e7e9e2]" />
        <div className="space-y-4">
          <div className="h-12 rounded-xl bg-[#e7e9e2]" />
          <div className="h-8 w-2/3 rounded-xl bg-[#e7e9e2]" />
          <div className="h-24 rounded-xl bg-[#e7e9e2]" />
          <div className="h-12 rounded-xl bg-[#e7e9e2]" />
        </div>
      </div>
    </main>
  );
}
