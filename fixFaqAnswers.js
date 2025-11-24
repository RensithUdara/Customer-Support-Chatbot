const fs = require('fs');
const path = require('path');

// Read the current data file
const dataPath = path.join(__dirname, 'data', 'comprehensiveData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Define proper answer templates for each category
const categoryAnswers = {
    "Orders & Shipping": [
        "Standard delivery takes 3–5 working days for most areas.",
        "Express delivery (1–2 days) is available for selected cities.",
        "You can track your order using the tracking link sent via email or SMS.",
        "Please contact support with your order ID for status updates.",
        "Currently, we only ship within Sri Lanka.",
        "Our courier will attempt delivery twice and contact you to reschedule.",
        "Address changes are possible only before the order is shipped.",
        "Same-day delivery is available for selected items and areas.",
        "Shipping charges depend on product weight and delivery location.",
        "Orders can be cancelled before dispatch from our warehouse.",
        "We deliver to all major cities and towns in Sri Lanka.",
        "Weekend delivery is available for premium shipping options.",
        "You can schedule delivery between 9 AM - 6 PM on working days.",
        "Report damaged items within 24 hours with photos for replacement.",
        "Gift wrapping service is available for Rs. 150 per item.",
        "Yes, you can track multiple orders using your account dashboard.",
        "We use DHL, FedEx, and local courier services for delivery.",
        "SMS and email updates are sent at each delivery stage.",
        "Order modifications are possible within 2 hours of placing the order.",
        "Maximum order weight limit is 50kg per shipment.",
        "Bulk orders (10+ items) get 15% discount on shipping charges.",
        "Store pickup is available from our Colombo and Kandy outlets.",
        "After two failed delivery attempts, items are returned to warehouse.",
        "We don't deliver to PO boxes; physical addresses only.",
        "Multiple orders can be combined if placed within same day."
    ],

    "Returns & Refunds": [
        "Items may be returned within 14 days if unused and in original packaging.",
        "Log in → My Orders → Select order → Request return.",
        "Refunds are processed within 3–7 working days after inspection.",
        "Cosmetics, undergarments, and clearance products are non-returnable.",
        "Return shipping is free for defective items; otherwise customer pays.",
        "Yes, exchanges are allowed for size or color variations.",
        "Report within 48 hours with photos; replacement will be arranged.",
        "Shipping fees are refunded only if the item was defective.",
        "Refunds are issued to your original payment method.",
        "Original packaging and accessories are required for return approval.",
        "Electronics have a 7-day return policy with original warranty cards.",
        "Refund processing takes 5-10 business days depending on payment method.",
        "Sale items can be returned if they are defective or damaged.",
        "Items must be in new, unused condition with all tags attached.",
        "Personalized or custom-made items cannot be returned.",
        "Yes, items bought with discount codes are eligible for return.",
        "Order receipt can be found in your email or account dashboard.",
        "Late returns beyond 14 days are subject to manager approval.",
        "No restocking fees are charged for standard returns.",
        "Each item must be returned separately with individual return requests.",
        "Returns can be processed at any of our physical store locations.",
        "Rejected returns are re-shipped to customer at their expense.",
        "Store credit is available as an alternative to cash refunds.",
        "Return requests can be cancelled before item pickup.",
        "Returned items are inspected and either restocked or disposed."
    ],

    "Payments": [
        "We accept credit/debit cards, bank transfers, and Cash on Delivery.",
        "COD is available only in selected districts.",
        "Check your card details, balance, or try another payment method.",
        "EMI is available on orders above Rs. 25,000.",
        "Yes, major mobile wallets like eZ Cash and mCash are supported.",
        "All payments are encrypted and PCI-DSS compliant.",
        "Currently split payments are not supported.",
        "No additional fees for card payments.",
        "An invoice is emailed once your order is confirmed.",
        "High-value items require prepaid payment for security reasons.",
        "Cryptocurrency payments are not currently accepted.",
        "International cards are accepted with additional verification.",
        "Payment processing is instant for cards and wallets.",
        "Payment methods can be saved securely in your account.",
        "Buy now, pay later options available through Koko and mintpay.",
        "Failed payments can be retried or use alternative payment method.",
        "Only one payment method can be used per order.",
        "Card details are never stored on our servers.",
        "SSL encryption and tokenization protect all transactions.",
        "Payment receipts are available in your account and via email.",
        "Corporate payment options include bank transfers and purchase orders.",
        "Payment refunds follow the same timeline as regular refunds.",
        "Payment method changes are not possible after order confirmation.",
        "Foreign transaction fees may apply for international cards.",
        "We accept LKR only; USD payments are converted automatically."
    ],

    "Account": [
        "Use 'Forgot Password' link on login page to reset your password.",
        "Email address can be changed in Account Settings after verification.",
        "Account deletion requests can be made through customer support.",
        "Check your internet connection and clear browser cache.",
        "Phone number can be updated in Profile → Contact Information.",
        "Yes, you can save multiple delivery addresses in your account.",
        "Subscribe to newsletters in Account Settings → Communication Preferences.",
        "Past orders are available in My Account → Order History.",
        "All notifications can be managed in Account Settings → Notifications.",
        "Update profile information in Account Settings → Personal Information.",
        "Social media linking is available in Account Settings → Connected Accounts.",
        "Username changes require contacting customer support.",
        "We store name, email, phone, address, and order history securely.",
        "Multiple accounts with same email are not permitted.",
        "Account verification is done via email confirmation link.",
        "Check spam folder or contact support for missing verification emails.",
        "Account merging is not available; use primary account for all orders.",
        "Two-factor authentication can be enabled in Security Settings.",
        "Report suspected account breaches immediately to security team.",
        "Account can be temporarily deactivated through customer support.",
        "Data export is available in Account Settings → Download My Data.",
        "Privacy settings control data sharing and marketing communications.",
        "Email preferences can be customized in Communication Settings.",
        "Account issues should be reported through Help Center → Contact Support.",
        "Deleted accounts cannot be recovered; create new account if needed."
    ],

    "Product & Warranty": [
        "Most products include 1-year manufacturer warranty.",
        "Submit warranty claims with purchase receipt and product serial number.",
        "All products are brand new unless marked as refurbished.",
        "Refurbished products are clearly labeled with separate warranty terms.",
        "Installation services are available for appliances and electronics.",
        "Out-of-stock items can be pre-ordered with expected restock dates.",
        "Product images are accurate; actual colors may vary slightly.",
        "Limited customization available for select products.",
        "Use product comparison tool on category pages.",
        "Price protection policy covers 7 days post-purchase.",
        "Customer reviews and ratings are available on all product pages.",
        "Detailed specifications are listed on each product page.",
        "User manuals are downloadable from product pages or support section.",
        "Products meet international safety standards and local certifications.",
        "Showroom visits can be arranged for high-value items.",
        "Product demonstrations available at our experience centers.",
        "Unsatisfactory products can be returned within 14-day period.",
        "Product upgrades depend on manufacturer trade-in programs.",
        "Maintenance services available through authorized service centers.",
        "Product recalls are communicated via email and website notifications.",
        "Replacement parts available through manufacturer's service network.",
        "Extended warranties can be purchased within 30 days of purchase.",
        "Training resources include video tutorials and user guides.",
        "Satisfaction guarantee allows returns within 14 days.",
        "Technical documentation available for professional products."
    ],

    "Customer Support": [
        "24/7 customer support available via phone, email, and live chat.",
        "Average response time is 2-4 hours for email queries.",
        "Live chat support available 9 AM - 9 PM daily.",
        "Support tickets are tracked and updated via email.",
        "Phone support: +94 11 234 5678 (Sri Lanka hotline).",
        "Email support: help@yourstore.lk for general inquiries.",
        "Priority support available for premium customers.",
        "Multilingual support in Sinhala, Tamil, and English.",
        "Support team consists of trained product specialists.",
        "Remote assistance available for technical products.",
        "Support history is maintained in your account dashboard.",
        "Emergency support available for critical business customers.",
        "Self-service options include FAQ, video tutorials, and guides.",
        "Community forums available for peer-to-peer support.",
        "Support satisfaction surveys sent after issue resolution.",
        "Escalation process available for unresolved complex issues.",
        "Screen sharing support available for technical troubleshooting.",
        "Support appointments can be scheduled for detailed assistance.",
        "Callback service available during peak hours.",
        "Support quality monitored and improved continuously.",
        "Specialized support teams for different product categories.",
        "Support case status can be tracked online.",
        "Video call support available for premium customers.",
        "Support documentation updated regularly.",
        "Feedback and suggestions welcomed through support channels."
    ],

    "Technical Issues": [
        "Website technical issues usually resolve within 30 minutes.",
        "Clear browser cache and cookies if pages load slowly.",
        "Try different browser or incognito mode for login issues.",
        "Mobile app issues can be resolved by updating to latest version.",
        "Payment gateway errors require trying alternative payment method.",
        "Search functionality problems may need browser refresh.",
        "Image loading issues often resolve with stable internet connection.",
        "Account sync issues require logging out and back in.",
        "Checkout errors should be reported with browser and device info.",
        "App crashes should be reported through app store feedback.",
        "Email delivery issues may require checking spam folders.",
        "Password reset links expire after 24 hours.",
        "Two-factor authentication issues require support assistance.",
        "API errors affect third-party integrations temporarily.",
        "Database maintenance causes brief service interruptions.",
        "SSL certificate issues affect secure connections rarely.",
        "CDN problems may cause slow loading in specific regions.",
        "Session timeout occurs after 30 minutes of inactivity.",
        "Browser compatibility issues affect older browser versions.",
        "JavaScript errors require enabling scripts in browser settings.",
        "Cookie acceptance required for full website functionality.",
        "Pop-up blockers may prevent important notifications.",
        "Ad blockers can interfere with payment processing.",
        "Network connectivity issues affect real-time features.",
        "Server maintenance scheduled during low-traffic hours."
    ],

    "Promotions & Offers": [
        "Current promotions are displayed on homepage and category pages.",
        "Newsletter subscribers get early access to special offers.",
        "Seasonal sales include Avurudu, Christmas, and Back-to-School.",
        "Student discounts available with valid university ID.",
        "Senior citizen discounts (10%) for customers above 60 years.",
        "Bulk purchase discounts start from 10 items or more.",
        "Loyalty program points can be redeemed for discounts.",
        "First-time customer discount of 15% with code WELCOME15.",
        "Free shipping promotions on orders above Rs. 10,000.",
        "Flash sales announced on social media and mobile app.",
        "Referral program offers Rs. 500 for each successful referral.",
        "Birthday month customers receive special 20% discount codes.",
        "Corporate discounts available for business customers.",
        "Combo deals available on related product purchases.",
        "Cashback offers available through partner payment methods.",
        "Festival special offers during major holidays.",
        "Clearance sales at end of each season.",
        "Pre-order discounts available for upcoming products.",
        "Trade-in programs offer additional discounts on upgrades.",
        "Social media contests offer prizes and discount codes.",
        "Email exclusive offers for premium subscribers.",
        "App-only deals available through mobile application.",
        "Limited-time offers with countdown timers.",
        "Bundle discounts for purchasing multiple categories.",
        "VIP customer early access to major sales events."
    ],

    "Security & Privacy": [
        "All personal data is encrypted using industry-standard protocols.",
        "We comply with international data protection standards.",
        "Personal information is never shared without explicit consent.",
        "Account security includes password encryption and secure sessions.",
        "Payment data is processed through PCI-DSS certified systems.",
        "Regular security audits ensure system integrity.",
        "Privacy policy details data collection and usage practices.",
        "Customers can request data deletion under privacy regulations.",
        "Secure browsing indicated by HTTPS and SSL certificates.",
        "Two-factor authentication adds extra account security.",
        "Suspicious account activity triggers automatic alerts.",
        "Data breach notifications sent within 72 hours if required.",
        "Third-party integrations vetted for security compliance.",
        "Regular software updates maintain security patches.",
        "Employee access to customer data is strictly controlled.",
        "Security training provided to all staff members.",
        "Incident response plan activated for security breaches.",
        "Customer data backup maintained with encryption.",
        "Privacy settings allow control over data sharing preferences.",
        "Security questions add additional account protection.",
        "Login attempt monitoring prevents unauthorized access.",
        "Device tracking helps identify suspicious login patterns.",
        "Secure API connections protect data transmission.",
        "Regular penetration testing identifies vulnerabilities.",
        "Compliance with GDPR and local privacy laws maintained."
    ],

    "Mobile App": [
        "Mobile app available for Android and iOS devices.",
        "Download from Google Play Store or Apple App Store.",
        "App features include shopping, tracking, and account management.",
        "Push notifications for order updates and special offers.",
        "App-only exclusive deals and early access to sales.",
        "Offline browsing for previously viewed products.",
        "One-tap ordering for frequently purchased items.",
        "Biometric login available for supported devices.",
        "App synchronizes with website account seamlessly.",
        "Camera search allows finding products by taking photos.",
        "Barcode scanner for quick product lookup.",
        "Voice search functionality for hands-free browsing.",
        "Dark mode available for comfortable night browsing.",
        "App size optimized for low storage devices.",
        "Regular updates add new features and improvements.",
        "In-app customer support through chat and call.",
        "Wishlist syncing across devices.",
        "Location-based store finder and inventory check.",
        "App performance optimized for slow internet connections.",
        "Accessibility features for users with disabilities.",
        "Multi-language support matching website options.",
        "App ratings and reviews help improve functionality.",
        "Beta testing program for early feature access.",
        "App troubleshooting guide in help section.",
        "Uninstalling app retains account data safely."
    ]
};

// Function to get random answer from category
function getCategoryAnswer(category, questionIndex) {
    const answers = categoryAnswers[category];
    if (!answers) {
        return "Contact support for detailed assistance.";
    }
    return answers[questionIndex % answers.length];
}

// Update FAQ answers to match their categories
console.log('Updating FAQ answers to match categories...');
let updatedCount = 0;

data.faqs.forEach((faq, index) => {
    const questionIndex = index % 25; // Cycle through 25 answers per category
    const newAnswer = getCategoryAnswer(faq.category, questionIndex);

    if (faq.answer !== newAnswer) {
        faq.answer = newAnswer;
        updatedCount++;
    }
});

console.log(`Updated ${updatedCount} FAQ answers to match their categories.`);

// Write the updated data back to file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
console.log('✅ All FAQ answers have been updated successfully!');
console.log(`✅ Total FAQs: ${data.faqs.length}`);
console.log(`✅ Categories with proper answers: ${Object.keys(categoryAnswers).length}`);

// Verify the update
const verification = {};
data.faqs.forEach(faq => {
    if (!verification[faq.category]) {
        verification[faq.category] = 0;
    }
    verification[faq.category]++;
});

console.log('\n📊 FAQ Distribution by Category:');
Object.entries(verification).forEach(([category, count]) => {
    console.log(`${category}: ${count} FAQs`);
});