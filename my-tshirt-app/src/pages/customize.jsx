import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Customize.css";


const dummyTshirts = [
  {
    id: 1,
    name: "Blue T-Shirt",
    baseImage: "/images/blue.png",
    colors: ["blue", "black", "white"],
  },
  {
    id: 2,
    name: "Red T-Shirt",
    baseImage: "/images/red.png",
    colors: ["red", "white", "black"],
  },
];

const Customize = () => {
  const { id } = useParams();
  const [tshirt, setTshirt] = useState(null);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [selectedColor, setSelectedColor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const found = dummyTshirts.find((t) => t.id === parseInt(id));
    setTshirt(found);
    if (found) setSelectedColor(found.colors[0]);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first.");

    const response = await fetch("http://localhost:8000/custom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tshirt_id: tshirt.id,
        text,
        text_color: textColor,
        selected_color: selectedColor,
      }),
    });

    if (response.ok) {
      setMessage("Submitted for approval!");
      setText("");
    } else {
      setMessage("Failed to submit.");
    }
  };

  if (!tshirt) return <p>Loading...</p>;

  return (
    <div className="custom-container">
      <h2>Customize: {tshirt.name}</h2>

      <div className="custom-preview">
        <img
          src={tshirt.baseImage}
          alt="T-shirt"
          className={`tshirt-image ${selectedColor}`}
        />
        <div className="custom-text" style={{ color: textColor }}>
          {text}
        </div>
      </div>

      <form className="custom-form" onSubmit={handleSubmit}>
        <label>
          Add Text:
          <input
            type="text"
            value={text}
            maxLength={20}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </label>

        <label>
          Text Color:
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </label>

        <label>
          T-Shirt Color:
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            {tshirt.colors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </label>

        <button type="submit">Submit for Approval</button>
      </form>

      {message && <p className="custom-msg">{message}</p>}
    </div>
  );
};

export default Customize;
