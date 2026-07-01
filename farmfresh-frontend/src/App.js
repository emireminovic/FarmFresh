import { useState, useEffect } from "react";

const API = "https://farmfresh-production-d270.up.railway.app/api/v1";

const token = () => localStorage.getItem("token");
const getPreferredUnits = () => {
  try {
    return localStorage.getItem("preferredUnits") || "metric";
  } catch { return "metric"; }
};

const headers = (currency = "RSD", units = null) => ({ 
  "Content-Type": "application/json", 
  Authorization: `Bearer ${token()}`,
  "X-Currency": currency,
  "X-Units": units || getPreferredUnits()
});



const getRole = () => {
  try {
    const payload = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch { return ""; }
};

function Login({ onLogin, onShowRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        onLogin(data.accessToken);
      } else {
        setError("Pogrešan email ili lozinka.");
      }
    } catch {
      setError("Greška pri povezivanju sa serverom.");
    }
  };

  return (
    <div style={ls.wrap}>
      <div style={ls.left}>
        <div style={ls.leaf1} />
        <div style={ls.leaf2} />
        <div style={ls.leaf3} />
        <div style={ls.leftContent}>
          <div style={ls.tagline}>
            <span style={{ fontSize: 32 }}>🌱</span>
            <span style={ls.brandName}>FarmFresh</span>
          </div>
          <h1 style={ls.leftTitle}>Direktno od farmera do vašeg stola</h1>
          <p style={ls.leftSub}>Lokalni proizvodi, sveži i autentični. Povežite se sa farmerima u vašoj regiji.</p>
        </div>
      </div>

      <div style={ls.right}>
        <div style={ls.tabs}>
          <div style={{ ...ls.tab, ...ls.tabActive }}>Prijava</div>
          <div style={ls.tab} onClick={onShowRegister}>Registracija</div>
        </div>

        <div>
          <div style={ls.field}>
            <label style={ls.label}>EMAIL ADRESA</label>
            <input
              style={ls.input}
              type="email"
              placeholder="vasa@email.com"
              value={form.email}
              onChange={f("email")}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>
          <div style={ls.field}>
            <label style={ls.label}>LOZINKA</label>
            <input
              style={ls.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={f("password")}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>
          {error && <p style={ls.error}>{error}</p>}
          <button style={ls.btnPrimary} onClick={submit}>Prijavi se</button>
        </div>
      </div>
    </div>
  );
}

function Register({ onBack }) {
  const [form, setForm] = useState({ email: "", password: "", role: "Customer" });
  const [msg, setMsg] = useState("");
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.id) setMsg("Registracija uspješna! Možete se prijaviti.");
    else setMsg("Greška pri registraciji.");
  };

  return (
    <div style={ls.wrap}>
      <div style={ls.left}>
        <div style={ls.leaf1} />
        <div style={ls.leaf2} />
        <div style={ls.leaf3} />
        <div style={ls.leftContent}>
          <div style={ls.tagline}>
            <span style={{ fontSize: 32 }}>🌱</span>
            <span style={ls.brandName}>FarmFresh</span>
          </div>
          <h1 style={ls.leftTitle}>Direktno od farmera do vašeg stola</h1>
          <p style={ls.leftSub}>Lokalni proizvodi, sveži i autentični. Povežite se sa farmerima u vašoj regiji.</p>
        </div>
      </div>

      <div style={ls.right}>
        <div style={ls.tabs}>
          <div style={ls.tab} onClick={onBack}>Prijava</div>
          <div style={{ ...ls.tab, ...ls.tabActive }}>Registracija</div>
        </div>

        <div>
          <div style={ls.field}>
            <label style={ls.label}>EMAIL ADRESA</label>
            <input
              style={ls.input}
              type="email"
              placeholder="vasa@email.com"
              value={form.email}
              onChange={f("email")}
            />
          </div>
          <div style={ls.field}>
            <label style={ls.label}>LOZINKA</label>
            <input
              style={ls.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={f("password")}
            />
          </div>

          <div style={ls.field}>
            <label style={ls.label}>REGISTRUJ SE KAO</label>
            <div style={ls.roleGrid}>
              <div
                style={{ ...ls.roleBtn, ...(form.role === "Customer" ? ls.roleBtnSelected : {}) }}
                onClick={() => setForm({ ...form, role: "Customer" })}
              >
                <span style={{ fontSize: 22 }}>👤</span>
                <span style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>Kupac</span>
              </div>
              <div
                style={{ ...ls.roleBtn, ...(form.role === "Farmer" ? ls.roleBtnSelected : {}) }}
                onClick={() => setForm({ ...form, role: "Farmer" })}
              >
                <span style={{ fontSize: 22 }}>🚜</span>
                <span style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>Farmer</span>
              </div>
            </div>
          </div>

          {msg ? (
            <div style={ls.successMsg}>
              <span>✅</span>
              <span>{msg}</span>
              <button style={{ ...ls.btnPrimary, marginTop: 12 }} onClick={onBack}>
                Idi na prijavu
              </button>
            </div>
          ) : (
            <button style={ls.btnPrimary} onClick={submit}>Registruj se</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Products({ cart, setCart, currency }) {
   const role = getRole();
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState({});
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [regionFilter, setRegionFilter] = useState("");
  const [farmFilter, setFarmFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showSeason, setShowSeason] = useState(false);

  useEffect(() => {
    fetch(`${API}/products`, { headers: headers(currency) }).then(r => r.json()).then(setProducts);
  }, [currency]);

  useEffect(() => {
    fetch(`${API}/profiles/farmers`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        const map = {};
        data.forEach(f => { map[f.id] = f; });
        setFarmers(map);
      })
      .catch(() => {});
  }, []);

  const regions = [...new Set(Object.values(farmers).map(f => f.location).filter(Boolean))];
  const farms = Object.values(farmers);

  const filtered = products.filter(p => {
    const farmer = farmers[p.farmerProfileId];
    const matchSearch = p.name?.toLowerCase().includes(filter.toLowerCase()) || p.category?.toLowerCase().includes(filter.toLowerCase());
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    const matchOrganic = !organicOnly || p.growingMethod === "organski";
    const matchRegion = !regionFilter || farmer?.location === regionFilter;
    const matchFarm = !farmFilter || p.farmerProfileId === farmFilter;
    const matchDate = !dateFilter || !p.availableFrom || new Date(p.availableFrom) <= new Date(dateFilter);
    return matchSearch && matchCategory && matchOrganic && matchRegion && matchFarm && matchDate;
  });

  const seasonItems = products.filter(p => p.status === "Available");

  const addToCart = (p) => {
    const existing = cart.find(c => c.id === p.id);
    if (existing) setCart(cart.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { ...p, qty: 1 }]);
  };

  return (
    <div style={s.page}>
      <h2>Katalog proizvoda</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input style={{ ...s.input, width: 180, marginBottom: 0 }} placeholder="🔍 Pretraži..." value={filter} onChange={e => setFilter(e.target.value)} />
        <select style={{ ...s.input, width: 160, marginBottom: 0 }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">Sve kategorije</option>
          {["povrće","voće","mlečno","jaja","meso","peciva","med","sokovi","suvo voće"].map(c => <option key={c}>{c}</option>)}
        </select>
        <select style={{ ...s.input, width: 160, marginBottom: 0 }} value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
          <option value="">Sve regije</option>
          {regions.map(r => <option key={r}>{r}</option>)}
        </select>
        <select style={{ ...s.input, width: 180, marginBottom: 0 }} value={farmFilter} onChange={e => setFarmFilter(e.target.value)}>
          <option value="">Sve farme</option>
          {farms.map(f => <option key={f.id} value={f.id}>{f.farmName}</option>)}
        </select>
        <input style={{ ...s.input, width: 160, marginBottom: 0 }} type="date" title="Dostupno do datuma" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={organicOnly} onChange={e => setOrganicOnly(e.target.checked)} />
          🌿 Organski
        </label>
        <button style={{ ...s.btn, width: "auto", padding: "8px 16px" }} onClick={() => setShowSeason(!showSeason)}>
          🌱 {showSeason ? "Sakrij sezonu" : "Šta je danas u sezoni?"}
        </button>
      </div>

      {showSeason && (
        <div style={{ background: "#f0f9f4", border: "1px solid #c3e6cb", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>🌱 Danas u sezoni — {new Date().toLocaleDateString()}</h3>
          <div style={s.grid}>
            {seasonItems.map(p => (
              <div key={p.id} style={{ ...s.productCard, background: "#f8fff9" }}>
                <strong>{p.name}</strong>
                <p style={{ fontSize: 13, color: "#888" }}>{p.category}</p>
                <p style={{ fontSize: 13 }}>{farmers[p.farmerProfileId]?.farmName}</p>
                <p><strong>{p.price} {currency} / {p.unit}</strong></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={s.grid}>
        {filtered.map(p => (
          <div key={p.id} style={s.productCard}>
            {p.imageUrl && (
            <img
            src={p.imageUrl}
            alt={p.name}
            style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
            />
            )}
            <p style={{ color: "#2d6a4f", fontSize: 12, fontWeight: "bold", marginBottom: 4 }}>🏡 {farmers[p.farmerProfileId]?.farmName || "Nepoznata farma"}</p>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>📍 {farmers[p.farmerProfileId]?.location || ""}</p>
            <h3 style={{ marginTop: 0 }}>{p.name}</h3>
            <p style={{ color: "#888", fontSize: 13 }}>{p.category}</p>
            <p>{p.description}</p>
            <p><strong>{p.price} {currency} / {p.unit}</strong></p>
            <p style={{ color: "#2d6a4f", fontSize: 13 }}>{p.growingMethod === "organski" ? "🌿 Organski" : "🌾 Konvencionalni"}</p>
            <span style={{ ...s.badge, background: p.status === "Available" ? "#d4edda" : p.status === "Coming-soon" ? "#fff3cd" : "#f8d7da", color: p.status === "Available" ? "#155724" : p.status === "Coming-soon" ? "#856404" : "#721c24" }}>
              {p.status === "Available" ? "✓ Dostupno" : p.status === "Coming-soon" ? "🕐 Uskoro" : "✗ Rasprodato"}
            </span>
            {p.availableFrom && p.status === "Coming-soon" && <p style={{ fontSize: 12, color: "#856404" }}>📅 Dostupno od: {new Date(p.availableFrom).toLocaleDateString()}</p>}
            {p.note && <p style={{ fontStyle: "italic", fontSize: 13 }}>📝 {p.note}</p>}
           {p.status === "Available" && role !== "Farmer" && <button style={{ ...s.btn, marginTop: "auto" }} onClick={() => addToCart(p)}>+ Dodaj u korpu</button>}
            {p.status !== "Available" && <button style={{ ...s.btn, marginTop: "auto", background: "#aaa", cursor: "not-allowed" }} disabled>Nije dostupno</button>}
          </div>
        ))}
        {filtered.length === 0 && <p>Nema proizvoda koji odgovaraju filterima.</p>}
      </div>
    </div>
  );
}

function AddProduct() {
  const [form, setForm] = useState({
    name: "", description: "", category: "povrće", price: "",
    unit: "kg", growingMethod: "organski", note: "",
    status: "Available", availableFrom: "", imageUrl: ""
  });
  const [msg, setMsg] = useState("");
  const [farmerProfileId, setFarmerProfileId] = useState("");
  const [uploading, setUploading] = useState(false);
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1]))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    fetch(`${API}/profiles/farmer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => { if (data.id) setFarmerProfileId(data.id); })
      .catch(() => {});
  }, []);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/uploads/product-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` }, // bez Content-Type, browser ga sam setuje za FormData
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        setMsg("Greška pri uploadu: " + JSON.stringify(data));
      }
    } catch (err) {
      setMsg("Greška pri uploadu: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!farmerProfileId) { setMsg("Greška: Prvo kreirajte farmer profil!"); return; }
    const body = {
      farmerProfileId,
      name: form.name,
      description: form.description,
      category: form.category,
      price: parseFloat(form.price),
      unit: form.unit,
      growingMethod: form.growingMethod,
      note: form.note,
      status: form.status,
      imageUrl: form.imageUrl || null
    };
    if (form.availableFrom) body.availableFrom = new Date(form.availableFrom).toISOString();
    const res = await fetch(`${API}/products`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    const data = await res.json();
    if (data.id) {
      setMsg("✅ Proizvod dodan!");
      setForm({ name: "", description: "", category: "povrće", price: "", unit: "kg", growingMethod: "organski", note: "", status: "Available", availableFrom: "", imageUrl: "" });
    } else {
      setMsg("Greška: " + JSON.stringify(data));
    }
  };

  return (
    <div style={s.page}>
      <h2>Dodaj proizvod</h2>
      {farmerProfileId && <p style={{ color: "#2d6a4f" }}>✓ Farmer profil učitan</p>}
      {!farmerProfileId && <p style={{ color: "red" }}>⚠ Kreirajte farmer profil prvo!</p>}
      <div style={{ maxWidth: 500 }}>
        <input style={s.input} placeholder="Naziv *" value={form.name} onChange={f("name")} />
        <input style={s.input} placeholder="Opis" value={form.description} onChange={f("description")} />
        <select style={s.input} value={form.category} onChange={f("category")}>
          {["povrće","voće","mlečno","jaja","meso","peciva","med","sokovi","suvo voće"].map(c => <option key={c}>{c}</option>)}
        </select>
        <input style={s.input} placeholder="Cijena *" type="number" value={form.price} onChange={f("price")} />
        <select style={s.input} value={form.unit} onChange={f("unit")}>
          {["kg","komad","litar","vez","gram"].map(u => <option key={u}>{u}</option>)}
        </select>
        <select style={s.input} value={form.growingMethod} onChange={f("growingMethod")}>
          <option value="organski">🌿 Organski</option>
          <option value="konvencionalni">🌾 Konvencionalni</option>
        </select>
        <select style={s.input} value={form.status} onChange={f("status")}>
          <option value="Available">✓ Dostupno</option>
          <option value="Sold-out">✗ Rasprodato</option>
          <option value="Coming-soon">🕐 Uskoro dostupno</option>
        </select>
        {form.status === "Coming-soon" && (
          <input style={s.input} type="date" placeholder="Datum dostupnosti" value={form.availableFrom} onChange={f("availableFrom")} />
        )}
        <input style={s.input} placeholder="Beleška (npr. ovonedeljna berba)" value={form.note} onChange={f("note")} />

        {/* Upload slike */}
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Slika proizvoda:</label>
        <div style={{ border: "2px dashed #c3e6cb", borderRadius: 8, padding: 16, marginBottom: 12, textAlign: "center", background: "#f9fffe" }}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={uploadImage}
            style={{ display: "none" }}
            id="imgUpload"
          />
          <label htmlFor="imgUpload" style={{ cursor: "pointer" }}>
            {uploading ? (
              <p style={{ color: "#2d6a4f", margin: 0 }}>⏳ Uploading...</p>
            ) : form.imageUrl ? (
              <>
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                />
                <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Klikni da promeniš sliku</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 28, margin: "0 0 8px" }}>📷</p>
                <p style={{ color: "#2d6a4f", fontWeight: 500, margin: 0 }}>Klikni da dodaš sliku</p>
                <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>JPG, PNG, WEBP — max 5MB</p>
              </>
            )}
          </label>
        </div>

        {msg && <p style={{ color: msg.includes("✅") ? "green" : "red" }}>{msg}</p>}
        <button style={s.btn} onClick={submit} disabled={uploading}>
          {uploading ? "Čekaj upload..." : "Dodaj proizvod"}
        </button>
      </div>
    </div>
  );
}



function Cart({ cart, setCart, currency }) {
  const [deliveryType, setDeliveryType] = useState("FarmPickup");
  const [confirmation, setConfirmation] = useState(null);
  const [address, setAddress] = useState({ name: "", street: "", city: "", postal: "", phone: "" });
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const deliveryFee = deliveryType === "HomeDelivery" ? 300 : 0;

  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id));

  // Učitaj slotove kada se promeni tip dostave
  useEffect(() => {
    if (deliveryType !== "FarmPickup" && deliveryType !== "DropPoint") { setSlots([]); return; }
    if (cart.length === 0) return;

    // Uzmi unique farmerProfileId-eve iz korpe
    const farmerIds = [...new Set(cart.map(c => c.farmerProfileId))];

    // Učitaj slotove za sve farmere
    Promise.all(farmerIds.map(id =>
      fetch(`${API}/deliveryslots/${id}`, { headers: headers() }).then(r => r.json())
    )).then(results => {
      const allSlots = results.flat().filter(s => s.type === deliveryType);
      setSlots(Array.isArray(allSlots) ? allSlots : []);
      setSelectedSlot("");
    }).catch(() => {});
  }, [deliveryType, cart]);

  const order = async () => {
    if ((deliveryType === "FarmPickup" || deliveryType === "DropPoint") && !selectedSlot) {
      alert("Molimo izaberite termin preuzimanja.");
      return;
    }
    if (deliveryType === "HomeDelivery" && (!address.name || !address.street || !address.city || !address.phone)) {
      alert("Molimo popunite sve podatke za dostavu.");
      return;
    }
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: headers(currency),
        body: JSON.stringify({
          deliveryType,
          currency,
          userId: "00000000-0000-0000-0000-000000000000",
          items: cart.map(c => ({ productId: c.id, farmerProfileId: c.farmerProfileId, quantity: c.qty, unitPrice: c.price, unit: c.unit }))
        })
      });
      const text = await res.text();
      if (!text) { alert("Prazan odgovor od API"); return; }
      const data = JSON.parse(text);
      if (data.id) {
        // Rezerviši slot ako je izabran
        if (selectedSlot) {
          await fetch(`${API}/deliveryslots/${selectedSlot}/book`, { method: "POST", headers: headers() });
        }
        const slot = slots.find(s => s.id === selectedSlot);
        setConfirmation({
          id: data.id, items: [...cart], total: total + deliveryFee,
          deliveryType, currency,
          address: deliveryType === "HomeDelivery" ? {...address} : null,
          slot: slot || null
        });
        setCart([]);
      } else {
        alert("Greška: " + JSON.stringify(data));
      }
    } catch(err) {
      alert("Greška: " + err.message);
    }
  };

  if (confirmation) return (
    <div style={s.page}>
      <div style={{ ...s.productCard, maxWidth: 600, margin: "0 auto", padding: 32, textAlign: "center" }}>
        <h2 style={{ color: "#2d6a4f" }}>✅ Hvala na porudžbini!</h2>
        <p style={{ color: "#888" }}>ID porudžbine:</p>
        <p style={{ fontFamily: "monospace", background: "#f0f4f0", padding: 8, borderRadius: 6 }}>{confirmation.id}</p>
        <hr />
        <h3>Detalji porudžbine</h3>
        {confirmation.items.map(c => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span>{c.name} × {c.qty}</span>
            <strong>{(c.price * c.qty).toFixed(2)} {confirmation.currency}</strong>
          </div>
        ))}
        {confirmation.deliveryType === "HomeDelivery" && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span>🚚 Naknada za dostavu</span>
            <strong>300.00 {confirmation.currency}</strong>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontSize: 18 }}>
          <strong>Ukupno:</strong>
          <strong style={{ color: "#2d6a4f" }}>{confirmation.total.toFixed(2)} {confirmation.currency}</strong>
        </div>
        <p>🚚 Dostava: {confirmation.deliveryType === "FarmPickup" ? "Lično preuzimanje na farmi" : confirmation.deliveryType === "DropPoint" ? "Drop point" : "Kućna dostava"}</p>
        {confirmation.slot && (
          <div style={{ background: "#f0f9f4", padding: 12, borderRadius: 8, marginTop: 8, textAlign: "left" }}>
            <p style={{ margin: "0 0 4px", fontWeight: 600 }}>📅 Termin preuzimanja:</p>
            <p style={{ margin: "0 0 4px" }}>{new Date(confirmation.slot.slotTime).toLocaleString()}</p>
            <p style={{ margin: 0, color: "#888" }}>📍 {confirmation.slot.location}</p>
          </div>
        )}
        {confirmation.address && (
          <div style={{ textAlign: "left", background: "#f0f4f0", padding: 12, borderRadius: 8, marginTop: 8 }}>
            <p>📦 Dostava na adresu:</p>
            <p><strong>{confirmation.address.name}</strong></p>
            <p>{confirmation.address.street}, {confirmation.address.city} {confirmation.address.postal}</p>
            <p>📞 {confirmation.address.phone}</p>
          </div>
        )}
        <button style={{ ...s.btn, marginTop: 16 }} onClick={() => setConfirmation(null)}>Nova porudžbina</button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <h2>Korpa</h2>
      {cart.length === 0 ? <p>Korpa je prazna.</p> : (
        <>
          {cart.map(c => (
            <div key={c.id} style={{ ...s.productCard, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div><strong>{c.name}</strong> × {c.qty} = {(c.price * c.qty).toFixed(2)} {currency}</div>
              <button onClick={() => removeFromCart(c.id)} style={{ background: "#dc3545", color: "white", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>×</button>
            </div>
          ))}
          <p style={{ fontSize: 18 }}><strong>Ukupno: {total.toFixed(2)} {currency}</strong></p>

          <select style={{ ...s.input, width: 300 }} value={deliveryType} onChange={e => setDeliveryType(e.target.value)}>
            <option value="FarmPickup">Lično preuzimanje na farmi</option>
            <option value="DropPoint">Drop point</option>
            <option value="HomeDelivery">Kućna dostava</option>
          </select>

          {/* Izbor slota za FarmPickup i DropPoint */}
          {(deliveryType === "FarmPickup" || deliveryType === "DropPoint") && (
            <div style={{ background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <h4 style={{ marginTop: 0, marginBottom: 12, color: "#2d6a4f" }}>
                📅 {deliveryType === "FarmPickup" ? "Izaberite termin preuzimanja na farmi" : "Izaberite Drop point termin"}
              </h4>
              {slots.length === 0 ? (
                <p style={{ color: "#888", fontSize: 13 }}>
                  Farmer nije kreirao termine za ovaj tip dostave. Kontaktirajte farmera direktno.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {slots.map(slot => (
                    <label key={slot.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: selectedSlot === slot.id ? "#f0f9f4" : "white",
                      border: `1px solid ${selectedSlot === slot.id ? "#2d6a4f" : "#ddd"}`,
                      borderRadius: 8, padding: "10px 14px", cursor: "pointer"
                    }}>
                      <input type="radio" name="slot" value={slot.id} checked={selectedSlot === slot.id}
                        onChange={() => setSelectedSlot(slot.id)} />
                      <div>
                        <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>
                          {new Date(slot.slotTime).toLocaleString()}
                        </p>
                        <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
                          📍 {slot.location} — {slot.currentBookings}/{slot.maxCapacity} rezervisano
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {deliveryType === "HomeDelivery" && (
            <div style={{ background: "#f0f4f0", padding: 16, borderRadius: 8, marginBottom: 12 }}>
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>📦 Podaci za dostavu</h4>
              <input style={s.input} placeholder="Ime i prezime *" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
              <input style={s.input} placeholder="Ulica i broj *" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
              <input style={s.input} placeholder="Grad *" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
              <input style={s.input} placeholder="Poštanski broj" value={address.postal} onChange={e => setAddress({...address, postal: e.target.value})} />
              <input style={s.input} placeholder="Broj telefona *" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
              <p style={{ fontSize: 13, color: "#666", margin: 0 }}>🚚 Naknada za dostavu: 300.00 {currency}</p>
            </div>
          )}

          {deliveryType === "HomeDelivery" && (
            <p style={{ fontSize: 16 }}><strong>Ukupno sa dostavom: {(total + deliveryFee).toFixed(2)} {currency}</strong></p>
          )}

          <button style={s.btn} onClick={order}>Naruči</button>
        </>
      )}
    </div>
  );
}


function FarmerDeliverySlots() {
  const [farmerProfileId, setFarmerProfileId] = useState("");
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ type: "FarmPickup", location: "", slotTime: "", maxCapacity: "" });
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  const loadSlots = (fId) => {
    fetch(`${API}/deliveryslots/${fId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => setSlots(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    fetch(`${API}/profiles/farmer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (data?.id) { setFarmerProfileId(data.id); loadSlots(data.id); }
      }).catch(() => {});
  }, []);

  const createSlot = async () => {
    if (!farmerProfileId) { setMsg("❌ Farmer profil nije učitan!"); return; }
    if (!form.location || !form.slotTime || !form.maxCapacity) { setMsg("❌ Popunite sva polja!"); return; }
    const res = await fetch(`${API}/deliveryslots`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({
        farmerProfileId,
        type: form.type,
        location: form.location,
        slotTime: new Date(form.slotTime).toISOString(),
        maxCapacity: parseInt(form.maxCapacity)
      })
    });
    const data = await res.json();
    if (data.id) {
      setMsg("✅ Termin kreiran!");
      setForm({ type: "FarmPickup", location: "", slotTime: "", maxCapacity: "" });
      setShowForm(false);
      loadSlots(farmerProfileId);
    } else {
      setMsg("❌ Greška: " + JSON.stringify(data));
    }
  };

  const deleteSlot = async (id) => {
    const res = await fetch(`${API}/deliveryslots/${id}`, { method: "DELETE", headers: headers() });
    const data = await res.json();
    if (data.success) {
      setSlots(slots.filter(s => s.id !== id));
      setMsg("✅ Termin uklonjen.");
    }
  };

  return (
    <div style={s.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>📅 Termini preuzimanja</h2>
        <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Zatvori" : "+ Novi termin"}
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${msg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: msg.includes("✅") ? "#1a4731" : "#721c24" }}>
          {msg}
        </div>
      )}

      {showForm && (
        <div style={{ background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 12, padding: 24, marginBottom: 24, maxWidth: 500 }}>
          <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>Novi termin</h3>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>TIP</label>
          <select style={s.input} value={form.type} onChange={f("type")}>
            <option value="FarmPickup">🏡 Lično preuzimanje na farmi</option>
            <option value="DropPoint">📍 Drop point</option>
          </select>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>LOKACIJA *</label>
          <input style={s.input} placeholder="npr. Farma, Kruševac ili Ispred crkve u centru" value={form.location} onChange={f("location")} />
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>DATUM I VREME *</label>
          <input style={s.input} type="datetime-local" value={form.slotTime} onChange={f("slotTime")} min={new Date().toISOString().slice(0, 16)} />
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>MAX KAPACITET *</label>
          <input style={s.input} type="number" placeholder="npr. 10" value={form.maxCapacity} onChange={f("maxCapacity")} />
          <button style={s.btn} onClick={createSlot}>Kreiraj termin</button>
        </div>
      )}

      <h3 style={{ color: "#555" }}>Moji termini ({slots.length})</h3>
      {slots.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
          <p style={{ fontSize: 40 }}>📅</p>
          <p>Nemate kreiranih termina.</p>
          <button style={{ ...s.btn, width: "auto", padding: "10px 24px" }} onClick={() => setShowForm(true)}>
            Kreirajte prvi termin
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {slots.map(slot => (
            <div key={slot.id} style={{ background: "white", borderRadius: 10, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ ...s.badge, background: slot.type === "FarmPickup" ? "#d4edda" : "#fff3cd", color: slot.type === "FarmPickup" ? "#155724" : "#856404", fontSize: 12 }}>
                    {slot.type === "FarmPickup" ? "🏡 Farma" : "📍 Drop point"}
                  </span>
                  <strong style={{ fontSize: 14 }}>{new Date(slot.slotTime).toLocaleString()}</strong>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#888" }}>📍 {slot.location}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>👥 {slot.currentBookings}/{slot.maxCapacity} rezervisano</p>
              </div>
              <button onClick={() => deleteSlot(slot.id)} style={{ background: "#dc3545", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>
                🗑 Ukloni
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function OpenFarmEvents() {
  const role = getRole();

  // ─── SHARED STATE ───
  const [events, setEvents] = useState([]);
  const [farmers, setFarmers] = useState({});
  const [msg, setMsg] = useState("");

  // ─── FARMER STATE ───
  const [farmerProfileId, setFarmerProfileId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "", description: "", program: "",
    eventDate: "", maxVisitors: "", price: ""
  });
  const [createMsg, setCreateMsg] = useState("");

  // ─── CUSTOMER STATE ───
  const [customerProfileId, setCustomerProfileId] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reviews, setReviews] = useState({});
  const [reviewForm, setReviewForm] = useState({ comment: "", photoUrl: "" });
  const [reviewMsg, setReviewMsg] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [uploadingReview, setUploadingReview] = useState(false); // ← NOVO

  const cf = k => e => setCreateForm({ ...createForm, [k]: e.target.value });

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  const loadEvents = () => {
    fetch(`${API}/openfarm`, { headers: headers() })
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    loadEvents();

    fetch(`${API}/profiles/farmers`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        const map = {};
        data.forEach(f => { map[f.id] = f; });
        setFarmers(map);
      })
      .catch(() => {});

    const userId = getUserId();
    if (!userId) return;

    if (role === "Farmer") {
      fetch(`${API}/profiles/farmer/${userId}`, { headers: headers() })
        .then(r => r.json())
        .then(data => { if (data?.id) setFarmerProfileId(data.id); })
        .catch(() => {});
    }

    if (role === "Customer") {
      fetch(`${API}/profiles/customer/${userId}`, { headers: headers() })
        .then(r => r.json())
        .then(data => {
          if (data?.id) {
            setCustomerProfileId(data.id);
            fetch(`${API}/openfarm/my-registrations/${data.id}`, { headers: headers() })
              .then(r => r.json())
              .then(ids => setRegisteredEvents(Array.isArray(ids) ? ids : []))
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    fetch(`${API}/openfarm/${selectedEvent.id}/reviews`, { headers: headers() })
      .then(r => r.json())
      .then(data => setReviews(prev => ({ ...prev, [selectedEvent.id]: Array.isArray(data) ? data : [] })))
      .catch(() => {});
  }, [selectedEvent]);

  const createEvent = async () => {
    if (!farmerProfileId) { setCreateMsg("❌ Farmer profil nije učitan!"); return; }
    if (!createForm.title || !createForm.eventDate || !createForm.maxVisitors || !createForm.price) {
      setCreateMsg("❌ Popunite sva obavezna polja!"); return;
    }
    const res = await fetch(`${API}/openfarm`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({
        farmerProfileId,
        title: createForm.title,
        description: createForm.description,
        program: createForm.program,
        eventDate: new Date(createForm.eventDate).toISOString(),
        maxVisitors: parseInt(createForm.maxVisitors),
        price: parseFloat(createForm.price)
      })
    });
    const data = await res.json();
    if (data.id) {
      setCreateMsg("✅ Događaj kreiran!");
      setShowCreateForm(false);
      setCreateForm({ title: "", description: "", program: "", eventDate: "", maxVisitors: "", price: "" });
      loadEvents();
    } else {
      setCreateMsg("❌ Greška: " + JSON.stringify(data));
    }
  };

  const register = async (eventId) => {
    if (!customerProfileId) { setMsg("❌ Potreban Customer profil!"); return; }
    const res = await fetch(`${API}/openfarm/${eventId}/register`, {
      method: "POST", headers: headers(),
      body: JSON.stringify(customerProfileId)
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (res.ok && data.id) {
      setMsg("✅ Uspješno prijavljeni na događaj!");
      setRegisteredEvents([...registeredEvents, eventId]);
      setEvents(events.map(e => e.id === eventId ? { ...e, currentRegistrations: e.currentRegistrations + 1 } : e));
    } else {
      setMsg("❌ " + (data.message || data.title || "Greška pri prijavi."));
    }
  };

  // upload fotografije za utisak
  const uploadReviewPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingReview(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/uploads/event-review-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setReviewForm(prev => ({ ...prev, photoUrl: data.url }));
        setReviewMsg("✅ Fotografija uploadovana!");
      } else {
        setReviewMsg("❌ Greška pri uploadu.");
      }
    } catch (err) {
      setReviewMsg("❌ Greška: " + err.message);
    } finally {
      setUploadingReview(false);
    }
  };

  const submitReview = async (eventId) => {
    if (!customerProfileId) { setReviewMsg("❌ Potreban Customer profil!"); return; }
    if (!reviewForm.comment) { setReviewMsg("❌ Unesite komentar!"); return; }
    const res = await fetch(`${API}/openfarm/${eventId}/review`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({
        customerProfileId,
        comment: reviewForm.comment,
        photoUrl: reviewForm.photoUrl || null
      })
    });
    const data = await res.json();
    if (data.id) {
      setReviewMsg("✅ Utisak dodan!");
      setReviewForm({ comment: "", photoUrl: "" });
      setShowReviewForm(null);
      fetch(`${API}/openfarm/${eventId}/reviews`, { headers: headers() })
        .then(r => r.json())
        .then(data => setReviews(prev => ({ ...prev, [eventId]: Array.isArray(data) ? data : [] })))
        .catch(() => {});
    } else {
      setReviewMsg("❌ Greška: " + JSON.stringify(data));
    }
  };

  const isPast = (date) => new Date(date) < new Date();
  const isFull = (e) => e.currentRegistrations >= e.maxVisitors;

  const myEvents = events.filter(e => e.farmerProfileId === farmerProfileId);

  // ════════════════════════════════
  // FARMER POGLED
  // ════════════════════════════════
  if (role === "Farmer") {
    return (
      <div style={s.page}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0 }}>🚜 Open Farm događaji</h2>
          <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "✕ Zatvori" : "+ Novi događaj"}
          </button>
        </div>

        {createMsg && (
          <div style={{ background: createMsg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${createMsg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: createMsg.includes("✅") ? "#1a4731" : "#721c24" }}>
            {createMsg}
          </div>
        )}

        {showCreateForm && (
          <div style={{ background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>Novi Open Farm događaj</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>NAZIV DOGAĐAJA *</label>
                <input style={s.input} placeholder="npr. Dan berbe jabuka" value={createForm.title} onChange={cf("title")} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>OPIS</label>
                <input style={s.input} placeholder="Kratki opis događaja..." value={createForm.description} onChange={cf("description")} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>PROGRAM</label>
                <textarea
                  style={{ ...s.input, height: 100, resize: "vertical" }}
                  placeholder="10:00 Dolazak i doček&#10;11:00 Obilazak voćnjaka&#10;12:00 Zajednička berba&#10;13:00 Ručak"
                  value={createForm.program}
                  onChange={cf("program")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>DATUM I VREME *</label>
                <input style={s.input} type="datetime-local" value={createForm.eventDate} onChange={cf("eventDate")} min={new Date().toISOString().slice(0, 16)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>CIJENA (RSD) *</label>
                <input style={s.input} type="number" placeholder="npr. 500" value={createForm.price} onChange={cf("price")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>MAX POSETILACA *</label>
                <input style={s.input} type="number" placeholder="npr. 20" value={createForm.maxVisitors} onChange={cf("maxVisitors")} />
              </div>
            </div>
            <button style={{ ...s.btn, marginTop: 16 }} onClick={createEvent}>Kreiraj događaj</button>
          </div>
        )}

        <h3 style={{ color: "#555" }}>Moji događaji ({myEvents.length})</h3>
        {myEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
            <p style={{ fontSize: 40 }}>🚜</p>
            <p>Nemate kreiranih događaja.</p>
            <button style={{ ...s.btn, width: "auto", padding: "10px 24px" }} onClick={() => setShowCreateForm(true)}>
              Kreirajte prvi događaj
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {myEvents.map(e => (
              <div key={e.id} style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${isPast(e.eventDate) ? "#888" : "#2d6a4f"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", color: "#2d6a4f" }}>{e.title}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{e.description}</p>
                  </div>
                  <span style={{ ...s.badge, background: isPast(e.eventDate) ? "#f8f9fa" : "#d4edda", color: isPast(e.eventDate) ? "#888" : "#155724", fontSize: 13, padding: "4px 14px" }}>
                    {isPast(e.eventDate) ? "Završen" : "Predstojeći"}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 16 }}>
                  {[
                    { label: "DATUM", value: new Date(e.eventDate).toLocaleString() },
                    { label: "POSETILACI", value: `${e.currentRegistrations}/${e.maxVisitors}` },
                    { label: "CIJENA", value: `${e.price} RSD` },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888", fontWeight: 600 }}>{item.label}</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                {e.program && (
                  <div style={{ marginTop: 16, background: "#f8fff9", borderRadius: 8, padding: 14 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#2d6a4f" }}>📋 PROGRAM</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#555", whiteSpace: "pre-line" }}>{e.program}</p>
                  </div>
                )}
                {isPast(e.eventDate) && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8 }}>💬 Utisci posetilaca:</p>
                    {reviews[e.id]?.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {reviews[e.id].map((r, idx) => (
                          <div key={idx} style={{ background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                            {r.photoUrl && <img src={r.photoUrl} alt="Fotografija" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} onError={e => { e.target.style.display = "none"; }} />}
                            <p style={{ margin: 0, fontSize: 13 }}>{r.comment}</p>
                            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#aaa" }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: 13, color: "#aaa", fontStyle: "italic" }}>Još nema utisaka.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════
  // CUSTOMER POGLED
  // ════════════════════════════════
  return (
    <div style={s.page}>
      <h2>🚜 Open Farm događaji</h2>

      {msg && (
        <div style={{ background: msg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${msg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: msg.includes("✅") ? "#1a4731" : "#721c24" }}>
          {msg}
        </div>
      )}

      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
          <p style={{ fontSize: 40 }}>🌾</p>
          <p>Nema dostupnih Open Farm događaja.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {events.map(e => {
            const farmer = farmers[e.farmerProfileId];
            const past = isPast(e.eventDate);
            const full = isFull(e);
            const registered = registeredEvents.includes(e.id);
            const isSelected = selectedEvent?.id === e.id;
            const eventReviews = reviews[e.id] || [];

            return (
              <div key={e.id} style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${past ? "#888" : full ? "#ffc107" : "#2d6a4f"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", color: "#2d6a4f" }}>{e.title}</h3>
                    <p style={{ margin: "0 0 2px", fontSize: 13, color: "#888" }}>🌾 {farmer?.farmName || "Farma"} — 📍 {farmer?.location || ""}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#666" }}>{e.description}</p>
                  </div>
                  <span style={{ ...s.badge, background: past ? "#f8f9fa" : full ? "#fff3cd" : "#d4edda", color: past ? "#888" : full ? "#856404" : "#155724", fontSize: 13, padding: "4px 14px" }}>
                    {past ? "Završen" : full ? "Popunjeno" : "✓ Slobodna mjesta"}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 16 }}>
                  {[
                    { label: "DATUM", value: new Date(e.eventDate).toLocaleString() },
                    { label: "POSETILACI", value: `${e.currentRegistrations}/${e.maxVisitors}` },
                    { label: "CIJENA", value: `${e.price} RSD` },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888", fontWeight: 600 }}>{item.label}</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {e.program && (
                  <div style={{ marginTop: 16, background: "#f8fff9", borderRadius: 8, padding: 14 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#2d6a4f" }}>📋 PROGRAM</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#555", whiteSpace: "pre-line" }}>{e.program}</p>
                  </div>
                )}

                <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {!past && !full && !registered && (
                    <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => register(e.id)}>
                      ✓ Prijavi se
                    </button>
                  )}
                  {registered && (
                    <span style={{ ...s.badge, background: "#d4edda", color: "#155724", padding: "8px 16px", fontSize: 13 }}>
                      ✓ Prijavljeni ste
                    </span>
                  )}
                  {full && !registered && !past && (
                    <span style={{ ...s.badge, background: "#fff3cd", color: "#856404", padding: "8px 16px", fontSize: 13 }}>
                      Popunjeno
                    </span>
                  )}
                  <button
                    style={{ ...s.btn, width: "auto", padding: "10px 20px", background: isSelected ? "#555" : "#6c757d" }}
                    onClick={() => { setSelectedEvent(isSelected ? null : e); setShowReviewForm(null); }}
                  >
                    💬 {isSelected ? "Sakrij utiske" : `Utisci (${eventReviews.length})`}
                  </button>
                  {past && registered && (
                    <button
                      style={{ ...s.btn, width: "auto", padding: "10px 20px", background: "#2d6a4f" }}
                      onClick={() => setShowReviewForm(showReviewForm === e.id ? null : e.id)}
                    >
                      ✍ Dodaj utisak
                    </button>
                  )}
                </div>

                {/* ← IZMIJENJENO: forma za utisak sa upload */}
                {showReviewForm === e.id && (
                  <div style={{ marginTop: 16, background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 10, padding: 16 }}>
                    <h4 style={{ margin: "0 0 12px", color: "#2d6a4f" }}>✍ Vaš utisak</h4>
                    <textarea
                      style={{ ...s.input, height: 80, resize: "vertical" }}
                      placeholder="Podijelite vaše iskustvo sa ovog događaja..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />

                    {/* Upload fotografije */}
                    <div style={{ border: "2px dashed #c3e6cb", borderRadius: 8, padding: 12, marginBottom: 12, textAlign: "center", background: "#f9fffe" }}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={uploadReviewPhoto}
                        style={{ display: "none" }}
                        id={`reviewPhoto-${e.id}`}
                      />
                      <label htmlFor={`reviewPhoto-${e.id}`} style={{ cursor: "pointer" }}>
                        {uploadingReview ? (
                          <p style={{ margin: 0, color: "#2d6a4f", fontSize: 13 }}>⏳ Uploading...</p>
                        ) : reviewForm.photoUrl ? (
                          <>
                            <img src={reviewForm.photoUrl} alt="Preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6, marginBottom: 6 }} onError={e => { e.target.style.display = "none"; }} />
                            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>Klikni da promijeniš fotografiju</p>
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: 24, margin: "0 0 4px" }}>📷</p>
                            <p style={{ margin: 0, fontSize: 13, color: "#2d6a4f", fontWeight: 500 }}>Dodaj fotografiju (opciono)</p>
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>JPG, PNG, WEBP — max 5MB</p>
                          </>
                        )}
                      </label>
                    </div>

                    {reviewMsg && <p style={{ color: reviewMsg.includes("✅") ? "green" : "red", fontSize: 13 }}>{reviewMsg}</p>}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => submitReview(e.id)} disabled={uploadingReview}>
                        Pošalji utisak
                      </button>
                      <button style={{ ...s.btn, width: "auto", padding: "10px 20px", background: "#888" }} onClick={() => { setShowReviewForm(null); setReviewForm({ comment: "", photoUrl: "" }); }}>
                        Otkaži
                      </button>
                    </div>
                  </div>
                )}

                {isSelected && (
                  <div style={{ marginTop: 16 }}>
                    {eventReviews.length === 0 ? (
                      <p style={{ fontSize: 13, color: "#aaa", fontStyle: "italic" }}>Još nema utisaka za ovaj događaj.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {eventReviews.map((r, idx) => (
                          <div key={idx} style={{ background: "#f8f9fa", borderRadius: 8, padding: 14 }}>
                            {r.photoUrl && <img src={r.photoUrl} alt="Fotografija" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6, marginBottom: 10 }} onError={e => { e.target.style.display = "none"; }} />}
                            <p style={{ margin: "0 0 4px", fontSize: 14 }}>{r.comment}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerProfileId, setCustomerProfileId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [form, setForm] = useState({ productId: "", title: "", instructions: "" });
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [generatorResult, setGeneratorResult] = useState("");
  const [generatorLoading, setGeneratorLoading] = useState(false);
  const [selectedBoxProducts, setSelectedBoxProducts] = useState([]);
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  useEffect(() => {
    // Učitaj sve recepte
    fetch(`${API}/recipes`, { headers: headers() })
      .then(r => r.json())
      .then(data => { setRecipes(Array.isArray(data) ? data : []); setFilteredRecipes(Array.isArray(data) ? data : []); })
      .catch(() => {});

    // Učitaj sve proizvode
    fetch(`${API}/products`, { headers: headers() })
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {});

    // Učitaj customer profil
    const userId = getUserId();
    if (!userId) return;
    fetch(`${API}/profiles/customer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => { if (data?.id) setCustomerProfileId(data.id); })
      .catch(() => {});
  }, []);

  // Filter po proizvodu
  useEffect(() => {
    if (!selectedProduct) {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(recipes.filter(r => r.productId === selectedProduct));
    }
  }, [selectedProduct, recipes]);

  const submit = async () => {
    if (!customerProfileId) { setMsg("❌ Potreban Customer profil!"); return; }
    if (!form.productId || !form.title || !form.instructions) { setMsg("❌ Popunite sva polja!"); return; }
    const res = await fetch(`${API}/recipes`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({
        customerProfileId,
        productId: form.productId,
        title: form.title,
        instructions: form.instructions
      })
    });
    const data = await res.json();
    if (data.id) {
      setMsg("✅ Recept dodan!");
      setForm({ productId: "", title: "", instructions: "" });
      setShowForm(false);
      // Osvježi recepte
      fetch(`${API}/recipes`, { headers: headers() })
        .then(r => r.json())
        .then(data => { setRecipes(Array.isArray(data) ? data : []); })
        .catch(() => {});
    } else {
      setMsg("❌ Greška: " + JSON.stringify(data));
    }
  };

  // Generator - "Šta da spremim sa kutijom ove nedelje"
  const generateIdeas = async () => {
    if (selectedBoxProducts.length === 0) { setGeneratorResult("❌ Izaberite bar jedan proizvod iz kutije!"); return; }
    setGeneratorLoading(true);
    setGeneratorResult("");

    const productNames = selectedBoxProducts.map(id => products.find(p => p.id === id)?.name).filter(Boolean);

    // Pronađi recepte koji koriste ove proizvode
    const matchingRecipes = recipes.filter(r => selectedBoxProducts.includes(r.productId));

    if (matchingRecipes.length > 0) {
      const suggestions = matchingRecipes.map(r => {
        const product = products.find(p => p.id === r.productId);
        return `🍽 **${r.title}** (od ${product?.name || ""})\n${r.instructions}`;
      }).join("\n\n");
      setGeneratorResult(`Pronašli smo ${matchingRecipes.length} recept(a) za vaše proizvode:\n\n${suggestions}`);
    } else {
      setGeneratorResult(`Nema recepata za: ${productNames.join(", ")}.\n\nBudite prvi koji će podijeliti recept! Kliknite "+ Dodaj recept" i podijelite sa zajednicom.`);
    }
    setGeneratorLoading(false);
  };

  const getProductName = (id) => products.find(p => p.id === id)?.name || "Nepoznat proizvod";
  const getProductCategory = (id) => products.find(p => p.id === id)?.category || "";

  const availableProducts = products.filter(p => p.status === "Available");

  return (
    <div style={s.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>🍽 Recepti zajednice</h2>
        <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Zatvori" : "+ Dodaj recept"}
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${msg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: msg.includes("✅") ? "#1a4731" : "#721c24" }}>
          {msg}
        </div>
      )}

      {/* Forma za dodavanje recepta */}
      {showForm && (
        <div style={{ background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>Podijeli recept sa zajednicom</h3>
          <div style={{ maxWidth: 600 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>PROIZVOD</label>
            <select style={s.input} value={form.productId} onChange={f("productId")}>
              <option value="">Izaberite proizvod...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
            </select>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>NAZIV RECEPTA</label>
            <input style={s.input} placeholder="npr. Jabukova pita sa cimetom" value={form.title} onChange={f("title")} />
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>UPUTSTVO ZA PRIPREMU</label>
            <textarea
              style={{ ...s.input, height: 150, resize: "vertical" }}
              placeholder="Opišite korak po korak kako se priprema jelo..."
              value={form.instructions}
              onChange={f("instructions")}
            />
            <button style={s.btn} onClick={submit}>Podijeli recept</button>
          </div>
        </div>
      )}

      {/* Generator "Šta da spremim sa kutijom" */}
      <div style={{ background: "#fffef0", border: "1px solid #ffc107", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0, color: "#856404" }}>🧺 Šta da spremim sa kutijom ove nedelje?</h3>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          Izaberite proizvode koje imate i pronađite recepte iz naše zajednice.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, marginBottom: 16 }}>
          {availableProducts.map(p => (
            <label key={p.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: selectedBoxProducts.includes(p.id) ? "#fff3cd" : "white",
              border: `1px solid ${selectedBoxProducts.includes(p.id) ? "#ffc107" : "#ddd"}`,
              borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13
            }}>
              <input
                type="checkbox"
                checked={selectedBoxProducts.includes(p.id)}
                onChange={e => {
                  if (e.target.checked) setSelectedBoxProducts([...selectedBoxProducts, p.id]);
                  else setSelectedBoxProducts(selectedBoxProducts.filter(id => id !== p.id));
                }}
              />
              <span>{p.name}</span>
              <span style={{ fontSize: 11, color: "#888", marginLeft: "auto" }}>{p.category}</span>
            </label>
          ))}
        </div>
        <button
          style={{ ...s.btn, width: "auto", padding: "10px 24px", background: "#ffc107", color: "#333" }}
          onClick={generateIdeas}
          disabled={generatorLoading}
        >
          {generatorLoading ? "Tražim recepte..." : "🔍 Pronađi recepte"}
        </button>

        {generatorResult && (
          <div style={{ marginTop: 16, background: "white", borderRadius: 8, padding: 16, border: "1px solid #ffe69c", whiteSpace: "pre-line", fontSize: 14, lineHeight: 1.7 }}>
            {generatorResult}
          </div>
        )}
      </div>

      {/* Filter i lista recepata */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: "#555" }}>Svi recepti ({filteredRecipes.length})</h3>
        <select
          style={{ ...s.input, width: 220, marginBottom: 0 }}
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
        >
          <option value="">Svi proizvodi</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {filteredRecipes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
          <p style={{ fontSize: 40 }}>🍽</p>
          <p>Nema recepata {selectedProduct ? "za ovaj proizvod" : ""}.</p>
          <button style={{ ...s.btn, width: "auto", padding: "10px 24px" }} onClick={() => setShowForm(true)}>
            Budite prvi koji dijeli recept!
          </button>
        </div>
      ) : (
        <div style={s.grid}>
          {filteredRecipes.map(r => {
            const product = products.find(p => p.id === r.productId);
            return (
              <div key={r.id} style={{ ...s.productCard, display: "flex", flexDirection: "column" }}>
                {product?.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} onError={e => { e.target.style.display = "none"; }} />
                )}
                <span style={{ ...s.badge, background: "#e8f5e9", color: "#2d6a4f", marginBottom: 8, alignSelf: "flex-start" }}>
                  🥬 {getProductName(r.productId)}
                </span>
                <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{r.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, flex: 1 }}>{r.instructions}</p>
                <p style={{ fontSize: 11, color: "#aaa", margin: "8px 0 0" }}>
                  📅 {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [customerProfileId, setCustomerProfileId] = useState("");
  const [tab, setTab] = useState("products"); // "products" | "farms"
  const [form, setForm] = useState({
    productId: "", farmerProfileId: "", rating: 5, comment: "", photoUrl: ""
  });
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterProduct, setFilterProduct] = useState("");
  const [filterFarmer, setFilterFarmer] = useState("");
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  useEffect(() => {
    fetch(`${API}/reviews`, { headers: headers() })
      .then(r => r.json()).then(data => setReviews(Array.isArray(data) ? data : [])).catch(() => {});

    fetch(`${API}/products`, { headers: headers() })
      .then(r => r.json()).then(setProducts).catch(() => {});

    fetch(`${API}/profiles/farmers`, { headers: headers() })
      .then(r => r.json()).then(setFarmers).catch(() => {});

    const userId = getUserId();
    if (!userId) return;
    fetch(`${API}/profiles/customer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => { if (data?.id) setCustomerProfileId(data.id); })
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (!customerProfileId) { setMsg("❌ Potreban Customer profil!"); return; }
    if (!form.comment) { setMsg("❌ Unesite komentar!"); return; }
    if (tab === "products" && !form.productId) { setMsg("❌ Izaberite proizvod!"); return; }
    if (tab === "farms" && !form.farmerProfileId) { setMsg("❌ Izaberite farmu!"); return; }

    const body = {
      customerProfileId,
      productId: tab === "products" ? form.productId : null,
      farmerProfileId: tab === "farms" ? form.farmerProfileId : null,
      rating: parseInt(form.rating),
      comment: form.comment,
      photoUrl: form.photoUrl || null,
      isVerifiedPurchase: false
    };

    const res = await fetch(`${API}/reviews`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    const data = await res.json();
    if (data.id) {
      setMsg("✅ Recenzija dodana!");
      setForm({ productId: "", farmerProfileId: "", rating: 5, comment: "", photoUrl: "" });
      setShowForm(false);
      fetch(`${API}/reviews`, { headers: headers() })
        .then(r => r.json()).then(data => setReviews(Array.isArray(data) ? data : [])).catch(() => {});
    } else {
      setMsg("❌ Greška: " + JSON.stringify(data));
    }
  };

  const getProductName = (id) => products.find(p => p.id === id)?.name || "Nepoznat proizvod";
  const getProductImage = (id) => products.find(p => p.id === id)?.imageUrl || null;
  const getFarmName = (id) => farmers.find(f => f.id === id)?.farmName || "Nepoznata farma";
  const getFarmLocation = (id) => farmers.find(f => f.id === id)?.location || "";

  const productReviews = reviews.filter(r => r.productId)
    .filter(r => !filterProduct || r.productId === filterProduct);
  const farmReviews = reviews.filter(r => r.farmerProfileId)
    .filter(r => !filterFarmer || r.farmerProfileId === filterFarmer);

  const currentReviews = tab === "products" ? productReviews : farmReviews;

  return (
    <div style={s.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>⭐ Recenzije</h2>
        <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Zatvori" : "+ Dodaj recenziju"}
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${msg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: msg.includes("✅") ? "#1a4731" : "#721c24" }}>
          {msg}
        </div>
      )}

      {/* Forma za dodavanje */}
      {showForm && (
        <div style={{ background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>Nova recenzija</h3>

          {/* Tab za tip recenzije */}
          <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0", marginBottom: 20 }}>
            <div style={{ flex: 1, padding: "8px 0", textAlign: "center", cursor: "pointer", fontWeight: 500, fontSize: 14, color: tab === "products" ? "#2d6a4f" : "#888", borderBottom: tab === "products" ? "2px solid #2d6a4f" : "2px solid transparent" }}
              onClick={() => setTab("products")}>🥬 Recenzija proizvoda</div>
            <div style={{ flex: 1, padding: "8px 0", textAlign: "center", cursor: "pointer", fontWeight: 500, fontSize: 14, color: tab === "farms" ? "#2d6a4f" : "#888", borderBottom: tab === "farms" ? "2px solid #2d6a4f" : "2px solid transparent" }}
              onClick={() => setTab("farms")}>🌾 Recenzija farme</div>
          </div>

          <div style={{ maxWidth: 600 }}>
            {tab === "products" ? (
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>PROIZVOD *</label>
                <select style={s.input} value={form.productId} onChange={f("productId")}>
                  <option value="">Izaberite proizvod...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>FARMA *</label>
                <select style={s.input} value={form.farmerProfileId} onChange={f("farmerProfileId")}>
                  <option value="">Izaberite farmu...</option>
                  {farmers.map(f => <option key={f.id} value={f.id}>{f.farmName} — {f.location}</option>)}
                </select>
              </div>
            )}

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>OCJENA</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map(r => (
                <button key={r} onClick={() => setForm({ ...form, rating: r })}
                  style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${form.rating >= r ? "#ffc107" : "#ddd"}`, background: form.rating >= r ? "#fff3cd" : "white", cursor: "pointer", fontSize: 20 }}>
                  ⭐
                </button>
              ))}
              <span style={{ alignSelf: "center", fontSize: 14, color: "#888" }}>{form.rating}/5</span>
            </div>

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>KOMENTAR *</label>
            <textarea
              style={{ ...s.input, height: 100, resize: "vertical" }}
              placeholder="Podijelite vaše iskustvo..."
              value={form.comment}
              onChange={f("comment")}
            />

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>URL FOTOGRAFIJE (opciono)</label>
            <input style={s.input} placeholder="https://..." value={form.photoUrl} onChange={f("photoUrl")} />
            {form.photoUrl && (
              <img src={form.photoUrl} alt="Preview" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
                onError={e => { e.target.style.display = "none"; }} />
            )}

            <button style={s.btn} onClick={submit}>Objavi recenziju</button>
          </div>
        </div>
      )}

      {/* Tabovi za prikaz */}
      <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0", marginBottom: 20 }}>
        <div style={{ flex: 1, padding: "10px 0", textAlign: "center", cursor: "pointer", fontWeight: 500, fontSize: 15, color: tab === "products" ? "#2d6a4f" : "#888", borderBottom: tab === "products" ? "2px solid #2d6a4f" : "2px solid transparent" }}
          onClick={() => setTab("products")}>🥬 Proizvodi ({productReviews.length})</div>
        <div style={{ flex: 1, padding: "10px 0", textAlign: "center", cursor: "pointer", fontWeight: 500, fontSize: 15, color: tab === "farms" ? "#2d6a4f" : "#888", borderBottom: tab === "farms" ? "2px solid #2d6a4f" : "2px solid transparent" }}
          onClick={() => setTab("farms")}>🌾 Farme ({farmReviews.length})</div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 16 }}>
        {tab === "products" ? (
          <select style={{ ...s.input, maxWidth: 300 }} value={filterProduct} onChange={e => setFilterProduct(e.target.value)}>
            <option value="">Svi proizvodi</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        ) : (
          <select style={{ ...s.input, maxWidth: 300 }} value={filterFarmer} onChange={e => setFilterFarmer(e.target.value)}>
            <option value="">Sve farme</option>
            {farmers.map(f => <option key={f.id} value={f.id}>{f.farmName}</option>)}
          </select>
        )}
      </div>

      {/* Lista recenzija */}
      {currentReviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
          <p style={{ fontSize: 40 }}>⭐</p>
          <p>Nema recenzija. Budite prvi!</p>
          <button style={{ ...s.btn, width: "auto", padding: "10px 24px" }} onClick={() => setShowForm(true)}>
            Dodajte recenziju
          </button>
        </div>
      ) : (
        <div style={s.grid}>
          {currentReviews.map(r => (
            <div key={r.id} style={{ ...s.productCard, display: "flex", flexDirection: "column" }}>
              {/* Slika */}
              {r.photoUrl ? (
                <img src={r.photoUrl} alt="Recenzija" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                  onError={e => { e.target.style.display = "none"; }} />
              ) : tab === "products" && getProductImage(r.productId) ? (
                <img src={getProductImage(r.productId)} alt="Proizvod" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                  onError={e => { e.target.style.display = "none"; }} />
              ) : null}

              {/* Naziv */}
              <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 14, color: "#2d6a4f" }}>
                {tab === "products" ? `🥬 ${getProductName(r.productId)}` : `🌾 ${getFarmName(r.farmerProfileId)}`}
              </p>
              {tab === "farms" && (
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#888" }}>📍 {getFarmLocation(r.farmerProfileId)}</p>
              )}

              {/* Ocjena */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                {[1,2,3,4,5].map(star => (
                  <span key={star} style={{ fontSize: 16, color: star <= r.rating ? "#ffc107" : "#ddd" }}>⭐</span>
                ))}
                <span style={{ fontSize: 13, color: "#888", marginLeft: 4 }}>{r.rating}/5</span>
              </div>

              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, flex: 1 }}>{r.comment}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                {r.isVerifiedPurchase && (
                  <span style={{ ...s.badge, background: "#d4edda", color: "#155724", fontSize: 11 }}>
                    ✓ Verifikovani kupac
                  </span>
                )}
                <p style={{ fontSize: 11, color: "#aaa", margin: 0, marginLeft: "auto" }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function CSA() {
  const role = getRole();

  // ─── FARMER STATE ───
  const [farmerProfileId, setFarmerProfileId] = useState("");
  const [myProducts, setMyProducts] = useState([]);
  const [templateItems, setTemplateItems] = useState({});
  const [templateName, setTemplateName] = useState("Standardna kutija");
  const [templateMsg, setTemplateMsg] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(true);

  // ─── CUSTOMER STATE ───
  const [subscriptions, setSubscriptions] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [customerProfileId, setCustomerProfileId] = useState("");
  const [form, setForm] = useState({ farmerProfileId: "", durationWeeks: 3, startDate: "" });
  const [msg, setMsg] = useState("");
  const [pauseDate, setPauseDate] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingBox, setEditingBox] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [boxItems, setBoxItems] = useState({});
  const [loadingBox, setLoadingBox] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null); // template za preview u formi
  const [weekBoxes, setWeekBoxes] = useState({}); // { "subId-week": { items: [] } }
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const weeklyPrices = { 3: 1500, 6: 1350, 12: 1200 };

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  // ─── FARMER INIT ───
  useEffect(() => {
    if (role !== "Farmer") return;
    const userId = getUserId();
    if (!userId) return;

    fetch(`${API}/profiles/farmer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (data?.id) {
          setFarmerProfileId(data.id);
          fetch(`${API}/products`, { headers: headers() })
            .then(r => r.json())
            .then(all => setMyProducts(all.filter(p => p.farmerProfileId === data.id && p.status === "Available")))
            .catch(() => {});
          fetch(`${API}/csa/template/${data.id}`, { headers: headers() })
            .then(r => r.json())
            .then(tmpl => {
              if (tmpl?.items?.length > 0) {
                setTemplateName(tmpl.name || "Standardna kutija");
                const items = {};
                tmpl.items.forEach(i => { items[i.productId] = i.quantity; });
                setTemplateItems(items);
              }
              setLoadingTemplate(false);
            })
            .catch(() => setLoadingTemplate(false));
        } else { setLoadingTemplate(false); }
      })
      .catch(() => setLoadingTemplate(false));
  }, []);

  const saveTemplate = async () => {
    if (!farmerProfileId) { setTemplateMsg("❌ Farmer profil nije učitan!"); return; }
    const items = Object.entries(templateItems).filter(([_, qty]) => qty > 0).map(([productId, quantity]) => ({ productId, quantity: parseFloat(quantity) }));
    if (items.length === 0) { setTemplateMsg("❌ Dodajte bar jedan proizvod!"); return; }
    const res = await fetch(`${API}/csa/template`, { method: "POST", headers: headers(), body: JSON.stringify({ farmerProfileId, name: templateName, items }) });
    const data = await res.json();
    if (data.id) setTemplateMsg("✅ Template sačuvan! Novi pretplatnici će automatski dobiti ovaj miks.");
    else setTemplateMsg("❌ Greška: " + JSON.stringify(data));
  };

  // ─── CUSTOMER INIT ───
  const loadSubscriptions = (custId) => {
    fetch(`${API}/csa/${custId}`, { headers: headers() })
      .then(r => r.json())
      .then(subs => {
        const arr = Array.isArray(subs) ? subs : [];
        setSubscriptions(arr);
        // Učitaj kutije za sve pretplate
        arr.forEach(sub => {
          for (let w = 1; w <= sub.durationWeeks; w++) {
            fetch(`${API}/csa/${sub.id}/box/${w}`, { headers: headers() })
              .then(r => r.json())
              .then(box => {
                if (box?.items?.length > 0) {
                  setWeekBoxes(prev => ({ ...prev, [`${sub.id}-${w}`]: box }));
                }
              }).catch(() => {});
          }
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (role !== "Customer") return;
    const userId = getUserId();
    if (!userId) return;

    fetch(`${API}/profiles/customer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => { if (data?.id) { setCustomerProfileId(data.id); loadSubscriptions(data.id); } })
      .catch(() => {});

    fetch(`${API}/profiles/farmers`, { headers: headers() }).then(r => r.json()).then(setFarmers).catch(() => {});
    fetch(`${API}/products`, { headers: headers() }).then(r => r.json()).then(setAllProducts).catch(() => {});
  }, []);

  // Kada se izabere farmer u formi, učitaj njegov template za preview
  useEffect(() => {
    if (!form.farmerProfileId) { setPreviewTemplate(null); return; }
    fetch(`${API}/csa/template/${form.farmerProfileId}`, { headers: headers() })
      .then(r => r.json())
      .then(tmpl => setPreviewTemplate(tmpl?.items?.length > 0 ? tmpl : null))
      .catch(() => setPreviewTemplate(null));
  }, [form.farmerProfileId]);

  const subscribe = async () => {
    if (!customerProfileId) { setMsg("❌ Potreban Customer profil!"); return; }
    if (!form.farmerProfileId) { setMsg("❌ Izaberite farmera!"); return; }
    if (!form.startDate) { setMsg("❌ Izaberite datum početka!"); return; }
    const res = await fetch(`${API}/csa`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ customerProfileId, farmerProfileId: form.farmerProfileId, durationWeeks: parseInt(form.durationWeeks), weeklyPrice: weeklyPrices[form.durationWeeks], startDate: new Date(form.startDate).toISOString() })
    });
    const data = await res.json();
    if (data.id) { setMsg("✅ Pretplata kreirana!"); setShowForm(false); setPreviewTemplate(null); loadSubscriptions(customerProfileId); }
    else setMsg("❌ Greška: " + JSON.stringify(data));
  };

  const pause = async (subId) => {
    const date = pauseDate[subId];
    if (!date) { setMsg("❌ Izaberite datum pauze!"); return; }
    const res = await fetch(`${API}/csa/${subId}/pause`, { method: "POST", headers: headers(), body: JSON.stringify(new Date(date).toISOString()) });
    const data = await res.json();
    if (data.success) { setMsg("✅ Pretplata pauzirana!"); setSubscriptions(subscriptions.map(s => s.id === subId ? { ...s, status: "Paused", pausedUntil: date } : s)); }
  };

  const cancel = async (subId) => {
    if (!window.confirm("Sigurno želite otkazati pretplatu?")) return;
    const res = await fetch(`${API}/csa/${subId}/cancel`, { method: "POST", headers: headers() });
    const data = await res.json();
    if (data.success) { setMsg("✅ Pretplata otkazana."); setSubscriptions(subscriptions.map(s => s.id === subId ? { ...s, status: "Cancelled" } : s)); }
  };

  const deleteSub = async (subId) => {
    try {
        const res = await fetch(`${API}/csa/delete/${subId}`, { method: "DELETE", headers: headers() });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (res.ok) {
            setMsg("✅ Pretplata uklonjena.");
            setSubscriptions(subscriptions.filter(s => s.id !== subId));
        } else {
            setMsg("❌ Greška: " + (data.error || res.status));
        }
    } catch(err) {
        setMsg("❌ Greška: " + err.message);
    }
};

  const openBoxEditor = async (sub, weekNumber) => {
    const deliveryDate = new Date(sub.startDate);
    deliveryDate.setDate(deliveryDate.getDate() + (weekNumber - 1) * 7);
    setEditingBox({ subId: sub.id, weekNumber, deliveryDate, farmerProfileId: sub.farmerProfileId });
    setLoadingBox(true);
    setBoxItems({});
    const prods = await fetch(`${API}/products`, { headers: headers() }).then(r => r.json());
    setFarmerProducts(prods.filter(p => p.farmerProfileId === sub.farmerProfileId && p.status === "Available"));
    try {
      const box = await fetch(`${API}/csa/${sub.id}/box/${weekNumber}`, { headers: headers() }).then(r => r.json());
      if (box?.items?.length > 0) {
        const items = {};
        box.items.forEach(i => { items[i.productId] = i.quantity; });
        setBoxItems(items);
      }
    } catch {}
    setLoadingBox(false);
  };

  const saveBox = async () => {
    if (!editingBox) return;
    const items = Object.entries(boxItems).filter(([_, qty]) => qty > 0).map(([productId, quantity]) => ({ productId, quantity: parseFloat(quantity) }));
    const res = await fetch(`${API}/csa/${editingBox.subId}/box/${editingBox.weekNumber}`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ deliveryDate: editingBox.deliveryDate.toISOString(), items })
    });
    const data = await res.json();
    if (data.id) {
      setMsg("✅ Kutija sačuvana!");
      setWeekBoxes(prev => ({ ...prev, [`${editingBox.subId}-${editingBox.weekNumber}`]: { items } }));
      setEditingBox(null); setBoxItems({});
    } else setMsg("❌ Greška pri čuvanju kutije.");
  };

  const getWeeks = (sub) => {
    const weeks = [];
    for (let i = 1; i <= sub.durationWeeks; i++) {
      const d = new Date(sub.startDate);
      d.setDate(d.getDate() + (i - 1) * 7);
      weeks.push({ weekNumber: i, date: d });
    }
    return weeks;
  };

  const getProductName = (id) => allProducts.find(p => p.id === id)?.name || "?";
  const getProductUnit = (id) => allProducts.find(p => p.id === id)?.unit || "";

  const statusColor = (status) => ({
    Active: { bg: "#d4edda", color: "#155724", label: "✓ Aktivna" },
    Paused: { bg: "#fff3cd", color: "#856404", label: "⏸ Pauzirana" },
    Cancelled: { bg: "#f8d7da", color: "#721c24", label: "✗ Otkazana" },
  }[status] || { bg: "#eee", color: "#333", label: status });

  const getEndDate = (startDate, weeks) => { const d = new Date(startDate); d.setDate(d.getDate() + weeks * 7); return d.toLocaleDateString(); };
  const getNextDelivery = (startDate) => {
    const start = new Date(startDate); const now = new Date(); let next = new Date(start);
    while (next <= now) next.setDate(next.getDate() + 7);
    const diff = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return { date: next.toLocaleDateString(), daysLeft: diff };
  };

  // ════════════════════════════════
  // FARMER POGLED
  // ════════════════════════════════
  if (role === "Farmer") {
    return (
      <div style={s.page}>
        <h2 style={{ marginBottom: 4 }}>🌿 CSA — Default kutija</h2>
        <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
          Definišite default sastav kutije. Kada se kupac pretplati, svaka nedelja će automatski biti popunjena ovim miksom.
        </p>
        {templateMsg && (
          <div style={{ background: templateMsg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${templateMsg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: templateMsg.includes("✅") ? "#1a4731" : "#721c24" }}>
            {templateMsg}
          </div>
        )}
        {!farmerProfileId && !loadingTemplate && (
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 8, padding: 16, marginBottom: 16 }}>⚠ Kreirajte farmer profil prvo pa se vratite ovde.</div>
        )}
        {loadingTemplate ? <p>Učitavam...</p> : (
          <>
            <div style={{ maxWidth: 500, marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>NAZIV KUTIJE</label>
              <input style={s.input} value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="npr. Voćna kutija, Mešovita kutija..." />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 12 }}>Izaberite proizvode i količine:</p>
            {myProducts.length === 0 ? (
              <p style={{ color: "#888" }}>Nemate dostupnih proizvoda. Dodajte proizvode pa se vratite.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
                {myProducts.map(p => (
                  <div key={p.id} style={{ background: "white", borderRadius: 10, padding: 14, border: templateItems[p.id] > 0 ? "1.5px solid #2d6a4f" : "1px solid #ddd", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6, marginBottom: 10 }} onError={e => { e.target.style.display = "none"; }} />}
                    <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>{p.name}</p>
                    <p style={{ margin: "0 0 10px", fontSize: 12, color: "#888" }}>{p.price} RSD / {p.unit}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                      <button onClick={() => setTemplateItems({ ...templateItems, [p.id]: Math.max(0, (templateItems[p.id] || 0) - 1) })} style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #ddd", background: "#f8f9fa", cursor: "pointer", fontSize: 18 }}>−</button>
                      <span style={{ minWidth: 50, textAlign: "center", fontWeight: 600, fontSize: 14 }}>{templateItems[p.id] || 0} {p.unit}</span>
                      <button onClick={() => setTemplateItems({ ...templateItems, [p.id]: (templateItems[p.id] || 0) + 1 })} style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #ddd", background: "#f8f9fa", cursor: "pointer", fontSize: 18 }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {Object.values(templateItems).some(q => q > 0) && (
              <div style={{ background: "#f0f9f4", border: "1px solid #c3e6cb", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <p style={{ margin: "0 0 10px", fontWeight: 600, color: "#2d6a4f" }}>📦 Pregled default kutije:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(templateItems).filter(([_, qty]) => qty > 0).map(([productId, qty]) => {
                    const p = myProducts.find(x => x.id === productId);
                    return p ? <span key={productId} style={{ background: "white", border: "1px solid #c3e6cb", borderRadius: 20, padding: "4px 12px", fontSize: 13 }}>{p.name} × {qty} {p.unit}</span> : null;
                  })}
                </div>
              </div>
            )}
            <button style={{ ...s.btn, maxWidth: 300 }} onClick={saveTemplate}>💾 Sačuvaj default kutiju</button>
          </>
        )}
      </div>
    );
  }

  // ════════════════════════════════
  // CUSTOMER POGLED
  // ════════════════════════════════
  return (
    <div style={s.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>🌿 CSA Sezonske kutije</h2>
        <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => { setShowForm(!showForm); setPreviewTemplate(null); }}>
          {showForm ? "✕ Zatvori" : "+ Nova pretplata"}
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${msg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: msg.includes("✅") ? "#1a4731" : "#721c24" }}>
          {msg}
        </div>
      )}

      {/* Forma za novu pretplatu */}
      {showForm && (
        <div style={{ background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>Nova pretplata</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>FARMER</label>
              <select style={s.input} value={form.farmerProfileId} onChange={f("farmerProfileId")}>
                <option value="">Izaberite farmera...</option>
                {farmers.map(farmer => <option key={farmer.id} value={farmer.id}>{farmer.farmName} — {farmer.location}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>TRAJANJE</label>
              <select style={s.input} value={form.durationWeeks} onChange={f("durationWeeks")}>
                <option value={3}>3 nedelje — 1.500 RSD/ned</option>
                <option value={6}>6 nedelja — 1.350 RSD/ned</option>
                <option value={12}>12 nedelja — 1.200 RSD/ned</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6 }}>DATUM POČETKA</label>
              <input style={s.input} type="date" value={form.startDate} onChange={f("startDate")} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div style={{ background: "white", borderRadius: 8, padding: 16, border: "1px solid #c3e6cb" }}>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#666", fontWeight: 600 }}>UKUPNA CIJENA</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#2d6a4f" }}>{(weeklyPrices[form.durationWeeks] * form.durationWeeks).toLocaleString()} RSD</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>{weeklyPrices[form.durationWeeks].toLocaleString()} RSD × {form.durationWeeks} nedelja</p>
            </div>
          </div>

          {/* Preview templatea */}
          {previewTemplate && (
            <div style={{ marginTop: 16, background: "white", border: "1px solid #c3e6cb", borderRadius: 10, padding: 16 }}>
              <p style={{ margin: "0 0 12px", fontWeight: 600, color: "#2d6a4f", fontSize: 14 }}>
                📦 Sadržaj kutije — <em style={{ fontWeight: 400 }}>{previewTemplate.name}</em>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {previewTemplate.items.map((item, idx) => {
                  const p = allProducts.find(x => x.id === item.productId);
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0f9f4", borderRadius: 8, padding: "8px 12px" }}>
                      {p?.imageUrl && <img src={p.imageUrl} alt={p?.name} style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />}
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{p?.name || "?"}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#2d6a4f" }}>{item.quantity} {p?.unit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 12, color: "#888" }}>
                💡 Možete izmeniti sastav svake nedelje nakon pretplate.
              </p>
            </div>
          )}
          {form.farmerProfileId && !previewTemplate && (
            <div style={{ marginTop: 16, background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 8, padding: 12, fontSize: 13, color: "#856404" }}>
              ⚠ Ovaj farmer još nije definisao sastav kutije. Nakon pretplate možete sami izabrati proizvode.
            </div>
          )}

          <button style={{ ...s.btn, marginTop: 16 }} onClick={subscribe}>Pretplati se</button>
        </div>
      )}

      {/* Editor kutije */}
      {editingBox && (
        <div style={{ background: "#fffef0", border: "1px solid #ffc107", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: "#856404" }}>📦 Nedelja {editingBox.weekNumber} — {editingBox.deliveryDate.toLocaleDateString()}</h3>
            <button onClick={() => { setEditingBox(null); setBoxItems({}); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
          </div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Izmenite sastav kutije za ovu nedelju po svojoj želji.</p>
          {loadingBox ? <p>Učitavam...</p> : farmerProducts.length === 0 ? <p style={{ color: "#888" }}>Farmer nema dostupnih proizvoda.</p> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
              {farmerProducts.map(p => (
                <div key={p.id} style={{ background: "white", borderRadius: 8, padding: 12, border: boxItems[p.id] > 0 ? "1.5px solid #2d6a4f" : "1px solid #ddd" }}>
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} onError={e => { e.target.style.display = "none"; }} />}
                  <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>{p.name}</p>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888" }}>{p.price} RSD / {p.unit}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setBoxItems({ ...boxItems, [p.id]: Math.max(0, (boxItems[p.id] || 0) - 1) })} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ddd", background: "#f8f9fa", cursor: "pointer", fontSize: 16 }}>−</button>
                    <span style={{ minWidth: 40, textAlign: "center", fontWeight: 600, fontSize: 13 }}>{boxItems[p.id] || 0} {p.unit}</span>
                    <button onClick={() => setBoxItems({ ...boxItems, [p.id]: (boxItems[p.id] || 0) + 1 })} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ddd", background: "#f8f9fa", cursor: "pointer", fontSize: 16 }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ ...s.btn, width: "auto", padding: "10px 24px" }} onClick={saveBox}>💾 Sačuvaj kutiju</button>
            <button style={{ ...s.btn, width: "auto", padding: "10px 24px", background: "#888" }} onClick={() => { setEditingBox(null); setBoxItems({}); }}>Otkaži</button>
          </div>
        </div>
      )}

      <h3 style={{ color: "#555" }}>Moje pretplate ({subscriptions.length})</h3>
      {subscriptions.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
          <p style={{ fontSize: 40 }}>📦</p>
          <p>Nemate aktivnih pretplata.</p>
          <button style={{ ...s.btn, width: "auto", padding: "10px 24px" }} onClick={() => setShowForm(true)}>Kreirajte prvu pretplatu</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {subscriptions.map(sub => {
            const st = statusColor(sub.status);
            const nextDelivery = sub.status === "Active" ? getNextDelivery(sub.startDate) : null;
            const farmer = farmers.find(f => f.id === sub.farmerProfileId);
            const weeks = getWeeks(sub);
            return (
              <div key={sub.id} style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${sub.status === "Active" ? "#2d6a4f" : sub.status === "Paused" ? "#ffc107" : "#dc3545"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", color: "#2d6a4f" }}>🌾 {farmer?.farmName || "Farma"}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#888" }}>📍 {farmer?.location || ""}</p>
                  </div>
                  <span style={{ ...s.badge, background: st.bg, color: st.color, fontSize: 13, padding: "4px 14px" }}>{st.label}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginTop: 16 }}>
                  {[
                    { label: "TRAJANJE", value: `${sub.durationWeeks} nedelja` },
                    { label: "CIJENA/NEDELJNO", value: `${sub.weeklyPrice?.toLocaleString()} RSD` },
                    { label: "POČETAK", value: new Date(sub.startDate).toLocaleDateString() },
                    { label: "KRAJ", value: getEndDate(sub.startDate, sub.durationWeeks) },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888", fontWeight: 600 }}>{item.label}</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {nextDelivery && (
                  <div style={{ marginTop: 12, background: nextDelivery.daysLeft === 1 ? "#fff3cd" : "#f0f9f4", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{nextDelivery.daysLeft === 1 ? "🔔" : "📅"}</span>
                    <span style={{ fontSize: 13, color: nextDelivery.daysLeft === 1 ? "#856404" : "#2d6a4f", fontWeight: nextDelivery.daysLeft === 1 ? 600 : 400 }}>
                      {nextDelivery.daysLeft === 1 ? "⚠ Isporuka je SUTRA!" : `Sledeća isporuka: ${nextDelivery.date} (za ${nextDelivery.daysLeft} dana)`}
                    </span>
                  </div>
                )}

                {sub.status === "Paused" && sub.pausedUntil && (
                  <div style={{ marginTop: 12, background: "#fff3cd", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#856404" }}>
                    ⏸ Pauzirana do: {new Date(sub.pausedUntil).toLocaleDateString()}
                  </div>
                )}

                {/* Nedelje sa sadržajem kutije */}
                {sub.status === "Active" && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8 }}>📦 Kutije po nedeljama:</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {weeks.map(w => {
                        const key = `${sub.id}-${w.weekNumber}`;
                        const box = weekBoxes[key];
                        const isEditing = editingBox?.subId === sub.id && editingBox?.weekNumber === w.weekNumber;
                        return (
                          <div key={w.weekNumber} style={{ border: `1px solid ${isEditing ? "#ffc107" : "#e8f5e9"}`, borderRadius: 8, overflow: "hidden" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: isEditing ? "#fffef0" : "#f8fff9" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontWeight: 600, fontSize: 13 }}>Nedelja {w.weekNumber}</span>
                                <span style={{ fontSize: 12, color: "#888" }}>📅 {w.date.toLocaleDateString()}</span>
                              </div>
                              <button onClick={() => openBoxEditor(sub, w.weekNumber)}
                                style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #c3e6cb", background: isEditing ? "#2d6a4f" : "white", color: isEditing ? "white" : "#2d6a4f", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                                {isEditing ? "✏ Uređuje se..." : "✏ Izmeni"}
                              </button>
                            </div>
                            {/* Prikaz sadržaja kutije */}
                            <div style={{ padding: "10px 14px", background: "white", borderTop: "1px solid #f0f9f4" }}>
                              {box?.items?.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                  {box.items.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0f9f4", borderRadius: 6, padding: "4px 10px", fontSize: 13 }}>
                                      <span>{getProductName(item.productId)}</span>
                                      <span style={{ color: "#2d6a4f", fontWeight: 600 }}>× {item.quantity} {getProductUnit(item.productId)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p style={{ margin: 0, fontSize: 12, color: "#aaa", fontStyle: "italic" }}>Kutija nije popunjena — kliknite Izmeni da dodate proizvode.</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sub.status === "Active" && (
                  <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input type="date" style={{ ...s.input, width: 160, marginBottom: 0 }} value={pauseDate[sub.id] || ""} min={new Date().toISOString().split("T")[0]} onChange={e => setPauseDate({ ...pauseDate, [sub.id]: e.target.value })} />
                    <button style={{ ...s.btn, width: "auto", padding: "10px 18px", background: "#ffc107", color: "#333" }} onClick={() => pause(sub.id)}>⏸ Pauziraj</button>
                    <button style={{ ...s.btn, width: "auto", padding: "10px 18px", background: "#dc3545" }} onClick={() => cancel(sub.id)}>✕ Otkaži</button>
                  </div>
                )}
               {sub.status === "Cancelled" && (
    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Pretplata je otkazana.</p>
        <button 
            style={{ ...s.btn, width: "auto", padding: "6px 14px", background: "#dc3545", fontSize: 13 }} 
            onClick={() => deleteSub(sub.id)}>
            🗑 Ukloni
        </button>
    </div>
)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}





function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1]))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    fetch(`${API}/orders/my/${userId}`, { headers: headers() }).then(r => r.json()).then(setOrders).catch(() => {});
  }, []);

  return (
    <div style={s.page}>
      <h2>Moje porudžbine</h2>
      {orders.length === 0 ? <p>Nemate porudžbina.</p> : orders.map(o => (
        <div key={o.id} style={{ ...s.productCard, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>#{o.id.slice(0, 8)}...</strong>
            <span style={{ ...s.badge, background: "#d4edda", color: "#155724" }}>{o.status}</span>
          </div>
          <p>📅 {new Date(o.createdAt).toLocaleDateString()}</p>
          <p>🚚 {o.deliveryType === "FarmPickup" ? "Lično preuzimanje" : o.deliveryType === "DropPoint" ? "Drop point" : "Kućna dostava"}</p>
          <p><strong>Ukupno: {o.totalAmount} {o.currency}</strong></p>
        </div>
      ))}
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState("farms");
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState(null);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [msg, setMsg] = useState("");
  const [rateForm, setRateForm] = useState({ EUR: "", USD: "" });

  useEffect(() => {
    loadFarmers();
    loadStats();
    loadRates();
  }, []);

  const loadFarmers = () => {
    fetch(`${API}/profiles/farmers`, { headers: headers() })
      .then(r => r.json())
      .then(data => setFarmers(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const loadStats = () => {
    fetch(`${API}/admin/stats`, { headers: headers() })
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  };

  const loadRates = () => {
    fetch(`${API}/admin/exchange-rates`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExchangeRates(data);
          const form = { EUR: "", USD: "" };
          data.forEach(r => { if (r.toCurrency in form) form[r.toCurrency] = r.rate; });
          setRateForm(form);
        }
      })
      .catch(() => {});
  };

  const verifyFarmer = async (id, verify) => {
    const endpoint = verify ? "verify" : "unverify";
    const res = await fetch(`${API}/profiles/farmer/${id}/${endpoint}`, {
      method: "POST", headers: headers()
    });
    const data = await res.json();
    if (data.success) {
      setMsg(verify ? "✅ Farma verifikovana!" : "✅ Verifikacija uklonjena.");
      setFarmers(farmers.map(f => f.id === id ? { ...f, isVerified: verify } : f));
    }
  };

  const saveRate = async (currency) => {
    const rate = parseFloat(rateForm[currency]);
    if (!rate || rate <= 0) { setMsg("❌ Unesite ispravan kurs!"); return; }
    const res = await fetch(`${API}/admin/exchange-rates`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ toCurrency: currency, rate })
    });
    const data = await res.json();
    if (data.success) {
      setMsg(`✅ Kurs za ${currency} ažuriran!`);
      loadRates();
    }
  };

  const pendingFarmers = farmers.filter(f => !f.isVerified);
  const verifiedFarmers = farmers.filter(f => f.isVerified);

  return (
    <div style={s.page}>
      <h2 style={{ marginBottom: 24 }}>⚙️ Admin panel</h2>

      {msg && (
        <div style={{ background: msg.includes("✅") ? "#f0f9f4" : "#fdf0f0", border: `1px solid ${msg.includes("✅") ? "#a8d5b5" : "#f5c6cb"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: msg.includes("✅") ? "#1a4731" : "#721c24" }}>
          {msg}
        </div>
      )}

      {/* Statistike */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Ukupno farmera", value: stats.totalFarmers, icon: "🌾", color: "#2d6a4f" },
            { label: "Verifikovano", value: stats.verifiedFarmers, icon: "✅", color: "#155724" },
            { label: "Na čekanju", value: stats.pendingFarmers, icon: "⏳", color: "#856404" },
            { label: "Kupaca", value: stats.totalCustomers, icon: "👤", color: "#0c5460" },
            { label: "Proizvoda", value: stats.totalProducts, icon: "📦", color: "#721c24" },
            { label: "Porudžbina", value: stats.totalOrders, icon: "🛒", color: "#1b1e21" },
          ].map(item => (
            <div key={item.label} style={{ background: "white", borderRadius: 10, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderTop: `3px solid ${item.color}` }}>
              <p style={{ margin: "0 0 4px", fontSize: 24 }}>{item.icon}</p>
              <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabovi */}
      <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0", marginBottom: 24 }}>
        {[
          { key: "farms", label: `🌾 Verifikacija farmi (${pendingFarmers.length} na čekanju)` },
          { key: "rates", label: "💱 Kursne liste" },
          { key: "codebooks", label: "📋 Šifarnici" },
        ].map(t => (
          <div key={t.key}
            style={{ padding: "10px 20px", cursor: "pointer", fontWeight: 500, fontSize: 14, color: tab === t.key ? "#2d6a4f" : "#888", borderBottom: tab === t.key ? "2px solid #2d6a4f" : "2px solid transparent", marginBottom: -1 }}
            onClick={() => setTab(t.key)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Verifikacija farmi */}
      {tab === "farms" && (
        <div>
          {pendingFarmers.length > 0 && (
            <>
              <h3 style={{ color: "#856404", marginBottom: 12 }}>⏳ Čekaju verifikaciju ({pendingFarmers.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {pendingFarmers.map(f => (
                  <div key={f.id} style={{ background: "white", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: "4px solid #ffc107", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px" }}>{f.farmName}</h3>
                      <p style={{ margin: "0 0 2px", fontSize: 13, color: "#888" }}>📍 {f.location}</p>
                      <p style={{ margin: "0 0 2px", fontSize: 13, color: "#888" }}>📅 {f.yearsOfWork} godina rada</p>
                      {f.certificates && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                          {f.certificates.split(",").filter(Boolean).map(cert => (
                            <span key={cert} style={{ ...s.badge, background: "#e8f5e9", color: "#2d6a4f", fontSize: 11 }}>
                              {cert === "organic" ? "🌿 Organski" : cert === "bio" ? "🍃 Bio" : "🏡 Mlado domaćinstvo"}
                            </span>
                          ))}
                        </div>
                      )}
                      <p style={{ margin: "6px 0 0", fontSize: 12, color: "#888" }}>{f.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button style={{ ...s.btn, width: "auto", padding: "8px 20px", background: "#2d6a4f" }} onClick={() => verifyFarmer(f.id, true)}>
                        ✓ Verifikuj
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 style={{ color: "#155724", marginBottom: 12 }}>✅ Verifikovane farme ({verifiedFarmers.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {verifiedFarmers.map(f => (
              <div key={f.id} style={{ background: "white", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: "4px solid #2d6a4f", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h3 style={{ margin: 0 }}>{f.farmName}</h3>
                    <span style={{ ...s.badge, background: "#d4edda", color: "#155724", fontSize: 11 }}>✓ Verifikovana</span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>📍 {f.location} — {f.yearsOfWork} godina rada</p>
                </div>
                <button style={{ ...s.btn, width: "auto", padding: "8px 20px", background: "#dc3545" }} onClick={() => verifyFarmer(f.id, false)}>
                  ✕ Ukloni verifikaciju
                </button>
              </div>
            ))}
            {verifiedFarmers.length === 0 && <p style={{ color: "#888" }}>Nema verifikovanih farmi.</p>}
          </div>
        </div>
      )}

      {/* Kursne liste */}
      {tab === "rates" && (
        <div style={{ maxWidth: 600 }}>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
            Kursevi se osvježavaju u middleware-u jednom dnevno. Baza valuta je RSD (1 RSD = 1 RSD).
          </p>
          {["EUR", "USD"].map(currency => (
            <div key={currency} style={{ background: "white", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>{currency === "EUR" ? "🇪🇺 Euro (EUR)" : "🇺🇸 Američki dolar (USD)"}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
                    Trenutni kurs: <strong>1 RSD = {rateForm[currency] || "nije postavljen"} {currency}</strong>
                  </p>
                  {exchangeRates.find(r => r.toCurrency === currency) && (
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>
                      Ažurirano: {new Date(exchangeRates.find(r => r.toCurrency === currency).updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    style={{ ...s.input, width: 140, marginBottom: 0 }}
                    type="number"
                    step="0.0001"
                    placeholder="npr. 0.0085"
                    value={rateForm[currency]}
                    onChange={e => setRateForm({ ...rateForm, [currency]: e.target.value })}
                  />
                  <button style={{ ...s.btn, width: "auto", padding: "10px 20px" }} onClick={() => saveRate(currency)}>
                    Sačuvaj
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ background: "#f0f9f4", border: "1px solid #c3e6cb", borderRadius: 8, padding: 14, marginTop: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#2d6a4f" }}>
              💡 Kursevi se automatski primjenjuju na sve cijene u API odgovorima kroz CurrencyUnitMiddleware.
              Promjena kursa stupa na snagu odmah pri sledećem osvježavanju cache-a (max 24h).
            </p>
          </div>
        </div>
      )}

      {/* Šifarnici */}
      {tab === "codebooks" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {[
            {
              title: "📦 Jedinice mere",
              items: ["kg — kilogram", "komad — komad", "litar — litar", "vez — vez", "gram — gram"]
            },
            {
              title: "💰 Valute",
              items: ["RSD — Srpski dinar", "EUR — Euro", "USD — Američki dolar"]
            },
            {
              title: "🏷 Sertifikati",
              items: ["organic — Organski", "bio — Bio sertifikat", "mlado_domacinstvo — Mlado domaćinstvo"]
            },
            {
              title: "🌱 Načini uzgoja",
              items: ["organski — Organski uzgoj", "konvencionalni — Konvencionalni uzgoj"]
            },
            {
              title: "📋 Kategorije proizvoda",
              items: ["povrće", "voće", "mlečno", "jaja", "meso", "peciva", "med", "sokovi", "suvo voće"]
            },
            {
              title: "🚚 Tipovi isporuke",
              items: ["FarmPickup — Lično na farmi", "DropPoint — Drop point", "HomeDelivery — Kućna dostava"]
            },
          ].map(section => (
            <div key={section.title} style={{ background: "white", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <h4 style={{ margin: "0 0 12px", color: "#2d6a4f" }}>{section.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {section.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#f8f9fa", borderRadius: 6, fontSize: 13 }}>
                    <span style={{ color: "#2d6a4f" }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function FarmerProfilePage() {
  const [form, setForm] = useState({
    farmName: "", description: "", location: "",
    latitude: "", longitude: "", yearsOfWork: "",
    certificates: "", isOpenFarm: false
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) { setLoading(false); return; }
    fetch(`${API}/profiles/farmer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setForm({
            farmName: data.farmName || "",
            description: data.description || "",
            location: data.location || "",
            latitude: data.latitude || "",
            longitude: data.longitude || "",
            yearsOfWork: data.yearsOfWork || "",
            certificates: data.certificates || "",
            isOpenFarm: data.isOpenFarm || false
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const submit = async () => {
    const userId = getUserId();
    if (!userId) { setMsg("Greška: nije pronađen korisnik"); return; }
    try {
      const res = await fetch(`${API}/profiles/farmer`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          userId,
          farmName: form.farmName,
          description: form.description,
          location: form.location,
          latitude: parseFloat(form.latitude) || 0,
          longitude: parseFloat(form.longitude) || 0,
          yearsOfWork: parseInt(form.yearsOfWork) || 0,
          certificates: form.certificates,
          isOpenFarm: form.isOpenFarm,
          photos: ""
        })
      });
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.id) setMsg("✅ Profil sačuvan!");
      else setMsg("Greška: " + JSON.stringify(data));
    } catch(err) {
      setMsg("Greška: " + err.message);
    }
  };

  if (loading) return <div style={s.page}><p>Učitavam profil...</p></div>;

  return (
    <div style={s.page}>
      <h2>🌾 Moj profil farme</h2>
      <div style={{ maxWidth: 600 }}>
        <input style={s.input} placeholder="Naziv farme *" value={form.farmName} onChange={f("farmName")} />
        <input style={s.input} placeholder="Opis farme" value={form.description} onChange={f("description")} />
        <input style={s.input} placeholder="Lokacija (npr. Kruševac)" value={form.location} onChange={f("location")} />
        <input style={s.input} placeholder="Geografska širina (latitude)" type="number" value={form.latitude} onChange={f("latitude")} />
        <input style={s.input} placeholder="Geografska dužina (longitude)" type="number" value={form.longitude} onChange={f("longitude")} />
        <input style={s.input} placeholder="Godine rada" type="number" value={form.yearsOfWork} onChange={f("yearsOfWork")} />

        <label style={{ display: "block", marginBottom: 8 }}>Sertifikati:</label>
        <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
          {["organic", "bio", "mlado_domacinstvo"].map(cert => (
            <label key={cert} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={form.certificates.includes(cert)}
                onChange={e => {
                  const certs = form.certificates ? form.certificates.split(",").filter(Boolean) : [];
                  if (e.target.checked) setForm({ ...form, certificates: [...certs, cert].join(",") });
                  else setForm({ ...form, certificates: certs.filter(c => c !== cert).join(",") });
                }} />
              {cert === "organic" ? "🌿 Organski" : cert === "bio" ? "🍃 Bio" : "🏡 Mlado domaćinstvo"}
            </label>
          ))}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <input type="checkbox" checked={form.isOpenFarm} onChange={e => setForm({ ...form, isOpenFarm: e.target.checked })} />
          🚜 Open Farm (posjete dozvoljene)
        </label>

        {msg && <p style={{ color: msg.includes("✅") ? "green" : "red" }}>{msg}</p>}
        <button style={s.btn} onClick={submit}>Sačuvaj profil</button>
      </div>
    </div>
  );
}


function CustomerProfilePage({ setCurrency }) {
  const [form, setForm] = useState({
    fullName: "", preferredCurrency: "RSD", preferredUnits: "metric",
    dietaryPreferences: "", allergies: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [customerProfileId, setCustomerProfileId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({ street: "", city: "", postalCode: "" });
  const [addressMsg, setAddressMsg] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const f = k => e => setForm({ ...form, [k]: e.target.value });
  const af = k => e => setAddressForm({ ...addressForm, [k]: e.target.value });

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  const loadAddresses = (userId) => {
    fetch(`${API}/profiles/customer/${userId}/addresses`, { headers: headers() })
      .then(r => r.json())
      .then(data => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) { setLoading(false); return; }
    fetch(`${API}/profiles/customer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setCustomerProfileId(data.id);
          // ← NOVO: sačuvaj u localStorage pri učitavanju
          localStorage.setItem("preferredUnits", data.preferredUnits || "metric");
          setForm({
            fullName: data.fullName || "",
            preferredCurrency: data.preferredCurrency || "RSD",
            preferredUnits: data.preferredUnits || "metric",
            dietaryPreferences: data.dietaryPreferences || "",
            allergies: data.allergies || ""
          });
          loadAddresses(userId);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const submit = async () => {
    const userId = getUserId();
    if (!userId) { setMsg("Greška: nije pronađen korisnik"); return; }
    try {
      const res = await fetch(`${API}/profiles/customer`, {
        method: "POST", headers: headers(),
        body: JSON.stringify({
          userId,
          fullName: form.fullName,
          preferredCurrency: form.preferredCurrency,
          preferredUnits: form.preferredUnits,
          dietaryPreferences: form.dietaryPreferences,
          allergies: form.allergies
        })
      });
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.id) {
  setMsg("✅ Profil sačuvan!");
  localStorage.setItem("preferredUnits", form.preferredUnits);
  setCurrency(form.preferredCurrency); // ← DODAJ OVO
}
      else setMsg("Greška: " + JSON.stringify(data));
    } catch(err) {
      setMsg("Greška: " + err.message);
    }
  };

  const addAddress = async () => {
    if (!customerProfileId) { setAddressMsg("❌ Sačuvajte profil prvo!"); return; }
    if (!addressForm.street || !addressForm.city) { setAddressMsg("❌ Ulica i grad su obavezni!"); return; }
    const res = await fetch(`${API}/profiles/customer/address`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({
        customerProfileId,
        street: addressForm.street,
        city: addressForm.city,
        postalCode: addressForm.postalCode
      })
    });
    const data = await res.json();
    if (data.id) {
      setAddressMsg("✅ Adresa dodana!");
      setAddressForm({ street: "", city: "", postalCode: "" });
      setShowAddressForm(false);
      loadAddresses(getUserId());
    } else {
      setAddressMsg("❌ Greška: " + JSON.stringify(data));
    }
  };

  const deleteAddress = async (id) => {
    const res = await fetch(`${API}/profiles/customer/address/${id}`, {
      method: "DELETE", headers: headers()
    });
    const data = await res.json();
    if (data.success) {
      setAddresses(addresses.filter(a => a.id !== id));
      setAddressMsg("✅ Adresa uklonjena.");
    }
  };

  if (loading) return <div style={s.page}><p>Učitavam profil...</p></div>;

  return (
    <div style={s.page}>
      <h2>👤 Moj profil</h2>

      {/* Osnovni podaci */}
      <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 24, maxWidth: 600 }}>
        <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>Osnovni podaci</h3>
        <input style={s.input} placeholder="Ime i prezime *" value={form.fullName} onChange={f("fullName")} />
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#666" }}>Preferirana valuta:</label>
        <select style={s.input} value={form.preferredCurrency} onChange={f("preferredCurrency")}>
          <option value="RSD">RSD - Srpski dinar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="USD">USD - Američki dolar</option>
        </select>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#666" }}>Jedinice mjere:</label>
        <select style={s.input} value={form.preferredUnits} onChange={f("preferredUnits")}>
          <option value="metric">Metrički (kg, l)</option>
          <option value="imperial">Imperijalni (lb, gal)</option>
        </select>
        <input style={s.input} placeholder="Dijetetske preferencije (npr. vegetarijanac, vegan)" value={form.dietaryPreferences} onChange={f("dietaryPreferences")} />
        <input style={s.input} placeholder="Alergije (npr. gluten, laktoza)" value={form.allergies} onChange={f("allergies")} />
        {msg && <p style={{ color: msg.includes("✅") ? "green" : "red", fontSize: 13 }}>{msg}</p>}
        <button style={s.btn} onClick={submit}>Sačuvaj profil</button>
      </div>

      {/* Adrese */}
      <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", maxWidth: 600 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: "#2d6a4f" }}>📍 Moje adrese</h3>
          <button style={{ ...s.btn, width: "auto", padding: "8px 16px", fontSize: 13 }} onClick={() => setShowAddressForm(!showAddressForm)}>
            {showAddressForm ? "✕ Zatvori" : "+ Dodaj adresu"}
          </button>
        </div>

        {addressMsg && (
          <p style={{ color: addressMsg.includes("✅") ? "green" : "red", fontSize: 13, marginBottom: 12 }}>{addressMsg}</p>
        )}

        {showAddressForm && (
          <div style={{ background: "#f8fff9", border: "1px solid #c3e6cb", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <input style={s.input} placeholder="Ulica i broj *" value={addressForm.street} onChange={af("street")} />
            <input style={s.input} placeholder="Grad *" value={addressForm.city} onChange={af("city")} />
            <input style={s.input} placeholder="Poštanski broj" value={addressForm.postalCode} onChange={af("postalCode")} />
            <button style={{ ...s.btn }} onClick={addAddress}>Dodaj adresu</button>
          </div>
        )}

        {addresses.length === 0 ? (
          <p style={{ color: "#888", fontSize: 13 }}>Nemate sačuvanih adresa.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {addresses.map(a => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8f9fa", borderRadius: 8, padding: "12px 16px" }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>{a.street}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{a.city}{a.postalCode ? `, ${a.postalCode}` : ""}</p>
                </div>
                <button onClick={() => deleteAddress(a.id)} style={{ background: "#dc3545", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>
                  🗑 Ukloni
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function MyProducts() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1]))["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    fetch(`${API}/profiles/farmer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          fetch(`${API}/products`, { headers: headers() })
            .then(r => r.json())
            .then(all => setProducts(all.filter(p => p.farmerProfileId === data.id)));
        }
      })
      .catch(() => {});
  }, []);

  const deleteProduct = async (id) => {
    await fetch(`${API}/products/${id}`, { method: "DELETE", headers: headers() });
    setProducts(products.filter(x => x.id !== id));
    setMsg("✅ Proizvod obrisan.");
  };

  return (
    <div style={s.page}>
      <h2>📦 Moji proizvodi</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {products.length === 0 ? <p>Nemate dodanih proizvoda.</p> : (
        <div style={s.grid}>
          {products.map(p => (
            <div key={p.id} style={s.productCard}>
              <h3>{p.name}</h3>
              <p style={{ color: "#888", fontSize: 13 }}>{p.category}</p>
              <p>{p.description}</p>
              <p><strong>{p.price} RSD / {p.unit}</strong></p>
              <span style={{ ...s.badge, background: p.status === "Available" ? "#d4edda" : p.status === "Coming-soon" ? "#fff3cd" : "#f8d7da", color: p.status === "Available" ? "#155724" : p.status === "Coming-soon" ? "#856404" : "#721c24" }}>
                {p.status === "Available" ? "✓ Dostupno" : p.status === "Coming-soon" ? "🕐 Uskoro" : "✗ Rasprodato"}
              </span>
              {p.note && <p style={{ fontStyle: "italic", fontSize: 13 }}>📝 {p.note}</p>}
              <button onClick={() => deleteProduct(p.id)} style={{ ...s.btn, background: "#dc3545", marginTop: 8 }}>🗑 Ukloni</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FarmerOrders() {
  const [subOrders, setSubOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
        ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch { return null; }
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    fetch(`${API}/profiles/farmer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (data?.id) {
          return fetch(`${API}/orders/farmer/${data.id}`, { headers: headers() });
        }
      })
      .then(r => r?.json())
      .then(data => {
        if (Array.isArray(data)) setSubOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.page}><p>Učitavanje...</p></div>;

  return (
    <div style={s.page}>
      <h2>📋 Porudžbine kupaca</h2>
      {subOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
          <p style={{ fontSize: 40 }}>📦</p>
          <p>Nemate primljenih porudžbina.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {subOrders.map(o => (
            <div key={o.id} style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: "4px solid #2d6a4f" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 16 }}>
                    Porudžbina #{o.id?.slice(0, 8)}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
                    Tip dostave: {o.deliveryType}
                  </p>
                </div>
                <span style={{ background: "#d4edda", color: "#155724", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  {o.status || "Nova"}
                </span>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888", fontWeight: 600 }}>UKUPNO</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{o.totalAmount} RSD</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}







export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [currency, setCurrency] = useState("RSD");
  const role = getRole();

  useEffect(() => {
    if (!token || role !== "Customer") return;
    const getUserId = () => {
      try {
        return JSON.parse(atob(token.split(".")[1]))
          ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      } catch { return null; }
    };
    const userId = getUserId();
    if (!userId) return;
    fetch(`${API}/profiles/customer/${userId}`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        if (data?.preferredCurrency) {
          setCurrency(data.preferredCurrency);
          localStorage.setItem("preferredCurrency", data.preferredCurrency);
        }
        if (data?.preferredUnits) {
          localStorage.setItem("preferredUnits", data.preferredUnits);
        }
      })
      .catch(() => {});
  }, [token]);

  if (!token) {
    if (showRegister) return <Register onBack={() => setShowRegister(false)} />;
    return <Login onLogin={t => { setToken(t); setPage("products"); }} onShowRegister={() => setShowRegister(true)} />;
  }

  return (
    <div>
      <nav style={s.nav}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>🌱 FarmFresh</span>
        <button style={s.navBtn} onClick={() => setPage("products")}>Proizvodi</button>
        {role === "Farmer" && <button style={s.navBtn} onClick={() => setPage("addProduct")}>+ Dodaj proizvod</button>}
        {role === "Farmer" && <button style={s.navBtn} onClick={() => setPage("farmerProfile")}>🌾 Moj profil</button>}
        {role === "Customer" && <button style={s.navBtn} onClick={() => setPage("customerProfile")}>👤 Moj profil</button>}
        {role === "Farmer" && <button style={s.navBtn} onClick={() => setPage("myProducts")}>📦 Moji proizvodi</button>}
        {role === "Customer" && <button style={s.navBtn} onClick={() => setPage("cart")}>🛒 Korpa ({cart.length})</button>}
        {role === "Customer" && <button style={s.navBtn} onClick={() => setPage("myOrders")}>📋 Moje porudžbine</button>}
        {role === "Farmer" && <button style={s.navBtn} onClick={() => setPage("farmerOrders")}>📋 Porudžbine kupaca</button>}
        <button style={s.navBtn} onClick={() => setPage("csa")}>CSA kutija</button>
        <button style={s.navBtn} onClick={() => setPage("openFarm")}>Open Farm</button>
        <button style={s.navBtn} onClick={() => setPage("recipes")}>🍽 Recepti</button>
        <button style={s.navBtn} onClick={() => setPage("reviews")}>Recenzije</button>
        {role === "Farmer" && <button style={s.navBtn} onClick={() => setPage("deliverySlots")}>📅 Termini</button>}
        {role === "Admin" && <button style={s.navBtn} onClick={() => setPage("admin")}>⚙️ Admin</button>}
        <span style={{ color: "white", fontSize: 13, padding: "6px 10px", background: "rgba(255,255,255,0.15)", borderRadius: 6 }}>
          {currency}
        </span>
        <button style={{ ...s.navBtn, background: "#dc3545", color: "white" }} onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("preferredUnits"); setToken(null); setCurrency("RSD"); }}>Odjava</button>
      </nav>
      {page === "products" && <Products cart={cart} setCart={setCart} currency={currency} />}
      {page === "addProduct" && <AddProduct />}
      {page === "farmerProfile" && <FarmerProfilePage />}
      {page === "customerProfile" && <CustomerProfilePage setCurrency={setCurrency} />}
      {page === "myProducts" && <MyProducts />}
      {page === "cart" && <Cart cart={cart} setCart={setCart} currency={currency} />}
      {page === "myOrders" && <MyOrders />}
      {page === "farmerOrders" && <FarmerOrders/>}
      {page === "csa" && <CSA />}
      {page === "openFarm" && <OpenFarmEvents />}
      {page === "recipes" && <Recipes />}
      {page === "reviews" && <Reviews />}
      {page === "deliverySlots" && <FarmerDeliverySlots />}
      {page === "admin" && <AdminPanel />}
    </div>
  );
}

const s = {
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f4f0" },
  card: { background: "white", padding: 40, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: 380 },
  logo: { color: "#2d6a4f", textAlign: "center" },
  title: { textAlign: "center", marginBottom: 24 },
  input: { width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box" },
  btn: { width: "100%", padding: 12, background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer" },
  nav: { background: "#2d6a4f", padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  navBtn: { background: "white", color: "#2d6a4f", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
  page: { padding: 32, maxWidth: 1100, margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: 16,alignItems: "stretch" },
  productCard: { background: "white", padding: 16, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)",display: "flex", flexDirection: "column" },
  badge: { display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: "bold" },
};

const ls = {
  wrap: {
  display: "flex",
  minHeight: "100vh",
  alignItems: "stretch",
},
  left: {
    flex: 1,
    background: "#1a4731",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 36,
    position: "relative",
    overflow: "hidden",
    
  },
  leaf1: {
    position: "absolute", top: -50, right: -50,
    width: 200, height: 200,
    borderRadius: "50% 0 50% 0",
    background: "#2d6a4f",
    opacity: 0.5,
    transform: "rotate(20deg)",
  },
  leaf2: {
    position: "absolute", bottom: 100, right: 20,
    width: 130, height: 130,
    borderRadius: "50% 0 50% 0",
    background: "#2d6a4f",
    opacity: 0.3,
    transform: "rotate(-15deg)",
  },
  leaf3: {
    position: "absolute", top: 140, left: 20,
    width: 90, height: 90,
    borderRadius: "50% 0 50% 0",
    background: "#2d6a4f",
    opacity: 0.25,
    transform: "rotate(45deg)",
  },
  leftContent: { position: "relative", zIndex: 1 },
  tagline: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  brandName: { fontSize: 26, fontWeight: 500, color: "#b7e4c7" },
  leftTitle: { fontSize: 28, fontWeight: 400, color: "#c8e6c9", lineHeight: 1.5, marginBottom: 16 },
  leftSub: { fontSize: 15, color: "#81c784", lineHeight: 1.8 },

  right: {
    flex: 1,
    background: "white",
    padding: "48px 10%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #e0e0e0",
    marginBottom: 28,
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    textAlign: "center",
    fontSize: 14,
    fontWeight: 500,
    color: "#888",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    marginBottom: -1,
  },
  tabActive: {
    color: "#2d6a4f",
    borderBottom: "2px solid #2d6a4f",
  },
  field: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    letterSpacing: "0.5px",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    background: "#fafafa",
    color: "#222",
  },
  btnPrimary: {
    width: "100%",
    padding: "12px",
    background: "#2d6a4f",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginTop: 4,
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 4,
  },
  roleBtn: {
    padding: "14px 8px",
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fafafa",
    cursor: "pointer",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  roleBtnSelected: {
    border: "1.5px solid #2d6a4f",
    background: "#f0f9f4",
    color: "#2d6a4f",
  },
  error: { color: "#c0392b", fontSize: 13, marginBottom: 8 },
  successMsg: {
    background: "#f0f9f4",
    border: "1px solid #a8d5b5",
    borderRadius: 8,
    padding: "14px 16px",
    fontSize: 13,
    color: "#1a4731",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
};
