export default function Tooltip({ disease, x, y }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 240,
        padding: 14,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: 4,
        boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <strong style={{ fontSize: 14 }}>{disease.name}</strong>
        <span style={{ color: "#777" }}>{disease.type}</span>
      </div>

      <p style={{ lineHeight: 1.5, margin: "10px 0" }}>{disease.description}</p>

      <div
        style={{
          borderTop: "1px solid #eee",
          paddingTop: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Laboratory-acquired infections</span>
        <strong>{disease.count}</strong>
      </div>
    </div>
  );
}
