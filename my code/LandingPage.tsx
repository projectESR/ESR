import { Droplet, Microscope, Shield, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-red-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                BloodType AI
              </span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full text-red-700 text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Blood Type Analysis</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Instant Blood Type
              <br />
              <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Detection in Seconds
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload your blood test card image and get accurate blood type results powered by advanced machine learning. Fast, secure, and reliable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BloodType AI?</h2>
            <p className="text-xl text-gray-600">Advanced technology for accurate results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Microscope className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced machine learning algorithms analyze your test card with high precision, detecting agglutination patterns automatically.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your blood type results in seconds. No waiting, no hassle. Upload, analyze, and receive detailed reports immediately.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is encrypted and protected. All analysis is done securely with full privacy compliance and secure storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and accurate</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Image', desc: 'Take a photo or upload your blood test card image' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes the card and detects agglutination patterns' },
              { step: '03', title: 'Get Results', desc: 'Receive your blood type with confidence scores instantly' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="inline-flex w-20 h-20 items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full text-3xl font-bold mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-transparent -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-600 to-red-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of users who trust BloodType AI for accurate blood type analysis
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-5 bg-white text-red-600 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            Start Analyzing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl text-center">
          <p>&copy; 2025 BloodType AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
