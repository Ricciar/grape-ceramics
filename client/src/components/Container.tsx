// Container.tsx
import clsx from "clsx";

type Props = { className?: string; children: React.ReactNode };

export default function Container({ className, children }: Props) {
  return (
    <div
      className={clsx(
        // SÄNK sid-padding ~20px jämfört med tidigare
        // Ex: om du hade px-[30px], byt till px-[10px]
        "mx-auto w-full max-w-[1200px] px-[10px] sm:px-[16px] md:px-[20px]", 
        className
      )}
    >
      {children}
    </div>
  );
}
