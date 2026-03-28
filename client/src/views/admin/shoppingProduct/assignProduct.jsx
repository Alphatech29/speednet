import { HiCube } from "react-icons/hi";

export default function AssignProduct() {
  const assignments = [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-bold text-gray-800">Assign Products</p>
        <p className="text-xs text-gray-400 mt-0.5">Manage product assignments across categories and groups</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-4">
              <HiCube size={24} className="text-primary-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No assignments yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Product assignments will appear here once products have been linked to categories or groups.
            </p>
          </div>
        ) : (
          <div className="p-5">
            {/* assignment list */}
          </div>
        )}
      </div>
    </div>
  );
}
