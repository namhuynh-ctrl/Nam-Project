import Image from "next/image";

interface AppLogoProps {
  alt?: string;
  className?: string;
}

export function AppLogo({ alt = "Quiz Intelligence", className = "" }: AppLogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt={alt}
      width={832}
      height={472}
      priority
      className={className}
    />
  );
}
