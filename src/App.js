import React, { useState, useMemo } from 'react';
import { Plus, X, Download, TrendingUp, Users, Target, Lightbulb, DollarSign, BarChart3, Award } from 'lucide-react';

const SCORE_CRITERIA = [
  { 
    id: 'team', 
    name: 'Founder/Team', 
    icon: Users,
    description: 'Experience, track record, domain expertise',
    weight: 20 
  },
  { 
    id: 'market', 
    name: 'Market Size', 
    icon: TrendingUp,
    description: 'TAM, growth potential, market dynamics',
    weight: 15 
  },
  { 
    id: 'additionality', 
    name: 'Additionality', 
    icon: Target,
    description: 'Impact uniqueness, what wouldn\'t exist otherwise',
    weight: 20 
  },
  { 
    id: 'product', 
    name: 'Product/Solution', 
    icon: Lightbulb,
    description: 'Innovation, defensibility, product-market fit',
    weight: 15 
  },
  { 
    id: 'impact', 
    name: 'Impact Alignment', 
    icon: Award,
    description: 'ESG factors, measurable social/environmental impact',
    weight: 15 
  },
  { 
    id: 'traction', 
    name: 'Traction/Validation', 
    icon: BarChart3,
    description: 'Revenue, user growth, key metrics',
    weight: 10 
  },
  { 
    id: 'business', 
    name: 'Business Model', 
    icon: DollarSign,
    description: 'Unit economics, scalability, profitability path',
    weight: 5 
  }
];

export default function VCDealScreener() {
  const [startups, setStartups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    stage: '',
    askAmount: '',
    scores: Object.fromEntries(SCORE_CRITERIA.map(c => [c.id, 5]))
  });

  const rankedStartups = useMemo(() => {
    return [...startups]
      .map(startup => {
        const weightedScore = SCORE_CRITERIA.reduce((sum, criteria) => {
          return sum + (startup.scores[criteria.id] * criteria.weight / 100);
        }, 0);
        return { ...startup, weightedScore };
      })
      .sort((a, b) => b.weightedScore - a.weightedScore);
  }, [startups]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (criteriaId, value) => {
    setFormData(prev => ({
      ...prev,
      scores: { ...prev.scores, [criteriaId]: parseInt(value) }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStartups(prev => [...prev, { ...formData, id: Date.now() }]);
    setFormData({
      name: '',
      sector: '',
      stage: '',
      askAmount: '',
      scores: Object.fromEntries(SCORE_CRITERIA.map(c => [c.id, 5]))
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setStartups(prev => prev.filter(s => s.id !== id));
  };

  const exportToCSV = () => {
    const headers = [
      'Rank',
      'Company Name',
      'Sector',
      'Stage',
      'Ask Amount',
      ...SCORE_CRITERIA.map(c => c.name),
      'Weighted Score'
    ];

    const rows = rankedStartups.map((startup, index) => [
      index + 1,
      startup.name,
      startup.sector,
      startup.stage,
      startup.askAmount,
      ...SCORE_CRITERIA.map(c => startup.scores[c.id]),
      startup.weightedScore.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vc-deal-screener-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 6) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 4) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getWeightedScoreColor = (score) => {
    if (score >= 8) return 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white';
    if (score >= 6) return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
    if (score >= 4) return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white';
    return 'bg-gradient-to-br from-rose-500 to-pink-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                  VC Deal Screener
                </h1>
                <p className="text-slate-600 text-lg">
                  Impact investing evaluation & ranking dashboard
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  Add Startup
                </button>
                {startups.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    <Download size={20} />
                    Export CSV
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Input Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add New Startup</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sector *
                  </label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g., CleanTech, EdTech"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Stage *
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select stage</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C+">Series C+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ask Amount
                  </label>
                  <input
                    type="text"
                    name="askAmount"
                    value={formData.askAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g., $2M"
                  />
                </div>
              </div>

              {/* Scoring Section */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Score Criteria (1-10)
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {SCORE_CRITERIA.map(criteria => {
                    const Icon = criteria.icon;
                    return (
                      <div key={criteria.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Icon size={20} className="text-indigo-600" />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-900">
                                {criteria.name}
                                <span className="ml-2 text-xs font-normal text-slate-500">
                                  (Weight: {criteria.weight}%)
                                </span>
                              </label>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {criteria.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={formData.scores[criteria.id]}
                              onChange={(e) => handleScoreChange(criteria.id, e.target.value)}
                              className="w-32"
                            />
                            <span className="text-2xl font-bold text-indigo-600 w-8 text-center">
                              {formData.scores[criteria.id]}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1,2,3,4,5,6,7,8,9,10].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleScoreChange(criteria.id, val)}
                              className={`flex-1 h-2 rounded-full transition-all ${
                                val <= formData.scores[criteria.id]
                                  ? 'bg-indigo-600'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Add Startup
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard */}
        {startups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={40} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No startups yet</h3>
              <p className="text-slate-600 mb-6">
                Click "Add Startup" to begin evaluating deals and building your pipeline.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Deal Rankings
              </h2>
              <p className="text-slate-600 mb-4">
                {startups.length} {startups.length === 1 ? 'startup' : 'startups'} evaluated
              </p>
            </div>

            {rankedStartups.map((startup, index) => (
              <div
                key={startup.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Rank Badge */}
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${getWeightedScoreColor(startup.weightedScore)}`}>
                      #{index + 1}
                    </div>
                    <div className="md:text-center">
                      <div className={`text-3xl font-bold px-4 py-2 rounded-xl ${getWeightedScoreColor(startup.weightedScore)}`}>
                        {startup.weightedScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-500 mt-2 font-medium">
                        Weighted Score
                      </div>
                    </div>
                  </div>

                  {/* Startup Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">
                          {startup.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
                            {startup.sector}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                            {startup.stage}
                          </span>
                          {startup.askAmount && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
                              {startup.askAmount}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(startup.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {SCORE_CRITERIA.map(criteria => {
                        const Icon = criteria.icon;
                        const score = startup.scores[criteria.id];
                        return (
                          <div
                            key={criteria.id}
                            className={`p-4 rounded-xl border-2 ${getScoreColor(score)}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Icon size={16} />
                              <span className="text-xs font-bold">
                                {criteria.name}
                              </span>
                            </div>
                            <div className="text-2xl font-bold">
                              {score}/10
                            </div>
                            <div className="text-xs opacity-75 mt-1">
                              Weight: {criteria.weight}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: #e2e8f0;
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
