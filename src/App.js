import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    bedrooms: 3,
    bathrooms: 2,
    sqft_living: 1500,
    floors: 1,
    waterfront: 0,
    view: 0,
    condition: 3,
    grade: 7,
    sqft_above: 1000,
    sqft_basement: 500,
    yr_built: 2000,
    yr_renovated: 0,
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "condition" ? parseInt(value) : Number(value);
    setFormData({ ...formData, [name]: numericValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictedPrice(null);
    try {
      const res = await axios.post("https://house-price-backend-aopp.onrender.com/predict", formData);
      setPredictedPrice(res.data.predicted_price);
    } catch (error) {
      alert("API Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-blue-900 font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Your Home's Future, Calculated Today</h1>
        <p className="text-center text-blue-700 mb-10 text-sm">
          Predict house prices using Machine Learning
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries({
            bedrooms: "Bedrooms",
            bathrooms: "Bathrooms",
            sqft_living: "Living Area (sqft)",
            floors: "Floors",
            waterfront: "Waterfront",
            view: "View Quality",
            condition: "Condition",
            grade: "Grade",
            sqft_above: "Above Ground Area (sqft)",
            sqft_basement: "Basement Area (sqft)",
            yr_built: "Year Built",
            yr_renovated: "Year Renovated"
          }).map(([key, label]) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="mb-1 font-medium text-blue-800">{label}</label>
              {key === "floors" || key === "waterfront" || key === "view" || key === "condition" || key === "grade" ? (
                <select
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {key === "waterfront" ? (
                    [0, 1].map((v) => <option key={v} value={v}>{v === 0 ? "No" : "Yes"}</option>)
                  ) : key === "view" ? (
                    [0, 1, 2, 3].map((v) => <option key={v} value={v}>{["None", "Average", "Good", "Excellent"][v]}</option>)
                  ) : key === "condition" ? (
                    [1, 2, 3, 4, 5].map((v) => (
                      <option key={v} value={v}>{["Poor", "Fair", "Average", "Good", "Excellent"][v - 1]}</option>
                    ))
                  ) : (
                    [...Array(key === "grade" ? 13 : 6).keys()].slice(1).map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))
                  )}
                </select>
              ) : (
                <input
                  type="number"
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition"
          >
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </form>

        {predictedPrice !== null && (
          <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <h2 className="text-xl font-semibold text-blue-900">
              Estimated Price: ₹ {predictedPrice.toLocaleString()}
            </h2>
          </div>
        )}

        <footer className="text-center mt-10 text-sm text-blue-500">
          Made with ❤️ by <strong>Kajal Singh</strong> | AI-Powered Housing Intelligence
        </footer>
      </div>
    </div>
  );
}

export default App;
