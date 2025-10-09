"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Filter,
  CheckCircle,
  Layers,
  Play,
  Clock,
  Shield,
  AlertTriangle,
  Zap,
  Receipt,
  Database,
  FileCheck,
  Search,
  Download,
  Calendar,
  Info,
  Wand2,
  Merge,
  Plus,
  Upload,
  Copy,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

// Types
type ValidationStatus = "pending" | "valid" | "invalid" | "needs_review" | "in_progress";
type ValidationPriority = "high" | "medium" | "low";
type ValidationTab = "all" | "vat" | "transactions" | "quality" | "compliance";

interface ValidationCheck {
  name: string;
  status: "passed" | "failed" | "warning" | "pending";
  result: string;
  confidence?: number;
  details?: any;
}

interface ValidationItem {
  id: string;
  type: "transaction" | "vat_number" | "data_quality" | "compliance";
  status: ValidationStatus;
  priority: ValidationPriority;
  title: string;
  reference: string;
  date: string;
  amount?: string;
  customer?: string;
  vatNumber?: string;
  checks: ValidationCheck[];
  confidence: number;
  aiSuggestion: string;
  assignedTo?: string;
  dueDate?: string;
}

export default function ValidationPage() {
  const [activeTab, setActiveTab] = useState<ValidationTab>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showVatValidator, setShowVatValidator] = useState(false);
  const [vatNumber, setVatNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("GB");
  const [vatValidationResult, setVatValidationResult] = useState<any>(null);

  // Sample validation items
  const validationItems: ValidationItem[] = [
    {
      id: "val_001",
      type: "transaction",
      status: "needs_review",
      priority: "high",
      title: "Transaction Validation",
      reference: "TXN-2024-12345",
      date: "Jan 15, 2025",
      amount: "€1,250.00",
      customer: "Acme Corp Ltd.",
      vatNumber: "GB123456789",
      checks: [
        { name: "Amount within normal range", status: "passed", result: "Valid" },
        { name: "VAT calculation correct", status: "passed", result: "Valid" },
        { name: "VAT number format unusual", status: "warning", result: "Verify with customer" },
        { name: "Invoice number duplicate detected", status: "failed", result: "Similar: TXN-2024-00789" },
      ],
      confidence: 87,
      aiSuggestion: "Review manually due to duplicate warning",
      assignedTo: "John Doe",
      dueDate: "Today",
    },
    {
      id: "val_002",
      type: "vat_number",
      status: "pending",
      priority: "medium",
      title: "VAT Number Verification",
      reference: "DE987654321",
      date: "Jan 15, 2025",
      customer: "Tech GmbH",
      vatNumber: "DE987654321",
      checks: [
        { name: "Format validation", status: "passed", result: "Valid" },
        { name: "VIES verification", status: "pending", result: "Pending" },
      ],
      confidence: 75,
      aiSuggestion: "Awaiting VIES verification",
    },
  ];

  const handleVatValidation = async () => {
    if (!vatNumber || !selectedCountry) {
      return;
    }

    setVatValidationResult(null);
    
    try {
      const response = await fetch('/api/validation/vat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vatNumber: vatNumber,
          countryCode: selectedCountry,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setVatValidationResult({
          valid: false,
          vatNumber: vatNumber,
          error: data.error || 'Validation failed',
        });
        return;
      }

      setVatValidationResult({
        valid: data.validation.isValid,
        vatNumber: data.validation.vatNumber,
        companyName: data.validation.companyName,
        address: data.validation.address,
        registrationDate: data.validation.validatedAt,
        consultationNumber: data.validation.consultationNumber,
        error: data.errorMessage,
      });
    } catch (error) {
      console.error('Validation error:', error);
      setVatValidationResult({
        valid: false,
        vatNumber: vatNumber,
        error: 'Failed to validate VAT number. Please try again.',
      });
    }
  };

  const getPriorityColor = (priority: ValidationPriority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-gray-500";
    }
  };

  const getStatusBadge = (status: ValidationStatus) => {
    const styles = {
      pending: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      valid: "bg-green-500/10 text-green-400 border-green-500/30",
      invalid: "bg-red-500/10 text-red-400 border-red-500/30",
      needs_review: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      in_progress: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getCheckIcon = (status: ValidationCheck["status"]) => {
    switch (status) {
      case "passed":
        return <Check className="w-4 h-4 text-green-400" />;
      case "failed":
        return <X className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#1A1F2E] to-[#0A0E1A]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 h-18 bg-[#1A1F2E]/80 backdrop-blur-xl border-b border-[#00D9B4]/10">
        <div className="flex items-center justify-between h-full px-8">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-[#00D9B4] transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#00A8E8] bg-clip-text text-transparent">
                Validation Center
              </h1>
              <p className="text-sm text-gray-400 mt-1">Home / Validation</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Validation Type Filter */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2E]/50 backdrop-blur-xl border border-[#00D9B4]/20 rounded-lg hover:border-[#00D9B4]/40 transition-colors cursor-pointer">
              <Filter className="w-4 h-4 text-[#00D9B4]" />
              <span className="text-sm text-gray-300">All Types</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2E]/50 backdrop-blur-xl border border-[#00D9B4]/20 rounded-lg hover:border-[#00D9B4]/40 transition-colors cursor-pointer">
              <CheckCircle className="w-4 h-4 text-[#00D9B4]" />
              <span className="text-sm text-gray-300">All Status</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2E]/50 backdrop-blur-xl border border-[#00D9B4]/20 rounded-lg hover:border-[#00D9B4]/40 transition-colors cursor-pointer opacity-50">
              <Layers className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Bulk Actions</span>
            </div>

            {/* New Validation */}
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00D9B4] to-[#00A8E8] rounded-lg font-semibold text-white hover:shadow-[0_0_20px_rgba(0,217,180,0.3)] transition-all"
            >
              <Play className="w-4 h-4" />
              New Validation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Pending Validations */}
          <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/15 rounded-2xl p-6 hover:border-[#00D9B4]/30 transition-all hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Pending Validations</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#00A8E8] bg-clip-text text-transparent mb-2">
              47
            </p>
            <p className="text-xs text-gray-500 mb-3">+12 today</p>
            <button className="text-[#00D9B4] text-sm hover:underline flex items-center gap-1">
              Validate Now →
            </button>
          </div>

          {/* Success Rate */}
          <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/15 rounded-2xl p-6 hover:border-[#00D9B4]/30 transition-all hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Success Rate</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
              98.5%
            </p>
            <p className="text-xs text-green-400 mb-3">+2.3% vs last week</p>
            <button className="text-[#00D9B4] text-sm hover:underline flex items-center gap-1">
              View Details →
            </button>
          </div>

          {/* VAT Numbers Verified */}
          <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/15 rounded-2xl p-6 hover:border-[#00D9B4]/30 transition-all hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#00D9B4]/10 rounded-xl">
                <Shield className="w-6 h-6 text-[#00D9B4]" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">VAT Numbers</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#00A8E8] bg-clip-text text-transparent mb-2">
              1,247
            </p>
            <p className="text-xs text-gray-500 mb-3">All verified ✓</p>
            <button
              onClick={() => {
                setActiveTab("vat");
                setShowVatValidator(true);
              }}
              className="text-[#00D9B4] text-sm hover:underline flex items-center gap-1"
            >
              Check New →
            </button>
          </div>

          {/* Issues Found */}
          <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/15 rounded-2xl p-6 hover:border-[#00D9B4]/30 transition-all hover:transform hover:-translate-y-1 border-l-4 border-l-red-500/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Issues Detected</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
              23
            </p>
            <p className="text-xs text-red-400 mb-3">Requires attention</p>
            <button className="text-[#00D9B4] text-sm hover:underline flex items-center gap-1">
              Review →
            </button>
          </div>

          {/* Auto-Validated */}
          <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/15 rounded-2xl p-6 hover:border-[#00D9B4]/30 transition-all hover:transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#00D9B4]/10 rounded-xl">
                <Zap className="w-6 h-6 text-[#00D9B4]" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Auto-Validated</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#00D9B4] to-[#00A8E8] bg-clip-text text-transparent mb-2">
              892
            </p>
            <p className="text-xs text-gray-500 mb-3">This week</p>
            <button className="text-[#00D9B4] text-sm hover:underline flex items-center gap-1">
              Settings →
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#00D9B4]/10">
          {[
            { id: "all", label: "All Validations", count: 47 },
            { id: "vat", label: "VAT Numbers", count: 23 },
            { id: "transactions", label: "Transactions", count: 15 },
            { id: "quality", label: "Data Quality", count: 6 },
            { id: "compliance", label: "Compliance", count: 3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ValidationTab)}
              className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                activeTab === tab.id
                  ? "text-[#00D9B4]"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 bg-[#00D9B4]/10 text-[#00D9B4] rounded-full text-xs">
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D9B4] to-[#00A8E8]" />
              )}
            </button>
          ))}
        </div>

        {/* VAT Tab - VAT Validator */}
        {activeTab === "vat" && showVatValidator && (
          <div className="mb-8 bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/15 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Validate VAT Number</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Country Selection */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Country:</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0E1A]/50 border border-[#00D9B4]/20 rounded-lg">
                  <span className="text-2xl">🇬🇧</span>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="flex-1 bg-transparent text-white outline-none"
                  >
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* VAT Number Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">VAT Number:</label>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="GB123456789"
                  className="w-full px-4 py-3 bg-[#0A0E1A]/50 border border-[#00D9B4]/20 rounded-lg text-white placeholder-gray-500 focus:border-[#00D9B4]/50 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Format: GB + 9 or 12 digits</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleVatValidation}
                className="px-6 py-3 bg-gradient-to-r from-[#00D9B4] to-[#00A8E8] rounded-lg font-semibold text-white hover:shadow-[0_0_20px_rgba(0,217,180,0.3)] transition-all"
              >
                Validate
              </button>
              <button className="px-6 py-3 bg-[#1A1F2E]/50 border border-[#00D9B4]/20 rounded-lg text-gray-300 hover:border-[#00D9B4]/40 transition-colors">
                Upload CSV/Excel
              </button>
              <button className="px-6 py-3 bg-[#1A1F2E]/50 border border-[#00D9B4]/20 rounded-lg text-gray-300 hover:border-[#00D9B4]/40 transition-colors">
                Paste Multiple
              </button>
            </div>

            {/* Validation Result */}
            {vatValidationResult && (
              <div className={`mt-6 p-6 rounded-xl ${
                vatValidationResult.valid 
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {vatValidationResult.valid ? (
                    <>
                      <Check className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-bold text-green-400">VAT Number is Valid</h3>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-bold text-red-400">VAT Number is Invalid</h3>
                    </>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">VAT Number:</span>
                    <span className="text-white font-mono">{vatValidationResult.vatNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={vatValidationResult.valid ? "text-green-400" : "text-red-400"}>
                      {vatValidationResult.valid ? "Active and verified" : "Invalid or not found"}
                    </span>
                  </div>
                  
                  {vatValidationResult.valid ? (
                    <>
                      <div className="border-t border-green-500/20 pt-3 mt-3">
                        <p className="text-gray-400 mb-2">Company Details:</p>
                        <div className="space-y-2 ml-4">
                          {vatValidationResult.companyName && (
                            <div className="flex">
                              <span className="text-gray-400 mr-2">•</span>
                              <span className="text-white">Name: {vatValidationResult.companyName}</span>
                            </div>
                          )}
                          {vatValidationResult.address && (
                            <div className="flex">
                              <span className="text-gray-400 mr-2">•</span>
                              <span className="text-white">Address: {vatValidationResult.address}</span>
                            </div>
                          )}
                          {vatValidationResult.registrationDate && (
                            <div className="flex">
                              <span className="text-gray-400 mr-2">•</span>
                              <span className="text-white">Validated: {new Date(vatValidationResult.registrationDate).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {vatValidationResult.consultationNumber && (
                        <div className="border-t border-green-500/20 pt-3 mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Consultation Number:</span>
                            <span className="text-white font-mono">{vatValidationResult.consultationNumber}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">(Proof of verification)</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="border-t border-red-500/20 pt-3 mt-3">
                      <p className="text-red-400 mb-2">Error Details:</p>
                      <p className="text-gray-300 ml-4">{vatValidationResult.error || 'VAT number not found in database'}</p>
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm mb-2">Possible reasons:</p>
                        <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                          <li>Number format incorrect</li>
                          <li>Company not VAT registered</li>
                          <li>Number has been deactivated</li>
                          <li>Typo in the number</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  {vatValidationResult.valid && (
                    <>
                      <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors text-sm">
                        Download Certificate
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setVatValidationResult(null);
                      setVatNumber("");
                    }}
                    className="px-4 py-2 bg-[#1A1F2E]/50 border border-[#00D9B4]/20 rounded-lg text-gray-300 hover:border-[#00D9B4]/40 transition-colors text-sm"
                  >
                    Check Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation Queue */}
        <div className="bg-[#1A1F2E]/80 backdrop-blur-xl border border-[#00D9B4]/15 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">Validation Queue</h2>
              <span className="px-3 py-1 bg-[#00D9B4]/10 text-[#00D9B4] rounded-full text-sm font-semibold">
                {validationItems.length} items
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0E1A]/50 border border-[#00D9B4]/20 rounded-lg">
                <span className="text-sm text-gray-400">Sort:</span>
                <select className="bg-transparent text-white text-sm outline-none">
                  <option>Priority</option>
                  <option>Date</option>
                  <option>Type</option>
                  <option>Status</option>
                </select>
              </div>

              <div className="flex gap-2 p-1 bg-[#0A0E1A]/50 border border-[#00D9B4]/20 rounded-lg">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-[#00D9B4]/20 text-[#00D9B4]" : "text-gray-400"
                  }`}
                >
                  <Database className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-[#00D9B4]/20 text-[#00D9B4]" : "text-gray-400"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Validation Items */}
          <div className="space-y-4">
            {validationItems.map((item) => (
              <div
                key={item.id}
                className={`bg-[#0A0E1A]/50 border border-[#00D9B4]/20 border-l-4 ${getPriorityColor(
                  item.priority
                )} rounded-xl p-6 hover:border-[#00D9B4]/40 hover:transform hover:translate-x-1 transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter((id) => id !== item.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-[#00D9B4]/30 bg-[#1A1F2E]/50"
                    />
                    <div className="p-2 bg-[#00D9B4]/10 rounded-lg">
                      <Receipt className="w-5 h-5 text-[#00D9B4]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.reference} • {item.date}
                        {item.amount && ` • ${item.amount}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.priority === "high"
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : item.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                {item.customer && (
                  <div className="mb-4 text-sm text-gray-400">
                    <span>Customer: {item.customer}</span>
                    {item.vatNumber && <span className="ml-4">VAT: {item.vatNumber}</span>}
                  </div>
                )}

                {/* Validation Checks */}
                <div className="bg-[#1A1F2E]/30 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-300 mb-3">Validation Results:</p>
                  <div className="space-y-2">
                    {item.checks.map((check, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {getCheckIcon(check.status)}
                        <div className="flex-1">
                          <span className="text-sm text-gray-300">{check.name}</span>
                          {check.result && check.status !== "passed" && (
                            <p className="text-xs text-gray-500 mt-1">{check.result}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Confidence Score:</span>
                    <span className="text-sm font-semibold text-white">{item.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0A0E1A]/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.confidence >= 90
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : item.confidence >= 70
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-400">
                    <span className="font-semibold">AI Suggestion:</span> {item.aiSuggestion}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#00D9B4]/10">
                  <div className="text-sm text-gray-400">
                    {item.assignedTo && <span>Assigned to: {item.assignedTo}</span>}
                    {item.dueDate && <span className="ml-4">Due: {item.dueDate}</span>}
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors text-sm">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-[#00D9B4]/20 border border-[#00D9B4]/30 rounded-lg text-[#00D9B4] hover:bg-[#00D9B4]/30 transition-colors text-sm">
                      Review
                    </button>
                    <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors text-sm">
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-[#1A1F2E]/50 border border-[#00D9B4]/20 rounded-lg text-gray-300 hover:border-[#00D9B4]/40 transition-colors text-sm">
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {validationItems.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex p-6 bg-green-500/10 rounded-full mb-6">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
              <p className="text-gray-400 mb-6">No validations pending</p>
              <p className="text-gray-500 mb-8">
                Great work! Everything is validated and verified.
              </p>
              <div className="flex gap-4 justify-center">
                <button className="px-6 py-3 bg-[#1A1F2E]/50 border border-[#00D9B4]/20 rounded-lg text-gray-300 hover:border-[#00D9B4]/40 transition-colors">
                  View History
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-[#00D9B4] to-[#00A8E8] rounded-lg font-semibold text-white hover:shadow-[0_0_20px_rgba(0,217,180,0.3)] transition-all">
                  Run Auto-Check
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
