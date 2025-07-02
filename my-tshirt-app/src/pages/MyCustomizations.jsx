import { useEffect, useState } from 'react';
import api from '../api';

export default function MyCustomizations() {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    api.get('/custom/my').then(res => setDesigns(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Custom Designs</h2>
      {designs.length === 0 && <p>No customizations yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {designs.map(design => (
          <div key={design.id} className="border p-4 rounded shadow">
            <p><strong>Text:</strong> {design.text}</p>
            <p><strong>Text Color:</strong> <span style={{ color: design.text_color }}>{design.text_color}</span></p>
            <p><strong>Shirt Color:</strong> {design.selected_color}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${design.status === 'approved' ? 'text-green-600' : design.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{design.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
