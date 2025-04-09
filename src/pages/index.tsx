import CityGallery from "@/components/cityTemplate";
import SelectCity from "@/components/selectCity";

export default function Home() {
  return (
    <>
    <SelectCity />
    <CityGallery city="warsaw" />
    </>
  );
}
