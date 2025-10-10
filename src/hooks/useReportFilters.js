import { useState } from 'react';

export const useReportFilters = () => {
  const [filters, setFilters] = useState({
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      end: new Date(),
      preset: 'last-6-months',
    },
    countries: [],
    transactionTypes: [],
    vatRates: [],
    status: 'all',
    minAmount: null,
    maxAmount: null,
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateDateRange = (start, end, preset = 'custom') => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end, preset },
    }));
  };

  const toggleCountry = (countryCode) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(countryCode)
        ? prev.countries.filter(c => c !== countryCode)
        : [...prev.countries, countryCode],
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        end: new Date(),
        preset: 'last-6-months',
      },
      countries: [],
      transactionTypes: [],
      vatRates: [],
      status: 'all',
      minAmount: null,
      maxAmount: null,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.countries.length > 0 ||
      filters.transactionTypes.length > 0 ||
      filters.vatRates.length > 0 ||
      filters.status !== 'all' ||
      filters.minAmount !== null ||
      filters.maxAmount !== null
    );
  };

  return {
    filters,
    updateFilter,
    updateDateRange,
    toggleCountry,
    resetFilters,
    hasActiveFilters,
  };
};