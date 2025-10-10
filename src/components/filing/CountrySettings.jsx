import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { filingData } from '../../data/filingData';
import { formatCurrency } from '../../utils/formatters';

const CountrySettings = () => {
  const { countrySettings } = filingData;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Country Settings</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage VAT registration and settings for each country
          </p>
        </div>
        <Button variant="primary">
          <Icons.Plus className="w-4 h-4" />
          Add Country
        </Button>
      </div>

      <div className="space-y-6">
        {countrySettings.map((country, index) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{country.flag}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {country.country}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={country.status === 'active' ? 'success' : 'default'}
                        size="sm"
                      >
                        {country.status.charAt(0).toUpperCase() + country.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        Registration: {country.registration.vatNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="glass" size="sm">
                    <Icons.Settings className="w-4 h-4" />
                    Configure
                  </Button>
                  <Button variant="glass" size="sm">
                    <Icons.MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Registration Details */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Icons.FileText className="w-4 h-4 text-primary" />
                    Registration Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">VAT Number</span>
                      <span className="text-white font-mono">
                        {country.registration.vatNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Registered</span>
                      <span className="text-white">
                        {country.registration.registeredDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Authority</span>
                      <span className="text-white text-right max-w-[120px] truncate">
                        {country.registration.authority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filing Settings */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Icons.Calendar className="w-4 h-4 text-primary" />
                    Filing Settings
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frequency</span>
                      <span className="text-white capitalize">
                        {country.filing.frequency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Scheme</span>
                      <span className="text-white capitalize">
                        {country.filing.scheme}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Filing</span>
                      <span className="text-primary font-semibold">
                        {country.filing.nextFiling}
                      </span>
                    </div>
                  </div>
                </div>

                {/* VAT Rates */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Icons.Percent className="w-4 h-4 text-primary" />
                    VAT Rates
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Standard Rate</span>
                      <span className="text-white font-semibold">
                        {country.rates.standard}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reduced Rate</span>
                      <span className="text-white font-semibold">
                        {country.rates.reduced}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Threshold</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(country.rates.threshold)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-800">
                <Button variant="primary" size="sm">
                  <Icons.FileText className="w-4 h-4" />
                  Create Return
                </Button>
                <Button variant="glass" size="sm">
                  <Icons.Eye className="w-4 h-4" />
                  View History
                </Button>
                <Button variant="glass" size="sm">
                  <Icons.Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.AlertTriangle className="w-4 h-4" />
                  Test Connection
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Add New Country Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: countrySettings.length * 0.1 }}
      >
        <GlassCard className="p-8 text-center border-dashed border-gray-600 hover:border-primary/30 transition-all cursor-pointer group">
          <Icons.Plus className="w-12 h-12 text-gray-500 group-hover:text-primary mx-auto mb-4 transition-colors" />
          <h3 className="text-lg font-semibold text-gray-400 group-hover:text-primary mb-2 transition-colors">
            Add New Country
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Register for VAT in a new country and set up filing requirements
          </p>
          <Button variant="outline" size="sm">
            Get Started
          </Button>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default CountrySettings;