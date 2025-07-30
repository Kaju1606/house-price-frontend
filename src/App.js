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
      const res = await axios.post("http://127.0.0.1:8000/predict", formData);
      setPredictedPrice(res.data.predicted_price);
    } catch (error) {
      alert("API Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #e0f7fa, #fff3e0);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .wrapper {
          width: 100%;
          max-width: 1280px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          padding: 60px 50px;
          margin: 30px;
        }
        h1 {
          text-align: center;
          font-size: 3rem;
          margin-bottom: 10px;
          color: #0d47a1;
        }
        .subheading {
          text-align: center;
          color: #555;
          font-size: 1.1rem;
          margin-bottom: 40px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }
        label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
          color: #1565c0;
        }
        input, select {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #bbdefb;
          border-radius: 12px;
          font-size: 1rem;
          background: #f9fbfd;
          color: #0d1b2a;
          transition: 0.3s;
        }
        input:focus, select:focus {
          border-color: #ffd600;
          outline: none;
          background: #fffde7;
        }
        button {
          grid-column: 1 / -1;
          background: linear-gradient(45deg, #42a5f5, #ffeb3b);
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 1.3rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.4s;
        }
        button:hover {
          background: linear-gradient(45deg, #1e88e5, #fdd835);
        }
        .result-box {
          margin-top: 30px;
          padding: 25px;
          background: #fff8e1;
          border-radius: 16px;
          text-align: center;
          font-size: 1.6rem;
          font-weight: bold;
          color: #0d47a1;
        }
        footer {
          text-align: center;
          margin-top: 40px;
          font-size: 0.9rem;
          color: #888;
        }
      `}</style>

      <div className="wrapper">
        <h1>🏠 Smart House Price Estimator</h1>
        <p className="subheading">
          Powered by AI & ML | Predict home prices with high accuracy using modern data-driven algorithms
        </p>

        <form onSubmit={handleSubmit} className="grid">
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
            <div key={key}>
              <label htmlFor={key}>{label}</label>
              {key === "floors" || key === "waterfront" || key === "view" || key === "condition" || key === "grade" ? (
                <select
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                >
                  {key === "waterfront" ? (
                    [0, 1].map((v) => <option key={v} value={v}>{v === 0 ? "No" : "Yes"}</option>)
                  ) : key === "view" ? (
                    [0, 1, 2, 3].map((v) => <option key={v} value={v}>{["None", "Average", "Good", "Excellent"][v]}</option>)
                  ) : key === "condition" ? (
                    [1, 2, 3, 4, 5].map((v) => (
                      <option key={v} value={v}>
                        {[
                          "Poor",
                          "Fair",
                          "Average",
                          "Good",
                          "Excellent"
                        ][v - 1]}
                      </option>
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
                  required
                />
              )}
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "🚀 Predict Price"}
          </button>
        </form>

        {predictedPrice !== null && (
          <div className="result-box">
            🎯 Estimated Price: ₹ {predictedPrice.toLocaleString()}
          </div>
        )}

        <footer>
          Made with ❤️ by <strong>Kajal Singh</strong> | AI-Powered Housing Intelligence
        </footer>
      </div>
    </>
  );
}

export default App;