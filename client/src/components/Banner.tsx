import image from "../images/banner.jpg";
export default function Banner() {
  return (
    <div
      className="w-full h-80 backdrop-filter-none relative"
      style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute z-10 opacity-40 top-0 left-0 w-full h-full mix-blend-screen bg-gradient-to-r from-red-500 via-yellow-400 to-pink-500"></div>
    </div>
  );
}
