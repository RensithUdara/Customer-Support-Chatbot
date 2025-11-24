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
          <div className="bg-linear-gradient-br from-white to-blue-50 rounded-xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-linear-gradient-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Order Tracking</h3>
            <p className="text-gray-700 leading-relaxed">
              Real-time tracking for 30+ active orders. Get instant updates on delivery status, shipping progress, and estimated arrival times.
            </p>
          </div>

          <div className="bg-linear-gradient-br from-white to-green-50 rounded-xl shadow-xl p-8 border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-linear-gradient-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Policy Support</h3>
            <p className="text-gray-700 leading-relaxed">
              Comprehensive help with 50+ FAQs covering returns, refunds, payments, warranty claims, and delivery policies.
            </p>
          </div>

          <div className="bg-linear-gradient-br from-white to-purple-50 rounded-xl shadow-xl p-8 border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-linear-gradient-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Recommendations</h3>
            <p className="text-gray-700 leading-relaxed">
              AI-powered product discovery across 40+ items in mobiles, laptops, appliances, and fashion with budget-based filtering.
            </p>
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
