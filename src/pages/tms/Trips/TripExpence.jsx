import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  getTripExpense,
  addTripExpense,
} from "../../../services/TripService/TripService";

const TripExpense = () => {
  const { id: tripId } = useParams();
  const { user } = useSelector((state) => state.auth);
  console.log("id of trip========>",tripId)

  const role = user?.role;
    
  const isDriver = role === "driver";
  const canView =
    role === "Company-Admin" || role === "Accounts-manager" || isDriver;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    expense_type: "",
    amount: "",
    payment_mode: "",
    description: "",
    expense_date: "",
  });

  // 🔹 Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getTripExpense(tripId);
      setExpenses(res?.data || []);
    } catch (err) {
      // error handled in service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canView) fetchExpenses();
  }, [tripId]);

  // 🔹 Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit expense (Driver only)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      expense_type,
      amount,
      payment_mode,
      description,
      expense_date,
    } = form;

    if (!expense_type || !amount || !payment_mode || !expense_date) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      trip_id: Number(tripId),
      expense_type,
      amount: Number(amount),
      payment_mode,
      description,
      expense_date,
    };

    try {
      setSaving(true);
      await addTripExpense(payload);
      toast.success("Trip expense added");

      setForm({
        expense_type: "",
        amount: "",
        payment_mode: "",
        description: "",
        expense_date: "",
      });

      fetchExpenses();
    } catch (err) {
      // handled in service
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Trip Expenses</h2>
        <p className="text-sm text-gray-500">Trip ID: #{tripId}</p>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 font-medium">Expense History</div>

        {loading ? (
          <div className="p-6 text-center text-gray-400">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No expenses added yet
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">Payment</th>
                <th className="px-5 py-3 text-left">Description</th>
                <th className="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-t">
                  <td className="px-5 py-3">{exp.expense_type}</td>
                  <td className="px-5 py-3 font-medium">₹ {exp.amount}</td>
                  <td className="px-5 py-3">{exp.payment_mode}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {exp.description || "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {exp.expense_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Expense Form (Driver only) */}
      {isDriver && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 font-medium">Add Trip Expense</div>

          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">

            <div>
              <label className="label">Expense Type</label>
              <select
                name="expense_type"
                value={form.expense_type}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option value="FUEL">Fuel</option>
                <option value="TOLL">Toll</option>
                <option value="FOOD">Food</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Payment Mode</label>
              <select
                name="payment_mode"
                value={form.payment_mode}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
              </select>
            </div>

            <div>
              <label className="label">Expense Date</label>
              <input
                type="date"
                name="expense_date"
                value={form.expense_date}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="2"
                className="input resize-none"
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`px-5 py-2 rounded-md text-white text-sm
                  ${saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {saving ? "Saving..." : "Add Expense"}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default TripExpense;
