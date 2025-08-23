import { useState, useRef, forwardRef } from 'react';
import { X, MessageCircle, Mail, Send } from 'lucide-react';
import background from '../../assets/Pink Pattern Background.jpg';


const ContactUs = forwardRef((_, ref) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Refs for input fields
  const emailNameRef = useRef(null);
  const emailSubjectRef = useRef(null);
  const emailMessageRef = useRef(null);
  const whatsappNameRef = useRef(null);
  const whatsappMessageRef = useRef(null);

  const handleEmailSubmit = () => {
    const name = emailNameRef.current?.value || '';
    const subject = emailSubjectRef.current?.value || 'Contact Form Inquiry';
    const message = emailMessageRef.current?.value || '';

    if (!name.trim() || !message.trim()) {
      alert('Please fill in your name and message');
      return;
    }

    const emailBody = `Hello,

Name: ${name}
Subject: ${subject}

Message:
${message}

Best regards,
${name}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=chincraft.hm@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(gmailUrl, '_blank');
    setIsEmailModalOpen(false);
  };

  const handleWhatsAppSubmit = () => {
    const name = whatsappNameRef.current?.value || '';
    const message = whatsappMessageRef.current?.value || '';

    const whatsappMessage = `Hello! I'm ${name}.\n\n${message}`;
    const whatsappLink = `https://wa.me/918848745252?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappLink, '_blank');
    setIsWhatsAppModalOpen(false);
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div id="contact" className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl p-8 mx-4 w-full max-w-md shadow-xl transform transition-all duration-300 scale-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      style={{ backgroundImage: `url(${background})`, backgroundSize: '60%' }}
      className="w-full from-rose-50 to-orange-50 border-y-1 border-dashed py-16 px-8 mb-8"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl handwrite-font mb-2">Get in Touch</h2>
        <p className="mb-12 text-lg tracking-tight">
          Have a special gift in mind? We'd love to create something beautiful just for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="group flex items-center bg-[#fff] justify-center gap-3 px-8 py-4 rounded-full transition-all duration-300 "
          >
            <MessageCircle size={20} />
            <span className="font-medium">WhatsApp</span>
          </button>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="group flex items-center bg-[#fff] justify-center gap-3 px-8 py-4 rounded-full transition-all duration-300"
          >
            <Mail size={20} />
            <span className="font-medium">Email</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Modal */}
      <Modal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="text-[#DD6A99]" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Send WhatsApp Message</h3>
        </div>

        <div className="space-y-4">
          <input
            ref={whatsappNameRef}
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DD6A99] focus:border-transparent"
          />
          <textarea
            ref={whatsappMessageRef}
            placeholder="Your message..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DD6A99] focus:border-transparent resize-none"
          />
          <button
            onClick={handleWhatsAppSubmit}
            className="w-full bg-[#DD6A99] hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Send Message
          </button>
        </div>
      </Modal>

      {/* Email Modal */}
      <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-[#f7ddb5]" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Send Email</h3>
        </div>

        <div className="space-y-4">
          <input
            ref={emailNameRef}
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7ddb5] focus:border-transparent"
          />
          <input
            ref={emailSubjectRef}
            type="text"
            placeholder="Subject"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7ddb5] focus:border-transparent"
          />
          <textarea
            ref={emailMessageRef}
            placeholder="Your message..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7ddb5] focus:border-transparent resize-none"
          />
          <button
            onClick={handleEmailSubmit}
            className="w-full bg-[#f7ddb5] hover:bg-[#f7ddb5] text-[#fff] py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Send Email
          </button>
        </div>
      </Modal>
    </div>
  );
});

export default ContactUs;
