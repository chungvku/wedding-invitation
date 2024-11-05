import Wish from "../pages/wish";

export async function generateMetadata({ params, searchParams }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Tất cả lời chúc dành cho Hùng - Thúy`,
    openGraph: {
      images: [
        "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/am11.jpg",
        ...previousImages,
      ],
    },
  };
}
function Page() {
  return <Wish />;
}

export default Page;
