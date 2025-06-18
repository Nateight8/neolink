export function ThreadConnector() {
  return (
    <div className="absolute left-0 top-0 w-10 h-full pointer-events-none">
      {/* Top vertical line */}
      <div className="absolute left-[9px] top-0 w-[2px] h-[24px] bg-[#343536]"></div>

      {/* Curved connector */}
      <div
        className="absolute left-0 top-[24px] w-[28px] h-[24px] border-b-2 border-l-2 border-[#343536] rounded-bl-[12px]"
        style={{ borderBottomLeftRadius: "12px" }}
      ></div>

      {/* Dot at the connection point (optional, as seen in some Reddit threads) */}
      <div className="absolute left-[27px] top-[47px] w-[4px] h-[4px] bg-[#343536] rounded-full"></div>
    </div>
  );
}
