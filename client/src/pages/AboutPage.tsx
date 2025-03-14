import Layout from '../components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h1 className="text-3xl font-bold">About Our Marketplace</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Welcome to our company's internal marketplace, a platform designed to foster sustainability and community within our organization. 
              Founded in 2025, this initiative was born from our commitment to reduce waste and create a circular economy within our workplace.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              What started as a simple idea to help employees find new homes for unused items has grown into a vibrant community marketplace 
              where team members can buy, sell, and exchange goods with ease and confidence.
            </p>
            
            <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Our Mission</h3>
                <p className="text-gray-600">
                  To create a sustainable, user-friendly platform that connects employees and reduces our collective environmental footprint.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="text-green-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Our Values</h3>
                <p className="text-gray-600">
                  Sustainability, community, trust, and simplicity guide everything we do on our marketplace platform.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="text-purple-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Our Promise</h3>
                <p className="text-gray-600">
                  We're committed to providing a secure, transparent platform where every transaction benefits our community.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">How It Works</h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">List Your Items</h3>
                  <p className="text-gray-600">
                    Take a photo, add a description, set your price, and your item is ready for our marketplace.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">Connect With Buyers</h3>
                  <p className="text-gray-600">
                    Interested colleagues will contact you through our secure messaging system.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">Complete the Transaction</h3>
                  <p className="text-gray-600">
                    Arrange a convenient time and location within our offices to exchange the item and payment.
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Team</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our marketplace is maintained by a dedicated team of employees who volunteer their time to ensure the platform runs smoothly. 
              From IT support to community management, these individuals are passionate about creating a sustainable workplace.
            </p>
            
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Join Our Community</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Whether you're looking to declutter your workspace, find a great deal, or simply reduce waste, our marketplace is for you. 
                Join thousands of your colleagues already participating in this sustainable initiative.
              </p>
              <div className="flex justify-center mt-6">
                <a 
                  href="/register" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage; 