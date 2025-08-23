import ProductHero from "../components/ProductsSection/ProductHero"
import ProductSection from "../components/ProductsSection/ProductSection"
import Footer from "../components/footer/Footer"
import Navbar from "../components/navbar/Navbar"

const Products = () => {
  return (
    <div>
        <Navbar/>
        <ProductHero />
        <ProductSection />
        <Footer />
    </div>
  )
}

export default Products