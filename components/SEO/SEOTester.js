import { useEffect, useState } from 'react';
import { extractPageSEOClient, logSEOData, generateSEOReport } from '../../lib/seo/testSeo';

const SEOTester = ({ enabled = false }) => {
  const [seoData, setSeoData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Extract SEO data after component mounts
    const data = extractPageSEOClient();
    if (data) {
      setSeoData(data);
      setReport(generateSEOReport(data));
      
      // Log to console for debugging
      if (process.env.NODE_ENV === 'development') {
        logSEOData(data);
      }
    }
  }, [enabled]);

  if (!enabled || !seoData) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      {/* Floating SEO Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors"
          title="SEO Tester"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* SEO Panel */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">SEO Analysis</h2>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* SEO Score */}
              {report && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    SEO Score: <span className={getScoreColor(report.score)}>{report.score}/100</span>
                  </h3>
                  
                  {report.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-600 mb-2">Issues:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {report.issues.map((issue, index) => (
                          <li key={index} className="text-red-600">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {report.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">Suggestions:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {report.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-yellow-600">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="space-y-6">
                {/* Basic Meta Tags */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Meta Tags</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Title:</strong> {seoData.title || 'Not set'}
                      {seoData.title && <span className="text-gray-500 ml-2">({seoData.title.length} chars)</span>}
                    </div>
                    <div>
                      <strong>Description:</strong> {seoData.meta.description || 'Not set'}
                      {seoData.meta.description && <span className="text-gray-500 ml-2">({seoData.meta.description.length} chars)</span>}
                    </div>
                    <div>
                      <strong>Keywords:</strong> {seoData.meta.keywords || 'Not set'}
                    </div>
                  </div>
                </div>

                {/* Open Graph */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Open Graph</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(seoData.openGraph).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Twitter Cards */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Twitter Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(seoData.twitter).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structured Data */}
                {seoData.structuredData.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Structured Data</h3>
                    <div className="space-y-3">
                      {seoData.structuredData.map((data, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="font-medium mb-2">Schema {index + 1}: {data['@type']}</div>
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(data, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Important Links</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(seoData.links).map(([rel, hrefs]) => (
                      <div key={rel}>
                        <strong>{rel}:</strong> {Array.isArray(hrefs) ? hrefs.join(', ') : hrefs}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
                This panel is only visible in development mode
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SEOTester; 