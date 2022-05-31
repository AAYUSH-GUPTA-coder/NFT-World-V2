import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Link from "next/link";
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav
        className="navbar"
        style={{
          width: "100%",
          border: "2px solid white",
          background: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <Link href="/">
          <a style={{ marginLeft: "20px" }} className="neonText">
            NFT SEA
          </a>
        </Link>

        <ul className="main-nav" id="js-menu">
          <li>
            <Link href="/">
              <a className="nav-links">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/create-nft">
              <a className="nav-links">Sell NFT</a>
            </Link>
          </li>
          <li>
            <Link href="/my-nfts">
              <a className="nav-links"> My NFTs</a>
            </Link>
          </li>

          <li>
            <Link href="/dashboard">
              <a className="nav-links"> Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/News">
              <a className="nav-links"> News</a>
            </Link>
          </li>
        </ul>
      </nav>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
