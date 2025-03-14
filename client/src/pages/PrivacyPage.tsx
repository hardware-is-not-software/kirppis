import Layout from '../components/Layout';

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-500 mb-8">Last Updated: March 14, 2025</p>
              
              <h2>1. Introduction</h2>
              <p>
                This Privacy Policy describes how the Company Internal Marketplace ("we," "our," or "us") collects, uses, and shares information about you when you use our internal marketplace platform. This policy applies to all employees who access or use the platform.
              </p>
              <p>
                By using the platform, you agree to the collection, use, and sharing of your information as described in this Privacy Policy. If you do not agree with our policies and practices, do not use the platform.
              </p>
              
              <h2>2. Information We Collect</h2>
              <p>
                We collect several types of information from and about users of our platform, including:
              </p>
              <ul>
                <li>
                  <strong>Personal Information:</strong> Information that identifies you as an individual, such as your name, email address, department, and profile picture.
                </li>
                <li>
                  <strong>Account Information:</strong> Information related to your account, such as your username, password, account preferences, and transaction history.
                </li>
                <li>
                  <strong>Content Information:</strong> Information contained in the listings you create, including item descriptions, photographs, pricing, and location.
                </li>
                <li>
                  <strong>Communication Information:</strong> Information contained in messages you send to other users through the platform.
                </li>
                <li>
                  <strong>Usage Information:</strong> Information about how you use the platform, including access times, pages viewed, and features used.
                </li>
                <li>
                  <strong>Device Information:</strong> Information about the devices you use to access the platform, including IP address, browser type, and operating system.
                </li>
              </ul>
              
              <h2>3. How We Collect Information</h2>
              <p>
                We collect information in the following ways:
              </p>
              <ul>
                <li>
                  <strong>Directly from you:</strong> When you create an account, create listings, send messages, or otherwise interact with the platform.
                </li>
                <li>
                  <strong>Automatically:</strong> When you use the platform, we automatically collect certain information about your device and usage patterns.
                </li>
                <li>
                  <strong>From company records:</strong> We may obtain certain information about you from company records to verify your employment status and identity.
                </li>
              </ul>
              
              <h2>4. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve the platform</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with the platform</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize your experience on the platform</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <h2>5. How We Share Your Information</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul>
                <li>
                  <strong>With other users:</strong> When you create a listing or send a message, certain information (such as your name, department, and the content you provide) is visible to other users of the platform.
                </li>
                <li>
                  <strong>With service providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                </li>
                <li>
                  <strong>For legal purposes:</strong> We may share your information when we believe in good faith that disclosure is necessary to comply with a legal obligation, protect our rights or property, or protect the safety of our users or others.
                </li>
                <li>
                  <strong>With company management:</strong> We may share aggregated or de-identified information with company management for reporting and analysis purposes.
                </li>
              </ul>
              
              <h2>6. Data Security</h2>
              <p>
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our platform.
              </p>
              
              <h2>7. Data Retention</h2>
              <p>
                We will retain your personal information for as long as your account is active or as needed to provide you with the platform. We will also retain and use your personal information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
              <p>
                When you delete your account, we will delete or anonymize your personal information, unless we need to retain certain information for legitimate business or legal purposes.
              </p>
              
              <h2>8. Your Rights and Choices</h2>
              <p>
                You have certain rights and choices regarding your personal information:
              </p>
              <ul>
                <li>
                  <strong>Account Information:</strong> You can update your account information at any time by accessing your account settings on the platform.
                </li>
                <li>
                  <strong>Communications:</strong> You can opt out of receiving certain notifications by adjusting your notification preferences in your account settings.
                </li>
                <li>
                  <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies.
                </li>
                <li>
                  <strong>Delete Your Account:</strong> You can delete your account at any time by contacting the platform administrators.
                </li>
              </ul>
              
              <h2>9. Changes to Our Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the platform. The date the Privacy Policy was last revised is identified at the top of the page.
              </p>
              
              <h2>10. Contact Information</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact the platform administrators at privacy@marketplace.com.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                By using our platform, you acknowledge that you have read and understood this Privacy Policy and agree to our collection, use, and sharing of your information as described.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage; 