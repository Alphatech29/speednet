export default function AssignProduct() {
  const assignments = [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {assignments.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          No products have been assigned yet.
        </p>
      )}
    </div>
  );
}
