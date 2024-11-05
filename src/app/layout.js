import Disk from "./component/disk";
import GlobalContext from "./context";
import "./globals.css";
import Sublayout from "./subLayout";

export default function RootLayout({ children, params, searchParams }) {
  return (
    <html lang="vi">
      <body>
        <Sublayout>
          <GlobalContext>
            <Disk />
            {children}
          </GlobalContext>
        </Sublayout>
      </body>
    </html>
  );
}
