const db = require("../model/db");

async function bulkUpdateStatus(updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error("Updates must be a non-empty array");
  }

  // Filter valid items (must have id and status)
  const validUpdates = updates.filter(u => u.id && u.status !== undefined);

  if (validUpdates.length === 0) {
    throw new Error("No valid updates provided");
  }

  try {
    // Extract all IDs
    const ids = validUpdates.map(u => u.id);

    // Check which IDs actually exist
    const [existingRows] = await db.execute(
      `SELECT id FROM accounts WHERE id IN (${ids.map(() => '?').join(', ')})`,
      ids
    );

    const existingIds = existingRows.map(row => row.id);

    if (existingIds.length === 0) {
      return updates.map(u => ({
        id: u.id,
        success: false,
        message: `Record with ID ${u.id} not found`
      }));
    }

    // Build CASE statement for existing IDs only
    const cases = [];
    const caseValues = [];
    const updateIds = [];

    validUpdates.forEach(u => {
      if (existingIds.includes(u.id)) {
        cases.push(`WHEN id = ? THEN ?`);
        caseValues.push(u.id, u.status);
        updateIds.push(u.id);
      }
    });

    if (cases.length > 0) {
      const sql = `
        UPDATE accounts
        SET status = CASE
          ${cases.join(' ')}
        END
        WHERE id IN (${updateIds.map(() => '?').join(', ')})
      `;

      await db.execute(sql, [...caseValues, ...updateIds]);
    }

    // Prepare results for all requested updates
    const results = updates.map(u => {
      if (!u.id || u.status === undefined) {
        return {
          id: u.id || null,
          success: false,
          message: "Missing 'id' or 'status'"
        };
      }

      if (existingIds.includes(u.id)) {
        return {
          id: u.id,
          success: true,
          message: "Status updated successfully"
        };
      } else {
        return {
          id: u.id,
          success: false,
          message: "Record not found"
        };
      }
    });

    return results;
  } catch (error) {
    console.error("Bulk Status Update Error:", error);
    throw new Error("Bulk update failed");
  }
}

module.exports = {bulkUpdateStatus};
