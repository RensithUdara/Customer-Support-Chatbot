import Image from "next/image";
import Link from "next/link";
import { Bot, MessageCircle, ShoppingCart, Headphones } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <ShoppingCart className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">ShopEasy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent e-commerce platform with AI-powered customer support
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI Customer Support Chatbot
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get instant help with order tracking, return policies, and personalized product recommendations.
                Our AI assistant is available 24/7 to provide you with accurate and helpful responses.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
              </Link>
            </div>
            <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <Bot className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center mb-2">
                Intelligent Assistant
              </h3>
              <p className="text-center text-blue-100">
                Powered by advanced AI to understand your needs and provide personalized assistance
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-linear-to-br from-white to-blue-50 rounded-xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full min-h-80">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Order Tracking</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-600">Active Orders</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">1000+</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-600">Order Statuses</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">4 Types</span>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed grow text-sm">
              Real-time tracking with instant updates on Processing, Shipped, Delivered & Cancelled orders. Includes delivery dates, shipping progress, and customer notifications.
            </p>
          </div>

          <div className="bg-linear-to-br from-white to-green-50 rounded-xl shadow-xl p-8 border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full min-h-80">
            <div className="bg-linear-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Policy Support</h3>
            <div className="mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-green-600">FAQ Database</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">1000+</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 p-1 rounded text-green-700">• Orders & Shipping</div>
                <div className="bg-green-50 p-1 rounded text-green-700">• Returns & Refunds</div>
                <div className="bg-green-50 p-1 rounded text-green-700">• Payment Methods</div>
                <div className="bg-green-50 p-1 rounded text-green-700">• Account Support</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed grow text-sm">
              Instant answers on delivery times, EMI plans, COD availability, return policies, warranty claims, and account management.
            </p>
          </div>

          <div className="bg-linear-to-br from-white to-purple-50 rounded-xl shadow-xl p-8 border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full min-h-80">
            <div className="bg-linear-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Recommendations</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-purple-600">Product Catalog</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">1000+</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="bg-purple-50 p-1 rounded text-purple-700">📱 Mobiles</div>
                <div className="bg-purple-50 p-1 rounded text-purple-700">💻 Laptops</div>
                <div className="bg-purple-50 p-1 rounded text-purple-700">🏠 Appliances</div>
                <div className="bg-purple-50 p-1 rounded text-purple-700">👕 Fashion</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed grow text-sm">
              Budget-smart filtering from ₹1,300 to ₹4,00,000. AI analyzes your needs for personalized product matches across all categories.
            </p>
          </div>
        </div>

        {/* Comprehensive Statistics Section */}
        <div className="mt-16 bg-linear-to-r from-gray-900 to-blue-900 rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Comprehensive Data Coverage</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-300 mb-2">1000+</div>
              <div className="text-sm text-gray-300 mb-2">Payment Methods</div>
              <div className="text-xs text-gray-400">Cards, UPI, Wallets, COD, EMI</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">1000+</div>
              <div className="text-sm text-gray-300 mb-2">Delivery Options</div>
              <div className="text-xs text-gray-400">Standard, Express, Same-day</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">1000+</div>
              <div className="text-sm text-gray-300 mb-2">Return Policies</div>
              <div className="text-xs text-gray-400">14-day returns, Exchanges</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-300 mb-2">1000+</div>
              <div className="text-sm text-gray-300 mb-2">Support Topics</div>
              <div className="text-xs text-gray-400">Warranty, Installation, Care</div>
            </div>
          </div>
        </div>

        {/* Detailed Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Feature Coverage</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">💳</span>
                Payment & Financial Services
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Credit/Debit Cards (All major banks)</li>
                <li>• UPI & Digital Wallets (GPay, PhonePe, Paytm)</li>
                <li>• Cash on Delivery (COD) - Selected areas</li>
                <li>• EMI Plans (3, 6, 9, 12 months)</li>
                <li>• Bank Transfers & Net Banking</li>
                <li>• Payment Security & PCI Compliance</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">🚚</span>
                Delivery & Shipping
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Standard Delivery (3-5 working days)</li>
                <li>• Express Delivery (1-2 days, metro cities)</li>
                <li>• Same-day Delivery (selected items/areas)</li>
                <li>• Free shipping on orders above ₹999</li>
                <li>• Real-time tracking with SMS/Email updates</li>
                <li>• Delivery rescheduling & address changes</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">↩️</span>
                Returns & Refunds
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• 14-day return policy (unused items)</li>
                <li>• 7-day return for electronics</li>
                <li>• Free return pickup for defective items</li>
                <li>• Exchange options for size/color variants</li>
                <li>• Refund processing within 3-7 working days</li>
                <li>• Original packaging & accessories required</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">🛠️</span>
                Product & Support Services
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• 6-12 month warranty on electronics</li>
                <li>• Installation services for appliances</li>
                <li>• Product comparison tools</li>
                <li>• Restock notifications & wishlist</li>
                <li>• 24/7 customer support chat</li>
                <li>• Service center network across Sri Lanka</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Try These Sample Queries
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-linear-gradient-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-blue-900 mb-3 text-lg">📦 Order Tracking</h4>
              <p className="text-blue-800 font-medium mb-2">
                "Where is my order 1015?"
              </p>
              <p className="text-blue-700 text-sm">
                "Track order 1025"
              </p>
            </div>
            <div className="bg-linear-gradient-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-green-900 mb-3 text-lg">📋 Policy & Support</h4>
              <p className="text-green-800 font-medium mb-2">
                "What are your delivery times?"
              </p>
              <p className="text-green-700 text-sm">
                "Do you offer EMI plans?"
              </p>
            </div>
            <div className="bg-linear-gradient-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-purple-900 mb-3 text-lg">🛍️ Product Search</h4>
              <p className="text-purple-800 font-medium mb-2">
                "Best laptop under 200000"
              </p>
              <p className="text-purple-700 text-sm">
                "Show me Samsung mobiles"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p className="mb-2">AI Subject Mini Project - Customer Support Chatbot</p>
          <p className="text-sm">Built with Next.js, TypeScript, SQLite & AI Integration</p>
        </div>
      </main>
    </div>
  );
}
