import AddExpenseModal from "./modals/AddExpenseModal";
import { useExpenseMutations } from "./hooks/useExpenseMutations";

// Add-expense modal usable from anywhere in the dashboard (e.g. the mobile bottom nav)
const QuickAddExpense = ({ isOpen, onClose, userId, onDataChange }) => {
  const { addExpense, isAdding } = useExpenseMutations();

  const handleSubmit = async (data) => {
    try {
      await addExpense(data);
      if (onDataChange) onDataChange();
    } catch {
      // Failure is already surfaced by the mutation's error toast
    }
  };

  if (!isOpen) return null;

  return (
    <AddExpenseModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={isAdding}
      userId={userId}
    />
  );
};

export default QuickAddExpense;
