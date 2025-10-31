import { useMemo } from 'react';

/**
 * Custom hook for transforming analytics data into chart-ready format
 * @param {Array} categoryData - Array of category objects with name and value
 * @param {Array} monthlyData - Array of monthly spending data
 * @param {string} timeRange - Time range: '3months', '6months', or '1year'
 * @returns {Object} Processed chart data and statistics
 */
export const useChartData = (categoryData = [], monthlyData = [], timeRange = '6months') => {
  return useMemo(() => {
    const MONTHS_BACK = { '3months': 3, '6months': 6, '1year': 12 }[timeRange] || 6;

    // ──────────────────────────────────────────────────────
    // MONTHLY DATA PROCESSING
    // ──────────────────────────────────────────────────────
    
    // Generate month range (including current month)
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - MONTHS_BACK + 1, 1);

    const allMonths = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const displayMonth = currentDate.toLocaleDateString('en-US', { month: 'short' });
      
      allMonths.push({
        key: yearMonth,
        month: displayMonth,
        date: new Date(currentDate)
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Parse and map monthly data
    const monthMap = new Map();
    
    if (Array.isArray(monthlyData)) {
      monthlyData.forEach((m) => {
        if (!m) return;
        
        const raw = String(m.month || '').trim();
        if (!raw) return;

        let key;
        
        // Try ISO format: YYYY-MM or YYYY-M
        const iso = raw.match(/^(\d{4})-(\d{1,2})$/);
        if (iso) {
          key = `${iso[1]}-${String(iso[2]).padStart(2, '0')}`;
        } else {
          // Try to match with generated months by name
          const matchedMonth = allMonths.find(month => {
            const longName = month.date.toLocaleDateString('en-US', { month: 'long' });
            return (
              month.month.toLowerCase() === raw.toLowerCase() ||
              longName.toLowerCase() === raw.toLowerCase()
            );
          });
          
          if (matchedMonth) {
            key = matchedMonth.key;
          }
        }

        if (key) {
          const amount = Number(m.amount) || 0;
          monthMap.set(key, (monthMap.get(key) || 0) + amount);
        }
      });
    }

    // Build filtered monthly data with padding
    const monthlyDataFiltered = allMonths.map((m) => ({
      month: m.month,
      amount: monthMap.get(m.key) || 0,
    }));

    // Calculate monthly statistics
    const allAmounts = monthlyDataFiltered.map((m) => m.amount);
    const hasMonthlyData = allAmounts.some((a) => a > 0);
    
    // Average includes all months (including zeros for accurate averaging)
    const monthlyAvg = allAmounts.length > 0
      ? allAmounts.reduce((a, b) => a + b, 0) / allAmounts.length
      : 0;
    
    // Max/Min only from actual spending months
    const actualAmounts = allAmounts.filter((a) => a > 0);
    const monthMax = actualAmounts.length > 0 ? Math.max(...actualAmounts) : 0;
    const monthMin = actualAmounts.length > 0 ? Math.min(...actualAmounts) : 0;

    // ──────────────────────────────────────────────────────
    // CATEGORY DATA PROCESSING
    // ──────────────────────────────────────────────────────
    
    // Process and validate category data
    const validCategories = Array.isArray(categoryData)
      ? categoryData
          .filter(c => c && typeof c === 'object')
          .map((c) => ({
            name: String(c.name || '').trim() || 'Unknown',
            value: Number(c.value) || 0,
          }))
          .filter((c) => c.value > 0)
      : [];

    // Get top 5 categories
    const top5 = validCategories
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const catTotal = top5.reduce((sum, c) => sum + c.value, 0);

    // ──────────────────────────────────────────────────────
    // RETURN PROCESSED DATA
    // ──────────────────────────────────────────────────────
    
    return {
      // Category data
      top5,
      catTotal,
      hasCategoryData: top5.length > 0,
      
      // Monthly data
      monthlyDataFiltered,
      monthlyAvg,
      monthMax,
      monthMin,
      hasMonthlyData,
      
      // Metadata
      monthsCount: MONTHS_BACK,
      dateRange: {
        start: startDate,
        end: now,
      },
    };
  }, [categoryData, monthlyData, timeRange]);
};

export default useChartData;