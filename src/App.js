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
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictedPrice(null);
    try {
      const res = await axios.post(
        "https://house-price-backend-aopp.onrender.com/predict",
        formData
      );
      setPredictedPrice(res.data.predicted_price);
    } catch (error) {
      alert("API Error: " + error.message);
    }
    setLoading(false);
  };

  const fields = {
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
    yr_renovated: "Year Renovated",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #ffffff, #e6f0ff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "950px",
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "40px",
        boxShadow: "0 0 25px rgba(0, 84, 179, 0.15)"
      }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "30px",
          color: "#002b80",
          marginBottom: "5px"
        }}>Your Home's Future, Calculated Today</h1>

        <p style={{
          textAlign: "center",
          color: "#3366cc",
          fontSize: "16px",
          marginBottom: "25px"
        }}>
          Predict house prices using Machine Learning
        </p>

        <p style={{
          textAlign: "center",
          color: "#004080",
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "25px"
        }}>
          Wait for 30 seconds only after clicking Predict!
        </p>

        <form onSubmit={handleSubmit} style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}>
          {Object.entries(fields).map(([key, label]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor={key} style={{
                marginBottom: "6px",
                fontWeight: "bold",
                color: "#003366"
              }}>{label}</label>

              {/* DROPDOWN FIELDS */}
              {(key === "bedrooms" || key === "bathrooms" || key === "floors" || key === "waterfront" || key === "view" || key === "condition" || key === "grade") ? (
                <select
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  style={{
                    padding: "10px",
                    border: "1px solid #aad4ff",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                >
                  {key === "bedrooms" || key === "bathrooms" ? (
                    [...Array(11).keys()].slice(1).map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))
                  ) : key === "waterfront" ? (
                    [0, 1].map((v) => (
                      <option key={v} value={v}>{v === 0 ? "No" : "Yes"}</option>
                    ))
                  ) : key === "view" ? (
                    [0, 1, 2, 3].map((v) => (
                      <option key={v} value={v}>{["None", "Average", "Good", "Excellent"][v]}</option>
                    ))
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
                // INPUT FIELDS
                <input
                  type="number"
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  style={{
                    padding: "10px",
                    border: "1px solid #aad4ff",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              gridColumn: "span 2",
              padding: "15px",
              backgroundColor: "#004080",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </form>

        {predictedPrice !== null && (
          <div style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f0f8ff",
            border: "1px solid #aaccee",
            borderRadius: "10px",
            textAlign: "center",
            fontSize: "18px",
            color: "#002244"
          }}>
            <h2>Estimated Price: ₹ {predictedPrice.toLocaleString()}</h2>
          </div>
        )}

        <footer style={{
          marginTop: "30px",
          textAlign: "center",
          color: "#6699cc",
          fontSize: "14px"
        }}>
          Made with ❤️ by <strong>Kajal Singh</strong> | AI-Powered Housing Intelligence
        </footer>
      </div>
    </div>
  );
}

export default App;
