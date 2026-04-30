import Hero from './Hero'
import Newsletter from './Newsletter'
import Services from './Services'
import Testimonials from './Testimonials'
import Technologies from './Technologies'
import Clients from '../clients/Clients'

const Portal = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Services />
      <Technologies />
      <Clients />
      <Testimonials />
      <Newsletter />
    </div>
  )
}

export default Portal