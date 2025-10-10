import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import { filingData } from '../../data/filingData';

const DocumentsSection = () => {
  const { documents } = filingData;

  return (
    <div>
      {/* Summary */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              Document Library
            </h3>
            <p className="text-sm text-gray-400">
              {documents.totalDocuments.toLocaleString()} documents • {documents.totalSize}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass">
              <Icons.Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="primary">
              <Icons.Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {documents.categories.map((category, index) => {
          const IconComponent = {
            invoices: Icons.FileText,
            receipts: Icons.Receipt,
            returns: Icons.FileCheck,
            other: Icons.Folder,
          }[category.id] || Icons.File;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <GlassCard className="p-6 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h4>
                    <div className="text-sm text-gray-400 mb-3">
                      {category.count.toLocaleString()} files • {category.size}
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="text-primary text-sm hover:underline">
                        View all →
                      </button>
                    </div>
                  </div>

                  <Icons.ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Documents */}
      <GlassCard className="p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Recent Documents</h4>
          <button className="text-primary text-sm hover:underline">
            View all →
          </button>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Invoice_2025_001.pdf', date: '2 hours ago', size: '245 KB', type: 'pdf' },
            { name: 'Receipt_Amazon_Jan.pdf', date: '5 hours ago', size: '189 KB', type: 'pdf' },
            { name: 'VAT_Return_Q4_2024.xlsx', date: '1 day ago', size: '1.2 MB', type: 'excel' },
          ].map((doc, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icons.FileText className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{doc.name}</div>
                <div className="text-xs text-gray-500">{doc.date} • {doc.size}</div>
              </div>

              <div className="flex items-center gap-2">
                <button className="text-primary hover:text-primary-light p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <Icons.Download className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-white p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <Icons.MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default DocumentsSection;