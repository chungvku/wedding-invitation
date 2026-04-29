import Home from "./pages/home/home";
import { metaData } from "./configs/ui";

export async function generateMetadata({ params }, parent) {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: metaData.main.title,
    openGraph: {
      images: [metaData.main.graphImage, ...previousImages],
    },
  };
}

export default function Page({ params, searchParams }) {
  // console.log(searchParams);
  return <Home />;
}
