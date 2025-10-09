import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  Upload,
  Clock,
  HelpCircle,
  UploadCloud,
  FolderOpen,
  Camera,
  Scan,
  Link as LinkIcon,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  FileX,
  Pause,
  Play,
  X,
  Settings,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  RefreshCw,
  Lightbulb,
  Keyboard,
  Plug,
  ExternalLink
} from 'lucide-react';

// Types
type UploadStatus = 'queued' | 'uploading' | 'processing' | 'extracting' | 'validating' | 'complete' | 'error' | 'paused';

type UploadQueueItem = {
  id: string;
  filename: string;
  size: number; // bytes
  type: string; // mime
  status: UploadStatus;
  progress: number; // 0-100
  uploadedAt: string;
  step?: string;
  errorMsg?: string;
  paused?: boolean;
  extractedData?: {
    invoiceNumber?: string;
    date?: string;
    supplier?: string;
    vatNumber?: string;
    amount?: number;
    vatAmount?: number;
    total?: number;
    confidence?: number;
  };
};

type BulkSessionStatus = 'idle' | 'uploading' | 'mapping' | 'validating' | 'review' | 'importing' | 'complete';

type BulkImportSession = {
  id: string;
  filename?: string;
  totalRows?: number;
  validRows?: number;
  warningRows?: number;
  errorRows?: number;
  columnMapping?: Record<string, string>;
  status: BulkSessionStatus;
  createdAt: string;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const fileTypeIcon = (mime: string) => {
  if (mime.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
  if (mime.includes('csv') || mime.includes('excel') || mime.includes('spreadsheet') || mime.includes('sheet') || mime.includes('vnd.openxmlformats-officedocument')) return <FileSpreadsheet className="w-5 h-5 text-green-400" />;
  if (mime.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-400" />;
  return <FileIcon className="w-5 h-5 text-gray-400" />;
};

const UploadPage: React.FC = () => {
  // Top-level state
  const [activeTab, setActiveTab] = useState<'documents' | 'bulk' | 'email' | 'integrations'>('documents');
  const [showMethodMenu, setShowMethodMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Quick option modals
  const [showCamera, setShowCamera] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Extracted data preview modal
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractItem, setExtractItem] = useState<UploadQueueItem | null>(null);

  // Bulk import
  const [bulkSession, setBulkSession] = useState<BulkImportSession>({ id: 'bulk_' + Date.now(), status: 'idle', createdAt: new Date().toISOString() });
  const [bulkPreviewRows, setBulkPreviewRows] = useState<any[]>([]);
  const [bulkColumns, setBulkColumns] = useState<string[]>([]);
  const [bulkMapping, setBulkMapping] = useState<Record<string, string>>({});

  // Batch processing settings
  const [autoProcess, setAutoProcess] = useState(true);
  const [autoCategorize, setAutoCategorize] = useState(true);
  const [confidence, setConfidence] = useState(90);
  const [validateVAT, setValidateVAT] = useState(true);
  const [duplicateDetect, setDuplicateDetect] = useState(true);
  const [ocrLang, setOcrLang] = useState('auto');
  const [extractionMode, setExtractionMode] = useState<'standard' | 'high' | 'fast'>('standard');
  const [postCalcVAT, setPostCalcVAT] = useState(true);
  const [postMatchCustomers, setPostMatchCustomers] = useState(true);
  const [postCreateCategories, setPostCreateCategories] = useState(true);
  const [postNotify, setPostNotify] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cmdOrCtrl = e.ctrlKey || e.metaKey;
      // Ctrl/Cmd + U: open file picker
      if (cmdOrCtrl && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      // Ctrl/Cmd + Enter: upload all
      if (cmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        startAllUploads();
      }
      if (e.key === 'Escape') {
        // close any open modal/sidebar
        setShowHistory(false);
        setShowHelp(false);
        setShowCamera(false);
        setShowUrlModal(false);
        setShowScannerModal(false);
        setShowExtractModal(false);
      }
      if (e.key === ' ') {
        // pause/resume first active upload
        const idx = uploadQueue.findIndex(q => q.status === 'uploading' || q.status === 'processing' || q.status === 'extracting' || q.status === 'validating');
        if (idx >= 0) {
          e.preventDefault();
          togglePause(uploadQueue[idx].id);
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedQueueId) {
          e.preventDefault();
          removeItem(selectedQueueId);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [uploadQueue, selectedQueueId]);

  // Simulate progress for active uploads
  useEffect(() => {
    const id = setInterval(() => {
      setUploadQueue(prev => prev.map(item => {
        if (item.paused) return item;
        if (item.status === 'uploading' || item.status === 'processing' || item.status === 'extracting' || item.status === 'validating') {
          const inc = Math.max(1, Math.round(Math.random() * 5));
          let next = Math.min(100, item.progress + inc);
          let status = item.status;
          let step = item.step;
          if (next >= 100) {
            // advance to next step
            if (status === 'uploading') { status = 'processing'; next = 5; step = 'Processing...'; }
            else if (status === 'processing') { status = 'extracting'; next = 5; step = 'Extracting data...'; }
            else if (status === 'extracting') { status = 'validating'; next = 5; step = 'Validating...'; }
            else if (status === 'validating') { status = 'complete'; next = 100; step = 'Complete'; }
          }
          return { ...item, progress: next, status, step };
        }
        return item;
      }));
    }, 600);
    return () => clearInterval(id);
  }, []);

  const allowedTypes = [
    'application/pdf', 'image/jpeg', 'image/png', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const newItems: UploadQueueItem[] = arr.map(file => {
      const tooLarge = file.size > 10 * 1024 * 1024; // 10MB
      const unsupported = !allowedTypes.find(t => file.type.includes(t.split('/')[1]) || file.type === t);
      if (tooLarge || unsupported) {
        return {
          id: 'upload_' + Math.random().toString(36).slice(2),
          filename: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          status: 'error',
          progress: 0,
          uploadedAt: new Date().toISOString(),
          errorMsg: tooLarge ? 'File size exceeds 10MB limit' : `Unsupported file format: ${file.name.split('.').pop()}`,
        };
      }
      return {
        id: 'upload_' + Math.random().toString(36).slice(2),
        filename: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 5,
        uploadedAt: new Date().toISOString(),
        step: 'Uploading...'
      };
    });
    setUploadQueue(prev => [...newItems, ...prev]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const startAllUploads = () => {
    setUploadQueue(prev => prev.map(item => (item.status === 'queued' || item.status === 'paused') ? { ...item, status: 'uploading', paused: false, step: 'Uploading...' } : item));
  };

  const clearAll = () => setUploadQueue([]);
  const togglePause = (id: string) => setUploadQueue(prev => prev.map(i => i.id === id ? { ...i, paused: !i.paused, status: i.paused ? 'uploading' : 'paused' } : i));
  const cancelItem = (id: string) => setUploadQueue(prev => prev.map(i => i.id === id ? { ...i, status: 'error', errorMsg: 'Upload canceled by user' } : i));
  const removeItem = (id: string) => setUploadQueue(prev => prev.filter(i => i.id !== id));

  const openExtractPreview = (item: UploadQueueItem) => {
    setExtractItem(item);
    setShowExtractModal(true);
  };

  // Bulk import handlers (simulated)
  const handleBulkFile = (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    setBulkSession({ id: 'bulk_' + Date.now(), status: 'mapping', filename: file.name, createdAt: new Date().toISOString(), totalRows: 1247, validRows: 1220, warningRows: 23, errorRows: 4 });
    // Simulated columns and preview rows
    const cols = ['Date', 'Invoice No', 'Customer', 'Amount', 'Tax'];
    const rows = [
      { 'Date': '2025-01-01', 'Invoice No': 'INV-001', 'Customer': 'Acme Corp', 'Amount': '1000.00', 'Tax': '200.00' },
      { 'Date': '2025-01-02', 'Invoice No': 'INV-002', 'Customer': 'Globex', 'Amount': '250.00', 'Tax': '50.00' },
      { 'Date': '2025-01-03', 'Invoice No': 'INV-003', 'Customer': 'Soylent', 'Amount': '500.00', 'Tax': '100.00' },
      { 'Date': '2025-01-04', 'Invoice No': 'INV-004', 'Customer': 'Initech', 'Amount': '125.00', 'Tax': '25.00' },
      { 'Date': '2025-01-05', 'Invoice No': 'INV-005', 'Customer': 'Umbrella', 'Amount': '900.00', 'Tax': '180.00' },
    ];
    setBulkColumns(cols);
    setBulkPreviewRows(rows);
    setBulkMapping({ 'Date': 'transactionDate', 'Invoice No': 'invoiceNumber', 'Customer': 'customerName', 'Amount': 'netAmount', 'Tax': 'vatAmount' });
  };

  const bulkValidate = () => setBulkSession(prev => ({ ...prev, status: 'validating' }));
  const bulkToReview = () => setBulkSession(prev => ({ ...prev, status: 'review' }));
  const bulkStartImport = () => setBulkSession(prev => ({ ...prev, status: 'importing' }));
  useEffect(() => {
    if (bulkSession.status === 'validating') {
      const t = setTimeout(() => setBulkSession(prev => ({ ...prev, status: 'review' })), 1000);
      return () => clearTimeout(t);
    }
    if (bulkSession.status === 'importing') {
      const t = setTimeout(() => setBulkSession(prev => ({ ...prev, status: 'complete' })), 1500);
      return () => clearTimeout(t);
    }
  }, [bulkSession.status]);

  // Top bar
  const TopBar = () => (
    <div className="h-[72px] bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/30 px-8 py-4 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors" aria-label="Back to Dashboard">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Documents</h1>
          <p className="text-sm text-gray-400">Home / Upload</p>
        </div>
      </div>
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setShowMethodMenu(v => !v)} className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg border border-slate-600/30 flex items-center gap-2" aria-haspopup="menu" aria-expanded={showMethodMenu}>
            <Upload className="w-4 h-4" />
            <span className="text-sm">Documents & Invoices</span>
          </button>
          {showMethodMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-lg shadow-xl z-50">
              {[
                'Documents & Invoices',
                'Bulk Transactions (CSV/Excel)',
                'Connect Integration',
                'Email to Upload'
              ].map(opt => (
                <button key={opt} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-800/70" onClick={() => setShowMethodMenu(false)}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowHistory(true)} className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg border border-slate-600/30 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">History</span>
        </button>
        <button onClick={() => setShowHelp(true)} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-600/30" aria-label="Help">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Tabs header
  const TabsHeader = () => (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl mx-8 mb-6 overflow-x-auto">
      <div className="flex">
        {[
          { id: 'documents', label: 'Documents' },
          { id: 'bulk', label: 'Bulk Import' },
          { id: 'email', label: 'Email Import' },
          { id: 'integrations', label: 'Integrations' },
        ].map(t => (
          <button key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-6 py-3 text-sm font-medium border-b-[3px] transition-all whitespace-nowrap ${activeTab === t.id ? 'text-teal-400 border-teal-400 bg-teal-400/10' : 'text-gray-400 border-transparent hover:text-teal-400 hover:bg-teal-400/5'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Documents Tab Content
  const DocumentsTab = () => (
    <div>
      {/* Drag-and-drop area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`min-h-[400px] rounded-2xl p-12 text-center transition-all border-2 border-dashed ${
          isDragging ? 'bg-teal-500/10 border-teal-400 shadow-[0_0_30px_rgba(0,217,180,0.3)]' : 'bg-slate-800/40 border-teal-400/30 hover:bg-teal-500/5 hover:border-teal-400/50 hover:scale-[1.01]'
        }`}
        aria-label="Drag and drop files here"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-6 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 animate-pulse">
            <UploadCloud className="w-20 h-20 text-teal-400" />
          </div>
          <div className="text-2xl font-semibold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Drag and drop files here</div>
          <div className="text-lg text-gray-400">or click to browse</div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {['PDF','JPG','PNG','XLS','CSV','DOC'].map(f => (
              <span key={f} className="px-2 py-1 text-xs rounded-full bg-slate-800/60 border border-teal-400/20 text-gray-400">{f}</span>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Maximum size: 10MB per file</div>
          <div className="mt-6">
            <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 text-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5" /> Browse Files
            </button>
            <input ref={fileInputRef} type="file" multiple onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" />
          </div>
        </div>
      </div>

      {/* Quick options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Take Photo */}
        <button onClick={() => setShowCamera(true)} className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-xl border border-teal-400/15 text-left hover:shadow-[0_0_0_1px_rgba(0,217,180,0.2)] transition">
          <div className="flex flex-col items-center text-center">
            <Camera className="w-6 h-6 text-teal-400" />
            <div className="mt-2 text-white font-medium">Take Photo</div>
            <div className="text-sm text-gray-400">Use device camera</div>
            <div className="mt-3 px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Open Camera</div>
          </div>
        </button>
        {/* Scan Document */}
        <button onClick={() => setShowScannerModal(true)} className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-xl border border-teal-400/15 text-left hover:shadow-[0_0_0_1px_rgba(0,217,180,0.2)] transition">
          <div className="flex flex-col items-center text-center">
            <Scan className="w-6 h-6 text-teal-400" />
            <div className="mt-2 text-white font-medium">Scan Document</div>
            <div className="text-sm text-gray-400">Use connected scanner</div>
            <div className="mt-3 px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Start Scan</div>
          </div>
        </button>
        {/* From URL */}
        <button onClick={() => setShowUrlModal(true)} className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-xl border border-teal-400/15 text-left hover:shadow-[0_0_0_1px_rgba(0,217,180,0.2)] transition">
          <div className="flex flex-col items-center text-center">
            <LinkIcon className="w-6 h-6 text-teal-400" />
            <div className="mt-2 text-white font-medium">Import from URL</div>
            <div className="text-sm text-gray-400">Download from link</div>
            <div className="mt-3 px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Enter URL</div>
          </div>
        </button>
      </div>

      {/* Batch Processing Settings */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Batch Processing Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={autoProcess} onChange={(e) => setAutoProcess(e.target.checked)} className="text-teal-400" />
              <span className="text-sm text-gray-300">Enable automatic processing</span>
            </label>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={autoCategorize} onChange={(e) => setAutoCategorize(e.target.checked)} className="text-teal-400" />
                <span className="text-sm text-gray-300">Use AI to categorize</span>
              </label>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs text-gray-400">Confidence: {confidence}%</span>
                <input type="range" min={70} max={95} value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))} className="w-48" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={validateVAT} onChange={(e) => setValidateVAT(e.target.checked)} className="text-teal-400" />
                <span className="text-sm text-gray-300">Validate VAT numbers automatically</span>
              </label>
              <div className="mt-2 text-xs text-gray-400">Action on invalid: Flag</div>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={duplicateDetect} onChange={(e) => setDuplicateDetect(e.target.checked)} className="text-teal-400" />
                <span className="text-sm text-gray-300">Check for duplicates</span>
              </label>
              <div className="mt-2 text-xs text-gray-400 space-y-1">
                <div>☑ Invoice number</div>
                <div>☑ Date + Amount</div>
                <div>☑ Supplier + Amount</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">OCR Language</label>
              <select value={ocrLang} onChange={(e) => setOcrLang(e.target.value)} className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">
                <option value="auto">Auto-detect</option>
                <option value="en">English (UK)</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Extraction Mode</label>
              <div className="space-y-1">
                {(['standard','high','fast'] as const).map(m => (
                  <label key={m} className="flex items-center gap-2">
                    <input type="radio" name="extract_mode" checked={extractionMode===m} onChange={() => setExtractionMode(m)} className="text-teal-400" />
                    <span className="text-sm text-gray-300">{m === 'standard' ? 'Standard (balanced)' : m === 'high' ? 'High accuracy (slower)' : 'Fast (lower accuracy)'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Post-Processing</label>
              <div className="space-y-1">
                <label className="flex items-center gap-2"><input type="checkbox" checked={postCalcVAT} onChange={(e)=>setPostCalcVAT(e.target.checked)} className="text-teal-400" /><span className="text-sm text-gray-300">Calculate VAT automatically</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={postMatchCustomers} onChange={(e)=>setPostMatchCustomers(e.target.checked)} className="text-teal-400" /><span className="text-sm text-gray-300">Match to existing customers</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={postCreateCategories} onChange={(e)=>setPostCreateCategories(e.target.checked)} className="text-teal-400" /><span className="text-sm text-gray-300">Create categories as needed</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={postNotify} onChange={(e)=>setPostNotify(e.target.checked)} className="text-teal-400" /><span className="text-sm text-gray-300">Send notification on completion</span></label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Save Preferences</button>
        </div>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white">Upload Queue</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-teal-500/20 text-teal-400">{uploadQueue.length} files</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearAll} className="text-sm text-gray-300 hover:text-white">Clear all</button>
              <button onClick={startAllUploads} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Upload all</button>
            </div>
          </div>

          <div className="space-y-3">
            {uploadQueue.map(item => (
              <div key={item.id} onClick={() => setSelectedQueueId(item.id)} className={`p-4 rounded-lg border ${selectedQueueId===item.id?'border-teal-400/50':'border-slate-700/30'} bg-slate-800/30` }>
                <div className="flex items-start justify-between gap-4">
                  {/* Left: File info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">{fileTypeIcon(item.type)}</div>
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">{item.filename}</div>
                      <div className="text-xs text-gray-400">{formatBytes(item.size)} • {item.status === 'error' ? 'Upload failed' : (item.step || '')}</div>
                      {/* Extracted preview snippet */}
                      {item.status === 'complete' && (
                        <div className="mt-1 text-xs text-gray-300">Extracted: {item.extractedData?.invoiceNumber || 'INV-2024-001'}, €{(item.extractedData?.amount ?? 1250).toLocaleString()} • VAT: €{(item.extractedData?.vatAmount ?? 250).toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  {/* Center: Progress */}
                  <div className="flex-1 max-w-[480px]">
                    {item.status !== 'error' && (
                      <div className="w-full bg-slate-700/30 rounded-full h-2">
                        <div className={`${item.status==='complete' ? 'bg-green-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'} h-2 rounded-full transition-all`} style={{ width: `${item.progress}%` }} />
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{item.status === 'uploading' && 'Uploading...'}{item.status === 'processing' && 'Processing...'}{item.status === 'extracting' && 'Extracting data...'}{item.status === 'validating' && 'Validating...'}{item.status === 'complete' && 'Complete ✓'}{item.status === 'paused' && 'Paused'}{item.status === 'error' && <span className="text-red-400">⚠ {item.errorMsg}</span>}</div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {item.status !== 'error' && item.status !== 'complete' && (
                      <button onClick={() => togglePause(item.id)} className="p-2 rounded-lg bg-slate-700/40 hover:bg-slate-700/60" aria-label={item.paused ? 'Resume' : 'Pause'}>
                        {item.paused ? <Play className="w-4 h-4 text-yellow-400" /> : <Pause className="w-4 h-4 text-gray-300" />}
                      </button>
                    )}
                    {item.status !== 'complete' && (
                      <button onClick={() => cancelItem(item.id)} className="p-2 rounded-lg bg-slate-700/40 hover:bg-slate-700/60" aria-label="Cancel">
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                    <button onClick={() => openExtractPreview(item)} className="p-2 rounded-lg bg-slate-700/40 hover:bg-slate-700/60" aria-label="Preview">
                      <Settings className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg bg-slate-700/40 hover:bg-slate-700/60" aria-label="Remove">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Start with a Template</h3>
          <span className="text-sm text-gray-400">Download pre-formatted templates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {[
            { title: 'Invoice Template', desc: 'Standard invoice format with VAT' },
            { title: 'Expense Template', desc: 'Record your expenses quickly' },
            { title: 'Receipt Template', desc: 'For receipts with VAT lines' },
            { title: 'Transaction Template', desc: 'Bulk transactions import' },
          ].map((t) => (
            <div key={t.title} className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 text-white font-medium"><FileSpreadsheet className="w-5 h-5 text-teal-400" /> {t.title}</div>
              <div className="text-sm text-gray-400 mt-1">{t.desc}</div>
              <div className="mt-3 flex items-center gap-2">
                <button className="px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Download Excel</button>
                <button className="px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Download CSV</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Bulk Import Tab Content
  const BulkTab = () => (
    <div>
      {bulkSession.status === 'idle' || bulkSession.status === 'uploading' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) handleBulkFile(e.dataTransfer.files); }}
          className="min-h-[300px] rounded-2xl p-12 text-center transition-all border-2 border-dashed bg-slate-800/40 border-teal-400/30 hover:bg-teal-500/5"
        >
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet className="w-14 h-14 text-teal-400" />
            <div className="text-xl font-semibold text-white">Upload CSV or Excel file</div>
            <div className="text-sm text-gray-400">Supported: .csv, .xlsx, .xls • Max 10,000 rows</div>
            <button className="text-teal-400 text-sm hover:underline">Download sample template</button>
            <button onClick={() => bulkFileInputRef.current?.click()} className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Browse Files</button>
            <input ref={bulkFileInputRef} type="file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e)=> e.target.files && handleBulkFile(e.target.files)} className="hidden" />
          </div>
        </div>
      ) : null}

      {bulkSession.status === 'mapping' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-semibold text-white mb-3">Preview (first 5 rows)</h3>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    {bulkColumns.map(c => <th key={c} className="py-2 pr-4">{c}</th>)}
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {bulkPreviewRows.map((row, i) => (
                    <tr key={i} className="border-t border-slate-700/30">
                      {bulkColumns.map(c => <td key={c} className="py-2 pr-4">{row[c]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Map Your Columns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bulkColumns.map(col => (
                <div key={col} className="flex items-center justify-between gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="text-gray-300">{col}</div>
                  <div className="text-gray-500">→</div>
                  <select value={bulkMapping[col] || ''} onChange={(e)=> setBulkMapping(prev => ({...prev, [col]: e.target.value}))} className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">
                    <option value="">Skip</option>
                    <option value="transactionDate">Transaction Date *</option>
                    <option value="invoiceNumber">Invoice Number</option>
                    <option value="customerName">Customer Name</option>
                    <option value="netAmount">Net Amount *</option>
                    <option value="vatAmount">VAT Amount</option>
                    <option value="country">Country</option>
                    <option value="currency">Currency</option>
                    <option value="paymentMethod">Payment Method</option>
                    <option value="reference">Reference</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Auto-Map</button>
              <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm" onClick={()=> setBulkMapping({})}>Reset</button>
              <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Save Mapping Template</button>
              <div className="flex-1" />
              <button onClick={bulkValidate} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Continue</button>
            </div>
          </div>
        </div>
      )}

      {bulkSession.status === 'validating' && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">Validation Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-gray-400 text-sm">Total Rows</div>
              <div className="text-white text-xl font-semibold">{bulkSession.totalRows}</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-gray-400 text-sm">Valid</div>
              <div className="text-green-400 text-xl font-semibold">{bulkSession.validRows}</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-gray-400 text-sm">Warnings</div>
              <div className="text-yellow-400 text-xl font-semibold">{bulkSession.warningRows}</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-gray-400 text-sm">Errors</div>
              <div className="text-red-400 text-xl font-semibold">{bulkSession.errorRows}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button onClick={bulkToReview} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Review</button>
          </div>
        </div>
      )}

      {bulkSession.status === 'review' && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Import</h3>
          <div className="text-sm text-gray-300">✓ {bulkSession.validRows} transactions ready • ⚠ {bulkSession.warningRows} with warnings • ✗ {bulkSession.errorRows} will be skipped</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-teal-400" /> <span className="text-sm text-gray-300">Auto-categorize transactions</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-teal-400" /> <span className="text-sm text-gray-300">Validate VAT numbers</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-teal-400" /> <span className="text-sm text-gray-300">Create new customers as needed</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" className="text-teal-400" /> <span className="text-sm text-gray-300">Mark all as 'Needs Review'</span></label>
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
            <button onClick={bulkStartImport} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Import Transactions</button>
          </div>
        </div>
      )}

      {bulkSession.status === 'importing' && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">Importing Transactions...</h3>
          <div className="w-full bg-slate-700/30 rounded-full h-2"><div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: '82%' }} /></div>
          <div className="text-sm text-gray-300 mt-2">Processing row 1,004 of {bulkSession.validRows} • Estimated time: 30 seconds</div>
          <div className="text-sm text-gray-300">✓ Imported: 1,003 • ⏳ Pending: 217 • ✗ Failed: 0</div>
          <div className="flex items-center justify-end mt-3"><button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Cancel Import</button></div>
        </div>
      )}

      {bulkSession.status === 'complete' && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3"><CheckCircle className="w-8 h-8 text-green-400"/></div>
          <h3 className="text-xl font-semibold text-white">✓ Import Complete</h3>
          <p className="text-sm text-gray-300 mt-1">Successfully imported {bulkSession.validRows} transactions</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">View Transactions</button>
            <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Upload More</button>
            <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Download Report</button>
          </div>
        </div>
      )}
    </div>
  );

  // Email Import Tab Content
  const EmailTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-3">Email Import Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Your unique upload email</label>
            <div className="flex items-center gap-2">
              <input readOnly value="vatana-acc12345@upload.vatana.ai" className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm" />
              <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Copy</button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Forward invoices to this address for automatic extraction.</div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Settings</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-teal-400"/><span className="text-sm text-gray-300">Auto-process attachments</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-teal-400"/><span className="text-sm text-gray-300">Extract data from email body</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="text-teal-400"/><span className="text-sm text-gray-300">Send confirmation emails</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" className="text-teal-400"/><span className="text-sm text-gray-300">Auto-approve high confidence extractions</span></label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-gray-300 mb-2">Whitelist senders (optional)</label>
          <div className="flex items-center gap-2">
            <input placeholder="Add email address" className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm"/>
            <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Add Email Address</button>
          </div>
          <div className="text-xs text-gray-500 mt-2">Only accept emails from specific addresses</div>
          <div className="mt-4"><button className="px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg text-sm">Test Email Import</button></div>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Email Imports</h3>
        <div className="space-y-3">
          {[
            { from: 'supplier@acmecorp.com', subj: 'Invoice #12345', when: '2 hours ago', attachments: 1, status: 'Pending review' },
            { from: 'billing@globex.com', subj: 'Invoice #9081', when: 'Yesterday', attachments: 2, status: 'Processing' },
          ].map((r, i) => (
            <div key={i} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">From: {r.from}</div>
                  <div className="text-sm text-gray-400">Subject: {r.subj} • Received: {r.when}</div>
                  <div className="text-sm text-gray-400">Attachments: {r.attachments} • Status: {r.status}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Review & Approve</button>
                  <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Integrations Tab Content
  const IntegrationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'QuickBooks Online', last: '2 hours ago', newItems: 47 },
          { name: 'Xero', last: '1 day ago', newItems: 22 },
          { name: 'Stripe', last: '3 hours ago', newItems: 15 },
          { name: 'Shopify', last: '5 hours ago', newItems: 12 },
          { name: 'PayPal', last: 'Yesterday', newItems: 8 },
          { name: 'Square', last: 'Today', newItems: 5 },
          { name: 'Custom API', last: '—', newItems: 0 },
        ].map((app) => (
          <div key={app.name} className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">{app.name}</div>
              <div className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Connected</div>
            </div>
            <div className="text-sm text-gray-400 mt-1">Last sync: {app.last}</div>
            <div className="text-sm text-gray-400">New items: {app.newItems}</div>
            <div className="mt-3 flex items-center gap-2">
              <button className="px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg text-sm">Import Now</button>
              <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Quick Stats Sidebar
  const QuickStatsSidebar = () => (
    <div className="space-y-4">
      <div className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
        <div className="text-gray-400 text-sm">Today's Uploads</div>
        <div className="text-3xl font-bold text-white">47</div>
        <div className="text-xs text-gray-500">+12 vs yesterday</div>
      </div>
      <div className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
        <div className="text-gray-400 text-sm">Currently Processing</div>
        <div className="text-3xl font-bold text-white">{uploadQueue.filter(i => ['uploading','processing','extracting','validating'].includes(i.status)).length}</div>
        <div className="mt-2"><button className="px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">View Queue</button></div>
      </div>
      <div className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
        <div className="text-gray-400 text-sm">This Month</div>
        <div className="text-3xl font-bold text-white">1,247</div>
        <div className="text-xs text-gray-500">€1.46M total value</div>
      </div>
      <div className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
        <div className="text-gray-400 text-sm">Storage Used</div>
        <div className="w-full bg-slate-700/30 rounded-full h-2 my-2"><div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: '82%' }} /></div>
        <div className="text-xs text-gray-500">41 GB of 50 GB</div>
        <div className="mt-2"><button className="px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Manage Storage</button></div>
      </div>

      {/* Recent Uploads */}
      <div className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
        <div className="text-white font-semibold mb-2">Recent Uploads</div>
        <div className="space-y-2">
          {[
            { name: 'invoice_001.pdf', size: '2.4 MB', when: '2 hours ago', ok: true },
            { name: 'receipt_002.jpg', size: '1.1 MB', when: '3 hours ago', ok: true },
            { name: 'transactions_q4.csv', size: '320 KB', when: 'Yesterday', ok: true },
          ].map((u) => (
            <div key={u.name} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 flex items-center justify-between">
              <div>
                <div className="text-sm text-white truncate max-w-[180px]">{u.name}</div>
                <div className="text-xs text-gray-400">{u.size} • {u.when}</div>
              </div>
              <div>{u.ok ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-yellow-400" />}</div>
            </div>
          ))}
        </div>
        <div className="mt-3"><button className="text-sm text-teal-400 hover:underline">View all uploads →</button></div>
      </div>

      {/* Tips & Tricks */}
      <div className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-teal-400" /><span className="text-white font-semibold">Tips & Tricks</span></div>
          <button className="p-1 rounded bg-slate-800/50 border border-slate-600/30"><RefreshCw className="w-4 h-4 text-gray-300"/></button>
        </div>
        <div className="text-sm text-gray-300">Take clear photos in good lighting for best results</div>
      </div>
    </div>
  );

  // History Sidebar
  const HistorySidebar = () => (
    <div className={`fixed inset-0 z-50 ${showHistory ? '' : 'pointer-events-none'}`} aria-hidden={!showHistory}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity ${showHistory ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowHistory(false)} />
      <div className={`absolute right-0 top-0 h-full w-[400px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/30 transition-transform ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
          <div className="text-white font-semibold">Upload History</div>
          <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-4 flex items-center gap-2 border-b border-slate-700/30">
          <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm"><option>All time</option><option>Today</option><option>This week</option><option>This month</option></select>
          <input className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm" placeholder="Search uploads..."/>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
          {[
            { time: '2:30 PM', name: 'invoice_2024_001.pdf', size: '2.4 MB', status: 'Successful', extracted: '€1,250.00', inv: '#12345' },
            { time: '1:05 PM', name: 'receipt_2025_21.jpg', size: '1.2 MB', status: 'Successful', extracted: '€42.90', inv: '—' },
          ].map((h, i) => (
            <div key={i} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="text-xs text-gray-400">{h.time}</div>
              <div className="text-white">{h.name}</div>
              <div className="text-xs text-gray-400">{h.size} • <span className="text-green-400">{h.status}</span></div>
              <div className="text-sm text-gray-300 mt-1">Extracted: {h.extracted} • Invoice {h.inv}</div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <button className="px-2 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">View</button>
                <button className="px-2 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Download</button>
                <button className="px-2 py-1 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Delete</button>
              </div>
            </div>
          ))}
          <div className="text-center"><button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Load more</button></div>
        </div>
      </div>
    </div>
  );

  // Help Modal (Shortcut guide)
  const HelpModal = () => (
    showHelp ? (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowHelp(false)} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white font-semibold"><Keyboard className="w-5 h-5"/> Keyboard Shortcuts</div>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Ctrl/Cmd + U: Open file browser</div>
              <div>Ctrl/Cmd + Enter: Confirm and upload</div>
              <div>Esc: Cancel upload/close modal</div>
              <div>Space: Pause/resume upload</div>
              <div>Delete: Remove selected file from queue</div>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );

  // Camera Capture Modal (placeholder UI)
  const CameraModal = () => (
    showCamera ? (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowCamera(false)} />
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl w-full max-w-3xl h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
              <div className="text-white font-semibold">Take Photo</div>
              <button onClick={() => setShowCamera(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="flex-1 grid place-items-center">
              <div className="w-[90%] h-[70%] bg-slate-800/60 rounded-lg border border-slate-700/30 grid place-items-center">
                <div className="text-gray-400 text-sm">Live camera preview (placeholder)</div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center gap-3 border-t border-slate-700/30">
              <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Flash</button>
              <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full">Capture</button>
              <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Gallery</button>
              <button onClick={() => setShowCamera(false)} className="px-3 py-2 text-gray-300 hover:text-white text-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );

  // URL Import Modal
  const UrlModal = () => (
    showUrlModal ? (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowUrlModal(false)} />
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl w-full max-w-xl">
            <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
              <div className="text-white font-semibold">Import from URL</div>
              <button onClick={() => setShowUrlModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Enter document URL</label>
                <input placeholder="https://" className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm" />
              </div>
              <div className="text-xs text-gray-400">
                Supports: Direct file links (PDF, images), Google Drive, Dropbox, OneDrive links
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setShowUrlModal(false)} className="px-3 py-2 text-gray-300 hover:text-white text-sm">Cancel</button>
                <button className="px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg text-sm">Import</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );

  // Scanner Modal
  const ScannerModal = () => (
    showScannerModal ? (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowScannerModal(false)} />
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl w-full max-w-xl">
            <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
              <div className="text-white font-semibold">Scan Document</div>
              <button onClick={() => setShowScannerModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-sm text-gray-300">Detected Scanners:</div>
              <div className="space-y-2 text-sm text-gray-300">
                <label className="flex items-center gap-2"><input type="radio" name="scanner" defaultChecked className="text-teal-400"/> HP OfficeJet Pro 8025 (USB)</label>
                <label className="flex items-center gap-2"><input type="radio" name="scanner" className="text-teal-400"/> Canon imageFORMULA (Network)</label>
              </div>
              <div className="text-sm text-gray-300">Settings:</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>Resolution: 300 DPI</div><div>Color: Auto</div><div>Format: PDF</div><div>Pages: Single</div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setShowScannerModal(false)} className="px-3 py-2 text-gray-300 hover:text-white text-sm">Cancel</button>
                <button className="px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg text-sm">Scan</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );

  // Extracted Data Preview Modal
  const ExtractPreviewModal = () => (
    showExtractModal && extractItem ? (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowExtractModal(false)} />
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl w-full max-w-6xl">
            <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
              <div className="text-white font-semibold">Extracted Information <span className="ml-2 text-sm text-green-400">[95% ✓]</span></div>
              <button onClick={() => setShowExtractModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Left: preview */}
              <div className="lg:col-span-3 p-4 border-r border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <button className="p-2 rounded bg-slate-800/50 border border-slate-600/30"><ZoomOut className="w-4 h-4 text-gray-300"/></button>
                  <button className="p-2 rounded bg-slate-800/50 border border-slate-600/30"><ZoomIn className="w-4 h-4 text-gray-300"/></button>
                </div>
                <div className="w-full h-[520px] bg-slate-800/60 rounded-lg grid place-items-center text-gray-400 text-sm">
                  Document preview (placeholder)
                </div>
              </div>
              {/* Right: extracted fields */}
              <div className="lg:col-span-2 p-4 space-y-3">
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="text-sm text-gray-400">Invoice Number</div>
                  <div className="text-white font-medium">INV-2024-001</div>
                  <div className="text-xs text-green-400">Confidence: 98% ✓</div>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="text-white font-medium">January 15, 2025</div>
                  <div className="text-xs text-green-400">Confidence: 95% ✓</div>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="text-sm text-gray-400">Supplier</div>
                  <div className="text-white font-medium">Acme Corp Ltd. • VAT: GB123456789 <span className="text-green-400">Verified ✓</span></div>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="text-sm text-gray-400 mb-1">Line Items</div>
                  <div className="text-xs text-gray-300">Software License — Qty 1 — £1,000 — VAT £200</div>
                  <div className="text-xs text-gray-300">Support Services — Qty 1 — £250 — VAT £50</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30"><div className="text-xs text-gray-400">Subtotal</div><div className="text-white">£1,250.00</div></div>
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30"><div className="text-xs text-gray-400">VAT (20%)</div><div className="text-white">£250.00</div></div>
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 col-span-2"><div className="text-xs text-gray-400">Total</div><div className="text-white">£1,500.00</div></div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Save</button>
                  <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">Save & Next</button>
                  <button onClick={() => setShowExtractModal(false)} className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">Discard</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );

  const TrashIcon = () => (
    <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
  );

  // Main Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter">
      <TopBar />
      <TabsHeader />

      <div className="px-8 pb-10 grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Main column (70%) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'bulk' && <BulkTab />}
          {activeTab === 'email' && <EmailTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
        </div>
        {/* Sidebar (30%) */}
        <aside className="lg:col-span-3 lg:sticky lg:top-[88px] space-y-4">
          <QuickStatsSidebar />
        </aside>
      </div>

      <HistorySidebar />
      <HelpModal />
      <CameraModal />
      <UrlModal />
      <ScannerModal />
      <ExtractPreviewModal />
    </div>
  );
};

export default UploadPage;