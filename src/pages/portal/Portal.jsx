import { Helmet } from "react-helmet-async";

import Hero from './Hero'
import Newsletter from './Newsletter'
import Services from './Services'
import Testimonials from './Testimonials'
import Technologies from './Technologies'
import Clients from '../clients/Clients'

const Portal = () => {
  return (
    <>
      <Helmet>
        <title> About |Software Development Company in Coimbatore </title>

        <meta
          name="description"
          content="Mecatronix is a software development company in Coimbatore offering web development, ecommerce websites, mobile apps, and scalable digital solutions."
        />

        <meta
          name="keywords"
          content="software development company in Coimbatore, web development company in Coimbatore, ecommerce website development, mobile app development, Mecatronix"
        />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mecatronix Software Development" />

        <link rel="canonical" href="https://www.mecatronix.one" />

        <meta property="og:title" content="Software Development Company in Coimbatore | Mecatronix" />
        <meta
          property="og:description"
          content="Web development, ecommerce websites, mobile apps, and scalable digital solutions by Mecatronix."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mecatronix.one" />
      </Helmet>

      <div className="overflow-hidden">
        <Hero />
        <Services />
        <Technologies />
        <Clients />
        <Testimonials />
        <Newsletter />
      </div>
    </>
  )
}

export default Portal