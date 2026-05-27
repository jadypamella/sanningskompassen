import logoUrl from "@/assets/logo-main.png";

export function CompassMark({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="Sanningskompassen patch"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
