import Layout from '../components/Layout';

const TermsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-500 mb-8">Last Updated: June 1, 2023</p>
              
              <h2>1. Introduction</h2>
              <p>
                Welcome to the Company Internal Marketplace. These Terms of Service ("Terms") govern your access to and use of our internal marketplace platform, including any content, functionality, and services offered on or through the platform.
              </p>
              <p>
                By accessing or using the platform, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the platform.
              </p>
              
              <h2>2. Eligibility</h2>
              <p>
                The platform is available only to current employees of the Company. You must maintain an active employment status to continue using the platform. Upon termination of your employment, your account will be deactivated, and you will no longer have access to the platform.
              </p>
              
              <h2>3. User Accounts</h2>
              <p>
                To access the platform, you must create an account using your company email address. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p>
                You agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information when creating your account</li>
                <li>Update your information as necessary to keep it accurate and current</li>
                <li>Notify the platform administrators immediately of any unauthorized access to or use of your account</li>
                <li>Ensure that you log out of your account at the end of each session</li>
              </ul>
              
              <h2>4. Listing Items</h2>
              <p>
                When listing items for sale on the platform, you agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information about the item, including its condition, features, and any defects</li>
                <li>Set a reasonable price for the item based on its condition and market value</li>
                <li>Upload clear photographs that accurately represent the item</li>
                <li>Only list items that you legally own and have the right to sell</li>
                <li>Not list any prohibited items as defined in Section 5</li>
              </ul>
              
              <h2>5. Prohibited Items</h2>
              <p>
                The following items may not be listed or sold on the platform:
              </p>
              <ul>
                <li>Illegal items or substances</li>
                <li>Weapons, firearms, or ammunition</li>
                <li>Hazardous materials</li>
                <li>Counterfeit or stolen goods</li>
                <li>Items that infringe on intellectual property rights</li>
                <li>Adult content or materials</li>
                <li>Alcohol, tobacco, or drugs</li>
                <li>Live animals</li>
                <li>Company property without proper authorization</li>
                <li>Any items prohibited by company policy</li>
              </ul>
              
              <h2>6. Transactions</h2>
              <p>
                The platform serves as a venue for employees to connect and arrange transactions. The Company is not a party to any transaction between users and does not transfer legal ownership of items from the seller to the buyer.
              </p>
              <p>
                Users agree to:
              </p>
              <ul>
                <li>Conduct all financial transactions outside the platform</li>
                <li>Meet in person at company premises to complete transactions</li>
                <li>Inspect items before completing a purchase</li>
                <li>Honor commitments to buy or sell items as agreed</li>
              </ul>
              
              <h2>7. User Conduct</h2>
              <p>
                When using the platform, you agree not to:
              </p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others, including privacy and intellectual property rights</li>
                <li>Use the platform to harass, abuse, or harm another person</li>
                <li>Use the platform for any unauthorized advertising or solicitation</li>
                <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Engage in price gouging or deceptive practices</li>
              </ul>
              
              <h2>8. Intellectual Property</h2>
              <p>
                The platform and its original content, features, and functionality are owned by the Company and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              
              <h2>9. Disclaimer of Warranties</h2>
              <p>
                The platform is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. The Company disclaims all warranties, including but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              
              <h2>10. Limitation of Liability</h2>
              <p>
                In no event shall the Company be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.
              </p>
              
              <h2>11. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless the Company, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the platform.
              </p>
              
              <h2>12. Termination</h2>
              <p>
                The Company may terminate or suspend your account and access to the platform immediately, without prior notice or liability, for any reason, including but not limited to, a breach of these Terms.
              </p>
              
              <h2>13. Changes to Terms</h2>
              <p>
                The Company reserves the right to modify or replace these Terms at any time. If a revision is material, the Company will provide at least 30 days' notice before the new terms take effect. What constitutes a material change will be determined at the Company's sole discretion.
              </p>
              
              <h2>14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the state where the Company is headquartered, without regard to its conflict of law provisions.
              </p>
              
              <h2>15. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact the platform administrators at marketplace-admin@company.com.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                By using our platform, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage; 