import getPasswordStrength from "../../utils/passwordUtils";

export const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;
  
  const { score } = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex space-x-1 mb-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              level <= score
                ? score <= 2
                  ? "bg-red-400"
                  : score <= 3
                  ? "bg-yellow-400"
                  : "bg-green-400"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Strength: {score <= 2 ? "Weak" : score <= 3 ? "Medium" : "Strong"}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;