import Image from "next/image";
import soon from "@/../public/soon.svg";

const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
    <Image src={soon} alt="coming soon" className="mb-6" width={500} />
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight mb-2">
      Under Construction
    </h1>
    <p className="text-center text-muted-foreground max-w-md">
      This is just a side project, managed by a single developer. Please check
      back soon for updates!
    </p>
  </div>
);

export default ComingSoon;
