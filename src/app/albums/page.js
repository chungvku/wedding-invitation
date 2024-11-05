import Album from "../pages/album";

export async function generateMetadata({ params, searchParams }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Album của Hùng - Thúy`,
    openGraph: {
      images: [
        "https://res.cloudinary.com/do6sozxbo/image/upload/v1730558395/wedding5/final3.jpg",
        ...previousImages,
      ],
    },
  };
}

function Page({ params, searchParams }) {
  return <Album />;
}

export default Page;
