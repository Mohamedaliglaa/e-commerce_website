import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

export default function ContactUs() {
  return (
    <>
      {/* Other sections */}

      <section id="contact" className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-8">
            Reach out to us through our social media platforms.
          </p>
          <div className="flex justify-center space-x-6 text-3xl">
            <a
              href="https://wa.me/21624096377"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:scale-110 transition-transform"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://facebook.com/YOUR_FACEBOOK_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:scale-110 transition-transform"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com/YOUR_INSTAGRAM_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:scale-110 transition-transform"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
