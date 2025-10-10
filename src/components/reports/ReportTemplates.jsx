import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import { reportsData } from '../../data/reportsData';

const ReportTemplates = ({ onSelectTemplate }) => {
  const { templates } = reportsData;

  const categories = [
    { id: 'standard', label: 'Standard Reports', color: 'primary' },
    { id: 'analysis', label: 'Analysis Reports', color: 'success' },
    { id: 'compliance', label: 'Compliance Reports', color: 'warning' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Report Templates</h2>
        <p className="text-gray-400">Choose a template to get started</p>
      </div>

      {categories.map((category) => {
        const categoryTemplates = templates.filter(t => t.category === category.id);
        
        return (
          <div key={category.id} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-white">{category.label}</h3>
              <Badge variant={category.color} size="sm">
                {categoryTemplates.length}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTemplates.map((template, index) => {
                const Icon = Icons[template.icon] || Icons.FileText;
                
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <GlassCard 
                      className="p-6 cursor-pointer group relative"
                      onClick={() => onSelectTemplate(template.id)}
                    >
                      {template.popular && (
                        <div className="absolute -top-3 -right-3">
                          <Badge variant="primary" className="shadow-lg">
                            Popular
                          </Badge>
                        </div>
                      )}

                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>

                      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                        {template.name}
                      </h4>
                      
                      <p className="text-sm text-gray-400 mb-4">
                        {template.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-primary text-sm font-medium">
                          Generate →
                        </span>
                        <Icons.ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportTemplates;