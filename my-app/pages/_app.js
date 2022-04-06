import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Link from "next/link";
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="navbar" style={{ width: "100%" }}>
        <label
          className="navbar-toggle"
          id="js-navbar-toggle"
          htmlFor="chkToggle"
        >
          <i className="fa fa-bars"></i>
        </label>
        <Link href="/">
          <a style={{ marginLeft: "20px" }} className="neonText">
            NFT WORLD
          </a>
        </Link>
        <input type="checkbox" id="chkToggle"></input>
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
        </ul>
      </nav>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
