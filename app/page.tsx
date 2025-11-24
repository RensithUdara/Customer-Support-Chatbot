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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Tracking</h3>
            <p className="text-gray-600">
              Track your orders in real-time. Just provide your order number and get instant status updates.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Policy Support</h3>
            <p className="text-gray-600">
              Get instant answers about return policies, shipping, payments, and warranty information.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
            <p className="text-gray-600">
              Find the perfect products based on your budget, preferences, and specific requirements.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Try These Sample Queries
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Order Status</h4>
              <p className="text-sm text-gray-600 italic">
                "Where is my order 1012?"
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Policy Question</h4>
              <p className="text-sm text-gray-600 italic">
                "What is your return policy?"
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Product Recommendation</h4>
              <p className="text-sm text-gray-600 italic">
                "Recommend a phone under 25000"
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
