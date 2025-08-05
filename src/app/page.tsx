import Image from "next/image";
import MainUI from "@/components/main";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <MainUI />
      <Footer />
    </div>
  );
}
