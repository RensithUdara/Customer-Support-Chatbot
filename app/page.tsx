import Image from "next/image";
import Link from "next/link";
import { Bot, MessageCircle, ShoppingCart, Headphones, Sparkles, Shield, Clock, Users, Star, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-0 translate-x-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                <ShoppingCart className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                ShopEasy
              </h1>
              <div className="flex items-center justify-center mt-2">
                <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-600 tracking-wider uppercase">AI Powered</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your shopping experience with our intelligent e-commerce platform featuring
            <span className="text-blue-600 font-semibold">24/7 AI customer support</span> and personalized assistance
          </p>
          <div className="flex items-center justify-center mt-6 space-x-8">
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>3000+ Products</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>AI Support 24/7</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Instant Tracking</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-16 max-w-6xl mx-auto border border-white/20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Advanced AI
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Experience the Future of
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Customer Support</span>
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Get instant, intelligent assistance with our AI-powered chatbot. From order tracking to product recommendations,
                we're here to help you 24/7 with accurate and personalized responses.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">24/7</div>
                  <div className="text-xs text-blue-600">Available</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">5K+</div>
                  <div className="text-xs text-green-600">Happy Users</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">4.9</div>
                  <div className="text-xs text-purple-600">Rating</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Start Chatting Now
                </Link>
                <button className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-semibold">
                  <Bot className="w-5 h-5 mr-3" />
                  See Demo
                </button>
              </div>
            </div>

            {/* Right side - AI Assistant Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute top-4 right-10 w-2 h-2 bg-white/50 rounded-full"></div>
                <Bot className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" />
                <h3 className="text-2xl font-bold text-center mb-4">
                  AI Assistant
                </h3>
                <p className="text-center text-blue-100 leading-relaxed mb-6">
                  Advanced natural language processing to understand your queries and provide instant, accurate responses
                </p>
                <div className="space-y-3">
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-300" />
                    <span className="text-sm">Order Tracking & Updates</span>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-300" />
                    <span className="text-sm">Product Recommendations</span>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-300" />
                    <span className="text-sm">Policy & Support Info</span>
                  </div>
                </div>
              </div>
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
              Budget-smart filtering from Rs.1,300 to Rs.4,00,000. AI analyzes your needs for personalized product matches across all categories.
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
                <li>• Free shipping on orders above Rs.999</li>
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
        <div className="mt-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-10 max-w-6xl mx-auto border border-blue-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Experience AI-Powered Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Try our intelligent chatbot with these popular queries. See how fast and accurate our AI responses are!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Order Tracking Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-blue-900 ml-4 text-xl">Order Tracking</h4>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-blue-800 font-medium text-lg mb-2">
                    "Where is my order 1015?"
                  </p>
                  <p className="text-blue-600 text-sm">
                    Get real-time updates on your order status
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">AI Response Preview:</p>
                      <p className="text-blue-100 text-sm mt-1">
                        "Order 1015 (Laptop) is Shipped and will arrive by 2025-11-26. Track: LK334230336"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Support Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100 hover:border-green-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-green-900 ml-4 text-xl">Policy Support</h4>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-green-800 font-medium text-lg mb-2">
                    "What are your delivery times?"
                  </p>
                  <p className="text-green-600 text-sm">
                    Instant answers on policies and procedures
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">AI Response Preview:</p>
                      <p className="text-green-100 text-sm mt-1">
                        "Standard: 3-5 days, Express: 1-2 days, Same-day available in metro areas"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Search Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100 hover:border-purple-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-purple-900 ml-4 text-xl">Smart Search</h4>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-purple-800 font-medium text-lg mb-2">
                    "Best laptop under 200000"
                  </p>
                  <p className="text-purple-600 text-sm">
                    AI-powered product recommendations
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">AI Response Preview:</p>
                      <p className="text-purple-100 text-sm mt-1">
                        "Found 15 laptops under Rs.2,00,000. Top pick: Dell Inspiron i5 at Rs.1,85,000"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-4">
              <Sparkles className="w-5 h-5 mr-3" />
              <span className="font-semibold text-lg">Ready to try? Start chatting now!</span>
            </div>
            <p className="text-gray-500 text-sm">
              Click the floating chat icon in the bottom-right corner or visit our full chat page
            </p>
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
