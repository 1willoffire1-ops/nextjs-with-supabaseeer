"use client";

import * as Sentry from "@sentry/nextjs";
import { useState, useEffect } from "react";

const { logger } = Sentry;

// Custom error class for testing
class TestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestError";
  }
}

export default function SentryTestPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    async function checkConnectivity() {
      const result = await Sentry.diagnoseSdkConnectivity();
      setIsConnected(result !== "sentry-unreachable");
    }
    checkConnectivity();
  }, []);

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test 1: Undefined Function Error
  const testUndefinedFunction = () => {
    try {
      Sentry.startSpan(
        {
          op: "test.error",
          name: "Test Undefined Function",
        },
        () => {
          // @ts-expect-error - intentionally calling undefined function
          myUndefinedFunction();
        }
      );
    } catch (error) {
      Sentry.captureException(error);
      addResult("✅ Undefined function error captured");
      logger.error("Undefined function called", { test: "myUndefinedFunction" });
    }
  };

  // Test 2: Throw Custom Error
  const testCustomError = () => {
    try {
      throw new TestError("This is a custom test error");
    } catch (error) {
      Sentry.captureException(error);
      addResult("✅ Custom error captured");
      logger.error("Custom error thrown", { errorType: "TestError" });
    }
  };

  // Test 3: Test Span with Metrics
  const testSpanWithMetrics = () => {
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Button Click with Metrics",
      },
      (span) => {
        span.setAttribute("testType", "span-metrics");
        span.setAttribute("timestamp", Date.now());
        span.setAttribute("userAction", "click");

        // Simulate some work
        const start = Date.now();
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
          sum += i;
        }
        const duration = Date.now() - start;

        span.setAttribute("duration_ms", duration);
        addResult(`✅ Span created with metrics (duration: ${duration}ms)`);
        logger.info("Span test completed", { duration, sum });
      }
    );
  };

  // Test 4: Test API Call with Span
  const testApiCallWithSpan = async () => {
    try {
      await Sentry.startSpan(
        {
          op: "http.client",
          name: "GET /api/sentry-example-api",
        },
        async (span) => {
          span.setAttribute("method", "GET");
          span.setAttribute("endpoint", "/api/sentry-example-api");

          const response = await fetch("/api/sentry-example-api");
          span.setAttribute("status_code", response.status);

          if (!response.ok) {
            addResult("✅ API error captured");
            logger.warn("API call failed", {
              endpoint: "/api/sentry-example-api",
              status: response.status,
            });
          } else {
            addResult("✅ API call successful and traced");
            logger.info("API call successful", { status: response.status });
          }
        }
      );
    } catch (error) {
      Sentry.captureException(error);
      addResult("✅ API exception captured");
      logger.error("API call exception", { error: String(error) });
    }
  };

  // Test 5: Test Logger Levels
  const testLoggerLevels = () => {
    logger.trace("Trace level log", { level: "trace", test: true });
    logger.debug(logger.fmt`Debug level log with value: ${"test-value"}`);
    logger.info("Info level log", { level: "info", timestamp: Date.now() });
    logger.warn("Warning level log", { level: "warn", isTest: true });
    logger.error("Error level log", { level: "error", severity: "high" });

    addResult("✅ All logger levels tested (trace, debug, info, warn, error)");
  };

  // Test 6: Nested Spans
  const testNestedSpans = () => {
    Sentry.startSpan(
      {
        op: "test.nested",
        name: "Parent Span",
      },
      (parentSpan) => {
        parentSpan.setAttribute("level", "parent");

        Sentry.startSpan(
          {
            op: "test.nested.child",
            name: "Child Span 1",
          },
          (childSpan1) => {
            childSpan1.setAttribute("level", "child");
            childSpan1.setAttribute("childNumber", 1);
          }
        );

        Sentry.startSpan(
          {
            op: "test.nested.child",
            name: "Child Span 2",
          },
          (childSpan2) => {
            childSpan2.setAttribute("level", "child");
            childSpan2.setAttribute("childNumber", 2);
          }
        );

        addResult("✅ Nested spans created (1 parent, 2 children)");
        logger.info("Nested spans test completed", { parentSpan: "test.nested" });
      }
    );
  };

  // Test 7: Unhandled Promise Rejection
  const testUnhandledPromiseRejection = () => {
    Promise.reject(new Error("Unhandled promise rejection test"))
      .catch((error) => {
        Sentry.captureException(error);
        addResult("✅ Promise rejection captured");
        logger.error("Promise rejection handled", { error: error.message });
      });
  };

  // Run all tests
  const runAllTests = async () => {
    setResults(["🧪 Running all tests..."]);
    testUndefinedFunction();
    await new Promise(resolve => setTimeout(resolve, 100));
    testCustomError();
    await new Promise(resolve => setTimeout(resolve, 100));
    testSpanWithMetrics();
    await new Promise(resolve => setTimeout(resolve, 100));
    await testApiCallWithSpan();
    await new Promise(resolve => setTimeout(resolve, 100));
    testLoggerLevels();
    await new Promise(resolve => setTimeout(resolve, 100));
    testNestedSpans();
    await new Promise(resolve => setTimeout(resolve, 100));
    testUnhandledPromiseRejection();
    await new Promise(resolve => setTimeout(resolve, 100));
    addResult("🎉 All tests completed! Check Sentry dashboard.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <svg className="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 40 40">
              <path d="M21.85 2.995a3.698 3.698 0 0 1 1.353 1.354l16.303 28.278a3.703 3.703 0 0 1-1.354 5.053 3.694 3.694 0 0 1-1.848.496h-3.828a31.149 31.149 0 0 0 0-3.09h3.815a.61.61 0 0 0 .537-.917L20.523 5.893a.61.61 0 0 0-1.057 0l-3.739 6.494a28.948 28.948 0 0 1 9.63 10.453 28.988 28.988 0 0 1 3.499 13.78v1.542h-9.852v-1.544a19.106 19.106 0 0 0-2.182-8.85 19.08 19.08 0 0 0-6.032-6.829l-1.85 3.208a15.377 15.377 0 0 1 6.382 12.484v1.542H3.696A3.694 3.694 0 0 1 0 34.473c0-.648.17-1.286.494-1.849l2.33-4.074a8.562 8.562 0 0 1 2.689 1.536L3.158 34.17a.611.611 0 0 0 .538.917h8.448a12.481 12.481 0 0 0-6.037-9.09l-1.344-.772 4.908-8.545 1.344.77a22.16 22.16 0 0 1 7.705 7.444 22.193 22.193 0 0 1 3.316 10.193h3.699a25.892 25.892 0 0 0-3.811-12.033 25.856 25.856 0 0 0-9.046-8.796l-1.344-.772 5.269-9.136a3.698 3.698 0 0 1 3.2-1.849c.648 0 1.285.17 1.847.495Z" />
            </svg>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sentry Integration Test
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive error tracking and tracing tests
              </p>
            </div>
          </div>

          {!isConnected && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">
                ⚠️ Network requests to Sentry are being blocked. Disable ad-blocker to complete tests.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={testUndefinedFunction}
              disabled={!isConnected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              1. Test Undefined Function
            </button>

            <button
              onClick={testCustomError}
              disabled={!isConnected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              2. Test Custom Error
            </button>

            <button
              onClick={testSpanWithMetrics}
              disabled={!isConnected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              3. Test Span with Metrics
            </button>

            <button
              onClick={testApiCallWithSpan}
              disabled={!isConnected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              4. Test API Call
            </button>

            <button
              onClick={testLoggerLevels}
              disabled={!isConnected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              5. Test Logger Levels
            </button>

            <button
              onClick={testNestedSpans}
              disabled={!isConnected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              6. Test Nested Spans
            </button>

            <button
              onClick={testUnhandledPromiseRejection}
              disabled={!isConnected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              7. Test Promise Rejection
            </button>

            <button
              onClick={runAllTests}
              disabled={!isConnected}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-bold transition-colors"
            >
              🚀 Run All Tests
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Test Results:
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Click a test button to begin...
                </p>
              ) : (
                results.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono"
                  >
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              📊 View results in your{" "}
              <a
                href="https://vatana.sentry.io/issues/?project=4510155127717968"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Sentry Dashboard
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
