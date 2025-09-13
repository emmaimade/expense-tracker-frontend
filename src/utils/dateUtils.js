export const dateUtils = {
  isDateValid(dateString) {
    if (!dateString) return false;

    const [year, month, day] = dateString
      .split("-")
      .map((num) => parseInt(num));
    const selectedDate = new Date(year, month - 1, day); // month is 0-based

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return selectedDate <= today;
  },

  getDateFilteredTransactions(transactions, range) {
    const now = new Date();
    let startDate;

    switch (range) {
      case "week":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        startDate = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= now;
    });
  },

  calculateMonthlyData(transactions, customDateRange) {
    const monthlyTotals = {};
    let startDate, endDate;

    if (customDateRange.startDate && customDateRange.endDate) {
      startDate = new Date(customDateRange.startDate);
      endDate = new Date(customDateRange.endDate);
    } else {
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 5,
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate()
      );
    }

    const today = new Date();
    if (endDate > today) {
      endDate = today;
    }

    if (startDate > endDate) {
      console.warn("Invalid date range: startDate after endDate");
      return [];
    }

    let currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = currentDate.toLocaleDateString("en-US", {
        month: "short",
      });
      monthlyTotals[monthKey] = {
        month: monthName,
        amount: 0,
        year: currentDate.getFullYear(),
      };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    transactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        const transactionDate = new Date(tx.date);
        const monthKey = `${transactionDate.getFullYear()}-${String(
          transactionDate.getMonth() + 1
        ).padStart(2, "0")}`;

        if (monthlyTotals[monthKey]) {
          monthlyTotals[monthKey].amount += Math.abs(tx.amount);
        }
      });

    return Object.keys(monthlyTotals)
      .sort()
      .map((key) => ({
        month: monthlyTotals[key].month,
        amount: Math.round(monthlyTotals[key].amount),
      }));
  },

  getDateRangeLabel(range) {
    const labels = {
      week: "This Week",
      month: "This Month",
      quarter: "This Quarter",
      year: "This Year",
    };
    return labels[range] || "This Month";
  },
};