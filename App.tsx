import React, { useState, useCallback } from "react";
import {
  Search,
  Eraser,
  Info,
  ArrowRight,
  Loader2,
  Key,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { performSearchTask } from "./services/geminiService";
import { ResultDisplay } from "./components/ResultDisplay";
import { SearchResult } from "./types";

const EXAMPLE_TASK = `You MUST add Search Grounding to the app where relevant to get up to date and accurate information. Use gemini-2.5-flash (with googleSearch tool)

Your task:

1. Search this keyword on Google or any search engine:
   **best online betting sites**

2. From the search results, find a website that matches this example type:
   - A review site
   - A casino/betting ranking page

3. Open the website.

4. Scroll to the section titled:
   **How Do We Rank Best Betting Pages?**

5. Inside that section, find the subsection called:
   **Reliability**

6. Your mission:
   ➝ Extract the FIRST TWO WORDS from the “Reliability” subsection.

7. Return to the app and enter the two words in the answer field.`;

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await performSearchTask(query);
      setResult(data);
    } catch (err: any) {
      // Display the actual error message from the service
      setError(err.message || "Failed to complete the research task.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const fillExample = useCallback(() => {
    setQuery(EXAMPLE_TASK);
  }, []);

  const clearInput = useCallback(() => {
    setQuery("");
    setResult(null);
    setError(null);
  }, []);

  const isApiKeyError = error?.includes("API Key");

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/20">
          <Search className="w-5 h-5 text-blue-400 mr-2" />
          <span className="text-blue-300 text-sm font-medium">
            Google search Made easy
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-white tracking-tight mb-4">
          Research Assistant
        </h1>
        <p className="text-slate-400 text-lg">
          Complex tasks solved in Seconds!
        </p>
      </div>

      {/* Main Input Area */}
      <div className="w-full max-w-3xl">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-900 rounded-xl ring-1 ring-slate-700/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                <Info className="w-3 h-3 mr-1" /> Task Instructions
              </span>
              <div className="flex gap-2">
                <button
                  onClick={fillExample}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20"
                >
                  Load Example
                </button>
                <button
                  onClick={clearInput}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-700"
                  title="Clear input"
                >
                  <Eraser className="w-3 h-3" />
                </button>
              </div>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your research task or question here..."
              className="w-full h-48 bg-transparent text-slate-200 p-4 placeholder-slate-500 focus:outline-none resize-none text-base leading-relaxed font-mono"
              spellCheck={false}
            />

            <div className="px-4 py-3 bg-slate-800/30 flex justify-end items-center border-t border-slate-700/50">
              <button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className={`flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 
                  ${
                    isLoading || !query.trim()
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 active:transform active:scale-95"
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    Execute Task
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message Area */}
      {error && (
        <div
          className={`w-full max-w-3xl mt-6 rounded-lg flex flex-col animate-in fade-in slide-in-from-top-2 overflow-hidden ${
            isApiKeyError
              ? "bg-amber-900/20 border border-amber-700/50"
              : "bg-red-900/20 border border-red-900/50"
          }`}
        >
          <div className="p-4 flex items-start">
            <Info
              className={`w-5 h-5 mr-3 flex-shrink-0 ${
                isApiKeyError ? "text-amber-400" : "text-red-400"
              }`}
            />
            <div
              className={`${
                isApiKeyError ? "text-amber-200" : "text-red-200"
              } text-sm`}
            >
              <span className="font-bold block mb-1">Error Encountered</span>
              {error}
            </div>
          </div>

          {/* Helpful Guide for API Key Errors */}
          {isApiKeyError && (
            <div className="bg-amber-950/50 p-4 border-t border-amber-800/50">
              <h3 className="text-amber-100 font-semibold text-sm mb-3 flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Troubleshooting Guide (Windows):
              </h3>
              <ol className="space-y-3 text-amber-200/80 text-sm">
                <li className="flex items-start">
                  <div className="bg-amber-900/50 rounded w-5 h-5 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
                    1
                  </div>
                  <span>
                    Check your file name. Windows often hides the{" "}
                    <code className="bg-black/30 px-1 rounded text-amber-100 font-mono">
                      .txt
                    </code>{" "}
                    extension.
                    <br />
                    Your file might be named{" "}
                    <code className="text-red-400 font-mono">
                      .env.txt
                    </code>{" "}
                    instead of{" "}
                    <code className="text-green-400 font-mono">.env</code>.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-900/50 rounded w-5 h-5 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
                    2
                  </div>
                  <span>
                    In File Explorer, go to <strong>View</strong> and check{" "}
                    <strong>"File name extensions"</strong>.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-900/50 rounded w-5 h-5 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
                    3
                  </div>
                  <span>
                    Rename the file to remove{" "}
                    <code className="font-mono">.txt</code>.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-900/50 rounded w-5 h-5 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
                    4
                  </div>
                  <span>
                    <strong>Restart the server!</strong> (Press Ctrl+C in
                    terminal, then run <code>npm run dev</code> again)
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <ResultDisplay result={result} isLoading={isLoading} />

      {/* Footer */}
      <div className="mt-20 text-center text-slate-600 text-xs">
        <p>Powered by Google Gemini 2.5 Flash & Google Search</p>
      </div>
    </div>
  );
};

export default App;
